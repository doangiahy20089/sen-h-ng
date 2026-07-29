import * as functions from "firebase-functions";
import { tongHopDuLieu } from "./tongHopDuLieu";
import { xuatCsv } from "./xuatCsv";
import { datVaiTro } from "./datVaiTro";
import { ghiAuditLogChiSo, ghiAuditLogChatbot } from "./ghiAuditLog";

// Scheduled: tong hop du lieu CHI_SO_SUC_KHOE moi 24 gio
export const tongHopDuLieuHangNgay = functions
  .region("asia-southeast1")
  .pubsub.schedule("every 24 hours")
  .onRun(tongHopDuLieu);

// HTTPS Callable: xuat CSV an danh cho So Y Te
export const xuatCsvBaoCao = functions
  .region("asia-southeast1")
  .https.onCall(xuatCsv);

// HTTPS Callable: dat custom claims (admin only)
export const datVaiTroNguoiDung = functions
  .region("asia-southeast1")
  .https.onCall(datVaiTro);

// Firestore Trigger: ghi audit log khi co thay doi CHI_SO_SUC_KHOE
export const auditChiSoSucKhoe = functions
  .region("asia-southeast1")
  .firestore.document("CHI_SO_SUC_KHOE/{recordId}")
  .onCreate(ghiAuditLogChiSo);

// Firestore Trigger: ghi audit log khi co thay doi CHATBOT_LOGS
export const auditChatbotLogs = functions
  .region("asia-southeast1")
  .firestore.document("CHATBOT_LOGS/{logId}")
  .onCreate(ghiAuditLogChatbot);
