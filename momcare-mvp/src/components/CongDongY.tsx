import { useState, useEffect } from "react";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../lib/firebase";
import { useAuthContext } from "../context/AuthContext";
import { COLLECTIONS } from "../lib/constants";

interface CongDongYProps {
  children: React.ReactNode;
}

/**
 * Cong Dong Y (Consent Gate)
 * Chan moi thao tac nhap lieu neu thai phu chua dong y
 */
export default function CongDongY({ children }: CongDongYProps) {
  const { user } = useAuthContext();
  const [consentStatus, setConsentStatus] = useState<boolean | null>(null);
  const [dangTai, setDangTai] = useState(true);
  const [dangXuLy, setDangXuLy] = useState(false);

  useEffect(() => {
    async function kiemTraConsent() {
      if (!user) return;
      try {
        const ref = doc(db, COLLECTIONS.HO_SO_THAI_KY, user.uid);
        const snap = await getDoc(ref);
        if (snap.exists()) {
          setConsentStatus(snap.data().consent_status === true);
        } else {
          setConsentStatus(false);
        }
      } catch (err) {
        console.warn("Loi kiem tra consent:", err);
        setConsentStatus(false);
      } finally {
        setDangTai(false);
      }
    }
    kiemTraConsent();
  }, [user]);

  async function chapNhanDongY() {
    if (!user) return;
    setDangXuLy(true);
    try {
      const ref = doc(db, COLLECTIONS.HO_SO_THAI_KY, user.uid);
      await updateDoc(ref, { consent_status: true });
      setConsentStatus(true);
    } catch (err) {
      console.warn("Loi cap nhat consent:", err);
    } finally {
      setDangXuLy(false);
    }
  }

  if (dangTai) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="spinner mx-auto mb-3"></div>
          <p className="text-sm text-muted">Đang tải...</p>
        </div>
      </div>
    );
  }

  if (consentStatus === false) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-bg via-white to-primary-soft flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white rounded-3xl shadow-xl border border-border p-8 animate-fade-up">
          <div className="w-14 h-14 mx-auto bg-primary-soft rounded-2xl flex items-center justify-center mb-4">
            <span className="material-symbols-outlined mso text-3xl text-primary">
              verified_user
            </span>
          </div>
          <h2 className="text-xl font-extrabold text-center mb-4">
            Sự đồng ý thu thập dữ liệu
          </h2>
          <div className="text-sm leading-relaxed text-stone-600 mb-6 space-y-3">
            <p>
              Sen Hồng cần sự đồng ý của bạn để thu thập và lưu trữ các thông
              tin sức khỏe sau:
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Huyết áp, cân nặng, tuần thai</li>
              <li>Lịch sử trò chuyện với trợ lý sức khỏe</li>
              <li>Thông tin dân tộc, địa bàn cư trú</li>
            </ul>
            <p>
              Dữ liệu của bạn được bảo mật và chỉ chia sẻ với cô đỡ thôn bản
              được phân công chăm sóc bạn.
            </p>
            <p className="font-semibold text-stone-700">
              Bạn có quyền từ chối. Nếu từ chối, bạn vẫn có thể xem thông tin
              nhưng không thể nhập dữ liệu mới.
            </p>
          </div>
          <button
            onClick={chapNhanDongY}
            disabled={dangXuLy}
            className="w-full py-3.5 bg-gradient-to-r from-primary to-primary-light text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition disabled:opacity-60 text-base"
          >
            {dangXuLy ? (
              <span className="flex items-center justify-center gap-2">
                <span className="spinner !border-white/30 !border-t-white"></span>
                Đang xử lý...
              </span>
            ) : (
              "Tôi đồng ý"
            )}
          </button>
          <p className="text-xs text-muted text-center mt-4">
            Bạn có thể thay đổi quyết định này bất kỳ lúc nào
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
