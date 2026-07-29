import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import type { ConfirmationResult } from "firebase/auth";
import { guiOTP, xacMinhOTP } from "../lib/auth";

const RECAPTCHA_CONTAINER_ID = "recaptcha-container";

export default function DangNhapPage() {
  const [soDienThoai, setSoDienThoai] = useState("+84");
  const [maOTP, setMaOTP] = useState("");
  const [buoc, setBuoc] = useState<"nhap_sdt" | "nhap_otp">("nhap_sdt");
  const [dangXuLy, setDangXuLy] = useState(false);
  const [loi, setLoi] = useState("");
  const confirmationRef = useRef<ConfirmationResult | null>(null);
  const navigate = useNavigate();

  async function xuLyGuiOTP(e: React.FormEvent) {
    e.preventDefault();
    setDangXuLy(true);
    setLoi("");
    try {
      const confirmation = await guiOTP(soDienThoai, RECAPTCHA_CONTAINER_ID);
      confirmationRef.current = confirmation;
      setBuoc("nhap_otp");
    } catch (err: unknown) {
      const fbErr = err as { code?: string; message?: string };
      setLoi(`${fbErr.code || "Lỗi"}: ${fbErr.message || "Vui lòng thử lại."}`);
    } finally {
      setDangXuLy(false);
    }
  }

  async function xuLyXacMinh(e: React.FormEvent) {
    e.preventDefault();
    if (!confirmationRef.current) return;
    setDangXuLy(true);
    setLoi("");
    try {
      await xacMinhOTP(confirmationRef.current, maOTP);
      navigate("/chon-vai-tro");
    } catch (err: unknown) {
      const fbErr = err as { code?: string };
      setLoi(`Mã OTP không đúng (${fbErr.code || "invalid"})`);
    } finally {
      setDangXuLy(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-bg via-white to-primary-soft flex items-center justify-center p-4">
      <div className="w-full max-w-md animate-fade-up">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-primary to-primary-light flex items-center justify-center text-white shadow-lg mb-4">
            <span className="material-symbols-outlined mso text-3xl">spa</span>
          </div>
          <h1 className="text-2xl font-extrabold text-primary">Sen Hồng</h1>
          <p className="text-sm text-muted mt-1">Chăm sóc mẹ & bé</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-3xl shadow-xl border border-border p-8">
          <p className="text-sm text-muted text-center mb-6 leading-relaxed">
            Chăm sóc sức khỏe mẹ bầu vùng dân tộc thiểu số
            <br />
            Huyện Định Quán, Đồng Nai
          </p>

          {buoc === "nhap_sdt" ? (
            <form onSubmit={xuLyGuiOTP} className="space-y-5">
              <div>
                <label className="text-xs font-bold text-muted uppercase tracking-wider block mb-1.5">
                  Số điện thoại
                </label>
                <input
                  className="w-full bg-stone-100 border-none rounded-xl px-4 py-3.5 text-base focus:ring-2 focus:ring-primary/30 outline-none"
                  type="tel"
                  value={soDienThoai}
                  onChange={(e) => setSoDienThoai(e.target.value)}
                  placeholder="+84xxxxxxxxx"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={dangXuLy}
                className="w-full py-3.5 bg-gradient-to-r from-primary to-primary-light text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition disabled:opacity-60 text-base"
              >
                {dangXuLy ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="spinner !border-white/30 !border-t-white"></span>
                    Đang gửi...
                  </span>
                ) : (
                  "Gửi mã OTP"
                )}
              </button>
            </form>
          ) : (
            <form onSubmit={xuLyXacMinh} className="space-y-5">
              <div>
                <label className="text-xs font-bold text-muted uppercase tracking-wider block mb-1.5">
                  Mã OTP gửi đến {soDienThoai}
                </label>
                <input
                  className="w-full bg-stone-100 border-none rounded-xl px-4 py-3.5 text-center text-xl tracking-[8px] font-bold focus:ring-2 focus:ring-primary/30 outline-none"
                  type="text"
                  value={maOTP}
                  onChange={(e) => setMaOTP(e.target.value)}
                  placeholder="------"
                  maxLength={6}
                  required
                />
              </div>
              <button
                type="submit"
                disabled={dangXuLy}
                className="w-full py-3.5 bg-gradient-to-r from-primary to-primary-light text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition disabled:opacity-60 text-base"
              >
                {dangXuLy ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="spinner !border-white/30 !border-t-white"></span>
                    Đang xác minh...
                  </span>
                ) : (
                  "Xác nhận"
                )}
              </button>
              <button
                type="button"
                onClick={() => setBuoc("nhap_sdt")}
                className="w-full py-3 border-2 border-stone-200 text-stone-600 font-bold rounded-xl hover:bg-stone-50 transition text-sm"
              >
                Đổi số điện thoại
              </button>
            </form>
          )}

          {loi && (
            <p className="mt-4 text-sm text-danger bg-danger-bg rounded-xl px-4 py-3 font-medium">
              {loi}
            </p>
          )}
        </div>

        <p className="text-center text-xs text-muted mt-6">
          Hỗ trợ: 1900-9095 (miễn phí)
        </p>
      </div>

      <div id={RECAPTCHA_CONTAINER_ID} />
    </div>
  );
}
