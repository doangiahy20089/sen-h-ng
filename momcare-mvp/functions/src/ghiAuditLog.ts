import * as admin from "firebase-admin";
import { FirestoreEvent, Change } from "firebase-functions/firestore";
import {
  QueryDocumentSnapshot,
  DocumentSnapshot,
} from "firebase-functions/v1/firestore";

const db = admin.firestore();

/**
 * Firestore Trigger: ghi AUDIT_LOG khi co ban ghi moi trong CHI_SO_SUC_KHOE
 * Dam bao moi thao tac nhay cam deu co vet kiem toan
 */
export async function ghiAuditLogChiSo(
  event: FirestoreEvent<
    Change<DocumentSnapshot> | undefined,
    { recordId: string }
  >,
): Promise<void> {
  const snapshot = event.data;
  if (!snapshot || !snapshot.after) return;

  const data = snapshot.after.data();
  if (!data) return;

  await db.collection("AUDIT_LOG").add({
    actor_id: data.mother_id || "unknown",
    action: "CREATE_CHI_SO_SUC_KHOE",
    target_collection: "CHI_SO_SUC_KHOE",
    target_doc_id: event.params.recordId,
    timestamp: admin.firestore.FieldValue.serverTimestamp(),
  });
}

/**
 * Firestore Trigger: ghi AUDIT_LOG khi co ban ghi moi trong CHATBOT_LOGS
 * Dac biet quan trong cho viec theo doi canh bao nguy hiem
 */
export async function ghiAuditLogChatbot(
  event: FirestoreEvent<
    Change<DocumentSnapshot> | undefined,
    { logId: string }
  >,
): Promise<void> {
  const snapshot = event.data;
  if (!snapshot || !snapshot.after) return;

  const data = snapshot.after.data();
  if (!data) return;

  await db.collection("AUDIT_LOG").add({
    actor_id: data.mother_id || "unknown",
    action: data.flagged ? "CREATE_CHATBOT_LOG_FLAGGED" : "CREATE_CHATBOT_LOG",
    target_collection: "CHATBOT_LOGS",
    target_doc_id: event.params.logId,
    timestamp: admin.firestore.FieldValue.serverTimestamp(),
  });
}
