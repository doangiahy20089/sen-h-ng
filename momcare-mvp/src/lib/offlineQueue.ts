import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "./firebase";

const DB_NAME = "momcare_offline";
const STORE_NAME = "write_queue";
const DB_VERSION = 1;

interface QueueItem {
  id?: number;
  collectionName: string;
  data: Record<string, unknown>;
  createdAt: number;
}

function moDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => {
      const database = request.result;
      if (!database.objectStoreNames.contains(STORE_NAME)) {
        database.createObjectStore(STORE_NAME, {
          keyPath: "id",
          autoIncrement: true,
        });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

/**
 * Luu thao tac ghi vao hang doi offline (IndexedDB)
 */
export async function themVaoHangDoi(
  collectionName: string,
  data: Record<string, unknown>,
): Promise<void> {
  const database = await moDB();
  return new Promise((resolve, reject) => {
    const tx = database.transaction(STORE_NAME, "readwrite");
    const store = tx.objectStore(STORE_NAME);
    const item: QueueItem = { collectionName, data, createdAt: Date.now() };
    const request = store.add(item);
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

/**
 * Lay tat ca items trong hang doi
 */
export async function layHangDoi(): Promise<QueueItem[]> {
  const database = await moDB();
  return new Promise((resolve, reject) => {
    const tx = database.transaction(STORE_NAME, "readonly");
    const store = tx.objectStore(STORE_NAME);
    const request = store.getAll();
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

/**
 * Xoa mot item khoi hang doi (sau khi sync thanh cong)
 */
export async function xoaKhoiHangDoi(id: number): Promise<void> {
  const database = await moDB();
  return new Promise((resolve, reject) => {
    const tx = database.transaction(STORE_NAME, "readwrite");
    const store = tx.objectStore(STORE_NAME);
    const request = store.delete(id);
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

/**
 * Dong bo tat ca items trong hang doi len Firestore
 * Goi khi co mang tro lai
 */
export async function dongBoHangDoi(): Promise<{
  thanhCong: number;
  thatBai: number;
}> {
  const items = await layHangDoi();
  let thanhCong = 0;
  let thatBai = 0;

  for (const item of items) {
    try {
      await addDoc(collection(db, item.collectionName), {
        ...item.data,
        recorded_at: serverTimestamp(),
      });
      if (item.id !== undefined) {
        await xoaKhoiHangDoi(item.id);
      }
      thanhCong++;
    } catch (err) {
      console.error(`Sync that bai cho item ${item.id}:`, err);
      thatBai++;
    }
  }

  return { thanhCong, thatBai };
}

/**
 * Ghi du lieu: neu online → ghi truc tiep Firestore; neu offline → luu queue
 */
export async function ghiDuLieu(
  collectionName: string,
  data: Record<string, unknown>,
): Promise<"online" | "offline"> {
  if (navigator.onLine) {
    await addDoc(collection(db, collectionName), {
      ...data,
      recorded_at: serverTimestamp(),
    });
    return "online";
  } else {
    await themVaoHangDoi(collectionName, data);
    return "offline";
  }
}

// Lang nghe su kien online de tu dong sync
if (typeof window !== "undefined") {
  window.addEventListener("online", () => {
    dongBoHangDoi().then((ketQua) => {
      if (ketQua.thanhCong > 0) {
        console.log(`Da dong bo ${ketQua.thanhCong} ban ghi offline`);
      }
    });
  });
}
