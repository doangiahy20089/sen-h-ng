import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../../context/AuthContext";
import { COLLECTIONS } from "../../lib/constants";
import { ghiDuLieu } from "../../lib/offlineQueue";
import CongDongY from "../../components/CongDongY";
import AppHeader from "../../components/AppHeader";
import { useToast } from "../../components/Toast";

export default function NhapChiSo() {
  const { user } = useAuthContext();
  const navigate = useNavigate();
  const { hienToast } = useToast();
  const [huyetAp, setHuyetAp] = useState("");
  const [canNang, setCanNang] = useState("");
  const [tuanThai, setTuanThai] = useState("");
  const [dangXuLy, setDangXuLy] = useState(false);

  async function xuLyLuu(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;
    setDangXuLy(true);

    try {
      const ketQua = await ghiDuLieu(COLLECTIONS.CHI_SO_SUC_KHOE, {
        mother_id: user.uid,
        huyet_ap: huyetAp,
        can_nang: parseFloat(canNang),
        tuan_thai: parseInt(tuanThai, 10),
      });

      if (ketQua === "online") {
        hienToast("Đã lưu chỉ số thành công!");
      } else {
        hienToast("Đã lưu ngoại tuyến. Sẽ đồng bộ khi có mạng.");
      }

      setHuyetAp("");
      setCanNang("");
      setTuanThai("");
    } catch (err) {
      hienToast("Lỗi khi lưu. Vui lòng thử lại.");
      console.error(err);
    } finally {
      setDangXuLy(false);
    }
  }

  return (
    <CongDongY>
      <div className="min-h-screen bg-surface pb-28 lg:pb-10">
        <AppHeader />

        <div className="max-w-lg mx-auto px-4 sm:px-6 py-6">
          {/* Back button */}
          <button
            onClick={() => navigate("/thai-phu/bang-dieu-khien")}
            className="flex items-center gap-1 text-sm font-bold text-muted hover:text-primary transition mb-6"
          >
            <span className="material-symbols-outlined text-lg">
              arrow_back
            </span>
            Quay lại
          </button>

          {/* Form card */}
          <div className="bg-card rounded-3xl shadow-sm border border-border p-8 animate-fade-up">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-primary-soft rounded-2xl flex items-center justify-center">
                <span className="material-symbols-outlined mso text-2xl text-primary">
                  edit
                </span>
              </div>
              <div>
                <h1 className="text-xl font-extrabold">
                  Cập nhật chỉ số sức khỏe
                </h1>
                <p className="text-sm text-muted">Theo dõi thai kỳ hàng tuần</p>
              </div>
            </div>

            <form onSubmit={xuLyLuu} className="space-y-5">
              <div>
                <label className="text-xs font-bold text-muted uppercase tracking-wider block mb-1.5">
                  Huyết áp (mmHg)
                </label>
                <input
                  className="w-full bg-stone-100 border-none rounded-xl px-4 py-3.5 text-base focus:ring-2 focus:ring-primary/30 outline-none"
                  type="text"
                  value={huyetAp}
                  onChange={(e) => setHuyetAp(e.target.value)}
                  placeholder="VD: 120/80"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-bold text-muted uppercase tracking-wider block mb-1.5">
                  Cân nặng (kg)
                </label>
                <input
                  className="w-full bg-stone-100 border-none rounded-xl px-4 py-3.5 text-base focus:ring-2 focus:ring-primary/30 outline-none"
                  type="number"
                  step="0.1"
                  value={canNang}
                  onChange={(e) => setCanNang(e.target.value)}
                  placeholder="VD: 55.5"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-bold text-muted uppercase tracking-wider block mb-1.5">
                  Tuần thai
                </label>
                <input
                  className="w-full bg-stone-100 border-none rounded-xl px-4 py-3.5 text-base focus:ring-2 focus:ring-primary/30 outline-none"
                  type="number"
                  min="1"
                  max="42"
                  value={tuanThai}
                  onChange={(e) => setTuanThai(e.target.value)}
                  placeholder="VD: 24"
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
                    Đang lưu...
                  </span>
                ) : (
                  "Lưu chỉ số"
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </CongDongY>
  );
}
