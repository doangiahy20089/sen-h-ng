import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  collection,
  query,
  where,
  orderBy,
  getDocs,
  doc,
  updateDoc,
} from "firebase/firestore";
import { db } from "../../lib/firebase";
import { useAuthContext } from "../../context/AuthContext";
import { COLLECTIONS, MUC_DO_CANH_BAO } from "../../lib/constants";
import AppHeader from "../../components/AppHeader";
import { useToast } from "../../components/Toast";

interface CanhBao {
  id: string;
  mother_id: string;
  severity: string;
  question: string;
  answer: string;
  reviewed_by: string | null;
  created_at: string;
}

const SEVERITY_CONFIG: Record<
  string,
  { label: string; bg: string; text: string; icon: string }
> = {
  [MUC_DO_CANH_BAO.CAO]: {
    label: "NGUY HIỂM",
    bg: "bg-danger-bg border-red-200",
    text: "text-danger",
    icon: "blood_pressure",
  },
  [MUC_DO_CANH_BAO.TRUNG_BINH]: {
    label: "CẢNH BÁO",
    bg: "bg-warn-bg border-amber-200",
    text: "text-warn",
    icon: "event_busy",
  },
  [MUC_DO_CANH_BAO.THAP]: {
    label: "LƯU Ý",
    bg: "bg-accent-bg border-green-200",
    text: "text-accent",
    icon: "info",
  },
};

export default function CanhBaoNguyHiem() {
  const { user } = useAuthContext();
  const navigate = useNavigate();
  const { hienToast } = useToast();
  const [canhBaoList, setCanhBaoList] = useState<CanhBao[]>([]);
  const [dangTai, setDangTai] = useState(true);

  useEffect(() => {
    async function layCanhBao() {
      if (!user) return;
      try {
        const hoQ = query(
          collection(db, COLLECTIONS.HO_SO_THAI_KY),
          where("assigned_co_do_id", "==", user.uid),
        );
        const hoSnap = await getDocs(hoQ);
        const motherIds = hoSnap.docs.map((d) => d.id);

        if (motherIds.length === 0) {
          setDangTai(false);
          return;
        }

        const cbQ = query(
          collection(db, COLLECTIONS.CHATBOT_LOGS),
          where("flagged", "==", true),
          orderBy("created_at", "desc"),
        );
        const cbSnap = await getDocs(cbQ);
        const danhSach: CanhBao[] = cbSnap.docs
          .filter((d) => motherIds.includes(d.data().mother_id))
          .map((d) => ({
            id: d.id,
            mother_id: d.data().mother_id,
            severity: d.data().severity,
            question: d.data().question,
            answer: d.data().answer,
            reviewed_by: d.data().reviewed_by || null,
            created_at:
              d.data().created_at?.toDate?.().toLocaleString("vi-VN") || "",
          }));
        setCanhBaoList(danhSach);
      } catch (err) {
        console.warn("Loi lay canh bao:", err);
      } finally {
        setDangTai(false);
      }
    }
    layCanhBao();
  }, [user]);

  async function danhDauDaXem(logId: string) {
    if (!user) return;
    try {
      await updateDoc(doc(db, COLLECTIONS.CHATBOT_LOGS, logId), {
        reviewed_by: user.uid,
      });
      setCanhBaoList((prev) =>
        prev.map((cb) =>
          cb.id === logId ? { ...cb, reviewed_by: user.uid } : cb,
        ),
      );
      hienToast("Đã đánh dấu xem xét!");
    } catch (err) {
      console.warn("Loi cap nhat reviewed_by:", err);
    }
  }

  return (
    <div className="min-h-screen bg-surface pb-28 lg:pb-10">
      <AppHeader />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6">
        {/* Back button */}
        <button
          onClick={() => navigate("/co-do/bang-dieu-khien")}
          className="flex items-center gap-1 text-sm font-bold text-muted hover:text-primary transition mb-6"
        >
          <span className="material-symbols-outlined text-lg">arrow_back</span>
          Quay lại
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-danger-bg rounded-2xl flex items-center justify-center">
            <span className="material-symbols-outlined mso text-2xl text-danger">
              warning
            </span>
          </div>
          <div>
            <h1 className="text-xl font-extrabold">Cảnh báo nguy hiểm</h1>
            <p className="text-sm text-muted">
              Danh sách các cảnh báo cần xử lý
            </p>
          </div>
        </div>

        {/* Content */}
        {dangTai ? (
          <div className="p-8 text-center">
            <div className="spinner mx-auto mb-3"></div>
            <p className="text-sm text-muted">Đang tải...</p>
          </div>
        ) : canhBaoList.length === 0 ? (
          <div className="bg-card rounded-2xl p-8 shadow-sm border border-border text-center">
            <span className="material-symbols-outlined mso text-5xl text-accent mb-3">
              check_circle
            </span>
            <p className="text-sm text-accent font-semibold">
              Không có cảnh báo nào.
            </p>
            <p className="text-xs text-muted mt-1">
              Tất cả thai phụ đều ổn định.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {canhBaoList.map((cb) => {
              const config =
                SEVERITY_CONFIG[cb.severity] ||
                SEVERITY_CONFIG[MUC_DO_CANH_BAO.THAP];
              return (
                <div
                  key={cb.id}
                  className={`${config.bg} border p-5 rounded-2xl flex items-start gap-4`}
                >
                  <div
                    className={`${config.text} bg-white p-2.5 rounded-full flex-shrink-0 shadow-sm`}
                  >
                    <span className="material-symbols-outlined mso">
                      {config.icon}
                    </span>
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <span className={`text-xs font-black ${config.text}`}>
                        {config.label}
                      </span>
                      <span className="text-xs text-muted">
                        {cb.created_at}
                      </span>
                    </div>
                    <p className="text-sm mt-2">
                      <strong>Câu hỏi:</strong> {cb.question}
                    </p>
                    <p className="text-sm text-muted mt-1">
                      <strong>Trả lời:</strong> {cb.answer}
                    </p>
                    <p className="text-xs text-muted mt-2">
                      Thai phụ: {cb.mother_id.slice(0, 8)}...
                    </p>
                    <div className="mt-3">
                      {cb.reviewed_by ? (
                        <span className="inline-flex items-center gap-1 text-xs font-black bg-accent-bg text-accent px-3 py-1.5 rounded-full">
                          <span className="material-symbols-outlined text-sm">
                            check
                          </span>
                          ĐÃ XEM XÉT
                        </span>
                      ) : (
                        <button
                          onClick={() => danhDauDaXem(cb.id)}
                          className="bg-white border border-stone-200 text-sm font-bold px-5 py-2 rounded-xl hover:bg-stone-50 transition"
                        >
                          Đánh dấu đã xem
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
