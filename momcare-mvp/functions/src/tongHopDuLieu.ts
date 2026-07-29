import * as admin from "firebase-admin";

admin.initializeApp();
const db = admin.firestore();

interface BanGhiTongHop {
  huyen: string;
  huyet_ap_tb: number;
  can_nang_tb: number;
  tuan_thai_tb: number;
  tong_ban_ghi: number;
  ky_bat_dau: string;
  ky_ket_thuc: string;
}

/**
 * Scheduled function: tong hop CHI_SO_SUC_KHOE theo huyen
 * Chay moi 24 gio, ghi ket qua vao BAO_CAO_TONG_HOP
 */
export async function tongHopDuLieu(): Promise<void> {
  const snapshot = await db.collection("CHI_SO_SUC_KHOE").get();

  if (snapshot.empty) {
    console.log("Khong co du lieu de tong hop");
    return;
  }

  // Gom nhom theo huyen (lay tu HO_SO_THAI_KY)
  const nhomTheoHuyen: Record<
    string,
    { huyetAp: number[]; canNang: number[]; tuanThai: number[] }
  > = {};

  for (const docSnap of snapshot.docs) {
    const data = docSnap.data();
    const motherId = data.mother_id;

    // Lay huyen tu ho so thai ky
    const hoSo = await db.collection("HO_SO_THAI_KY").doc(motherId).get();
    const huyen = hoSo.exists ? hoSo.data()?.huyen || "Khong ro" : "Khong ro";

    if (!nhomTheoHuyen[huyen]) {
      nhomTheoHuyen[huyen] = { huyetAp: [], canNang: [], tuanThai: [] };
    }

    // Parse huyet ap (lay so dau - systolic)
    const haSystolic = parseInt(String(data.huyet_ap).split("/")[0], 10);
    if (!isNaN(haSystolic)) {
      nhomTheoHuyen[huyen].huyetAp.push(haSystolic);
    }
    if (typeof data.can_nang === "number") {
      nhomTheoHuyen[huyen].canNang.push(data.can_nang);
    }
    if (typeof data.tuan_thai === "number") {
      nhomTheoHuyen[huyen].tuanThai.push(data.tuan_thai);
    }
  }

  const now = new Date();
  const kyKetThuc = now.toISOString().split("T")[0];
  const kyBatDau = new Date(now.getTime() - 24 * 60 * 60 * 1000)
    .toISOString()
    .split("T")[0];

  // Ghi bao cao tong hop
  for (const [huyen, duLieu] of Object.entries(nhomTheoHuyen)) {
    const baoCao: BanGhiTongHop = {
      huyen,
      huyet_ap_tb: tinhTrungBinh(duLieu.huyetAp),
      can_nang_tb: tinhTrungBinh(duLieu.canNang),
      tuan_thai_tb: tinhTrungBinh(duLieu.tuanThai),
      tong_ban_ghi: duLieu.canNang.length,
      ky_bat_dau: kyBatDau,
      ky_ket_thuc: kyKetThuc,
    };

    await db.collection("BAO_CAO_TONG_HOP").add({
      ...baoCao,
      created_at: admin.firestore.FieldValue.serverTimestamp(),
    });
  }

  console.log(`Da tong hop ${Object.keys(nhomTheoHuyen).length} huyen`);
}

function tinhTrungBinh(mang: number[]): number {
  if (mang.length === 0) return 0;
  const tong = mang.reduce((a, b) => a + b, 0);
  return Math.round((tong / mang.length) * 10) / 10;
}
