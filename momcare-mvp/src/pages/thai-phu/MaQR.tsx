import { useNavigate } from "react-router-dom";
import { QRCodeSVG } from "qrcode.react";
import { useAuthContext } from "../../context/AuthContext";
import AppHeader from "../../components/AppHeader";

export default function MaQR() {
  const { user } = useAuthContext();
  const navigate = useNavigate();

  if (!user) return null;

  return (
    <div className="min-h-screen bg-surface pb-28 lg:pb-10">
      <AppHeader />

      <div className="max-w-md mx-auto px-4 sm:px-6 py-6">
        {/* Back button */}
        <button
          onClick={() => navigate("/thai-phu/bang-dieu-khien")}
          className="flex items-center gap-1 text-sm font-bold text-muted hover:text-primary transition mb-6"
        >
          <span className="material-symbols-outlined text-lg">arrow_back</span>
          Quay lại
        </button>

        {/* QR Card */}
        <div className="bg-card rounded-3xl shadow-sm border border-border p-8 text-center animate-fade-up">
          <div className="w-14 h-14 mx-auto bg-primary-soft rounded-2xl flex items-center justify-center mb-4">
            <span className="material-symbols-outlined mso text-3xl text-primary">
              qr_code
            </span>
          </div>
          <h1 className="text-xl font-extrabold mb-2">Mã QR của tôi</h1>
          <p className="text-sm text-muted mb-8 leading-relaxed">
            Đưa mã này cho cô đỡ thôn bản để quét và liên kết hồ sơ
          </p>

          <div className="inline-block p-6 bg-white rounded-2xl border-2 border-dashed border-primary/20 shadow-inner">
            <QRCodeSVG
              value={JSON.stringify({ mother_id: user.uid, app: "SenHong" })}
              size={200}
              level="M"
            />
          </div>

          <p className="mt-6 text-xs text-muted break-all">ID: {user.uid}</p>
        </div>
      </div>
    </div>
  );
}
