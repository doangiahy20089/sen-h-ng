import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../lib/firebase";
import { useAuthContext } from "../../context/AuthContext";
import { COLLECTIONS } from "../../lib/constants";
import QRScanner from "../../components/QRScanner";
import AppHeader from "../../components/AppHeader";
import { useToast } from "../../components/Toast";

export default function QuetQR() {
  const navigate = useNavigate();
  const { user } = useAuthContext();
  const { hienToast } = useToast();

  const xuLyQuetThanhCong = useCallback(
    async (ketQua: string) => {
      try {
        const parsed = JSON.parse(ketQua);
        const motherId = parsed.mother_id;

        if (!motherId) {
          hienToast("Mã QR không hợp lệ.");
          return;
        }

        if (user) {
          const ref = doc(db, COLLECTIONS.HO_SO_THAI_KY, motherId);
          await updateDoc(ref, { assigned_co_do_id: user.uid });
          hienToast("Liên kết thành công!");
          navigate(`/co-do/ho/${motherId}`);
        }
      } catch {
        hienToast("Không thể đọc mã QR. Vui lòng thử lại.");
      }
    },
    [user, navigate, hienToast],
  );

  return (
    <div className="min-h-screen bg-surface pb-28 lg:pb-10">
      <AppHeader />

      <div className="max-w-md mx-auto px-4 sm:px-6 py-6">
        {/* Back button */}
        <button
          onClick={() => navigate("/co-do/bang-dieu-khien")}
          className="flex items-center gap-1 text-sm font-bold text-muted hover:text-primary transition mb-6"
        >
          <span className="material-symbols-outlined text-lg">arrow_back</span>
          Quay lại
        </button>

        {/* Scanner card */}
        <div className="bg-card rounded-3xl shadow-sm border border-border p-8 text-center animate-fade-up">
          <div className="w-14 h-14 mx-auto bg-primary-soft rounded-2xl flex items-center justify-center mb-4">
            <span className="material-symbols-outlined mso text-3xl text-primary">
              qr_code_scanner
            </span>
          </div>
          <h1 className="text-xl font-extrabold mb-2">Quét mã QR</h1>
          <p className="text-sm text-muted mb-6 leading-relaxed">
            Quét mã QR của thai phụ để liên kết hồ sơ với bạn
          </p>

          <div className="rounded-2xl overflow-hidden border-2 border-dashed border-primary/20">
            <QRScanner onQuetThanhCong={xuLyQuetThanhCong} />
          </div>
        </div>
      </div>
    </div>
  );
}
