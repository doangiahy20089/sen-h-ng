import * as admin from "firebase-admin";
import { CallableRequest, HttpsError } from "firebase-functions/v2/https";

/**
 * HTTPS Callable: dat custom claims (role) cho nguoi dung
 * Chi admin moi duoc goi function nay
 * Dung de phan quyen: 'pregnant_woman' | 'midwife'
 */
export async function datVaiTro(
  request: CallableRequest,
): Promise<{ thanhCong: boolean }> {
  // Kiem tra dang nhap
  if (!request.auth) {
    throw new HttpsError("unauthenticated", "Can dang nhap");
  }

  // Chi admin duoc set role
  const callerRole = request.auth.token.role;
  if (callerRole !== "admin") {
    throw new HttpsError(
      "permission-denied",
      "Chi quan tri vien duoc dat vai tro",
    );
  }

  const { uid, role } = request.data as { uid: string; role: string };

  if (!uid || !role) {
    throw new HttpsError("invalid-argument", "Thieu uid hoac role");
  }

  const hopLe = ["pregnant_woman", "midwife", "admin"];
  if (!hopLe.includes(role)) {
    throw new HttpsError(
      "invalid-argument",
      `Role khong hop le. Chap nhan: ${hopLe.join(", ")}`,
    );
  }

  await admin.auth().setCustomUserClaims(uid, { role });

  console.log(`Da dat role '${role}' cho user ${uid}`);
  return { thanhCong: true };
}
