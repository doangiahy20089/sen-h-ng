import * as admin from "firebase-admin";
import { CallableRequest, HttpsError } from "firebase-functions/v2/https";

const db = admin.firestore();
const bucket = admin.storage().bucket();

/**
 * HTTPS Callable: xuat bao cao tong hop thanh CSV an danh
 * Chi role 'midwife' hoac admin duoc goi
 * Tra ve signed URL de tai file CSV tu Cloud Storage
 */
export async function xuatCsv(
  request: CallableRequest,
): Promise<{ url: string }> {
  // Kiem tra quyen
  if (!request.auth) {
    throw new HttpsError("unauthenticated", "Can dang nhap de xuat bao cao");
  }

  const role = request.auth.token.role;
  if (role !== "midwife" && role !== "admin") {
    throw new HttpsError(
      "permission-denied",
      "Chi co do hoac quan tri vien duoc xuat bao cao",
    );
  }

  // Doc du lieu tong hop
  const snapshot = await db.collection("BAO_CAO_TONG_HOP").get();

  if (snapshot.empty) {
    throw new HttpsError(
      "not-found",
      "Chua co du lieu tong hop. Vui long doi function tong hop chay.",
    );
  }

  // Tao CSV (an danh - khong co mother_id)
  const header =
    "huyen,huyet_ap_tb,can_nang_tb,tuan_thai_tb,tong_ban_ghi,ky_bat_dau,ky_ket_thuc";
  const rows = snapshot.docs.map((doc) => {
    const d = doc.data();
    return `${d.huyen},${d.huyet_ap_tb},${d.can_nang_tb},${d.tuan_thai_tb},${d.tong_ban_ghi},${d.ky_bat_dau},${d.ky_ket_thuc}`;
  });

  const csvContent = [header, ...rows].join("\n");

  // Upload len Cloud Storage
  const fileName = `csv_exports/bao_cao_${new Date().toISOString().split("T")[0]}.csv`;
  const file = bucket.file(fileName);
  await file.save(csvContent, {
    metadata: {
      contentType: "text/csv",
    },
  });

  // Tao signed URL (co hieu luc 24 gio)
  const [url] = await file.getSignedUrl({
    action: "read",
    expires: Date.now() + 24 * 60 * 60 * 1000,
  });

  return { url };
}
