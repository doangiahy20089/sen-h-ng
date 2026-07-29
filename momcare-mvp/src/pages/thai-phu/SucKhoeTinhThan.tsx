import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AppHeader from "../../components/AppHeader";
import {
  DANH_SACH_CAM_XUC,
  BAI_TAP_THU_GIAN,
  HOTLINE_TAM_LY,
  GIO_LAM_VIEC,
  type CamXuc,
} from "../../data/loiKhuyenTinhThan";

export default function SucKhoeTinhThan() {
  const navigate = useNavigate();
  const [camXucChon, setCamXucChon] = useState<CamXuc | null>(null);
  const [loiKhuyenIndex, setLoiKhuyenIndex] = useState(0);

  function chonCamXuc(cx: CamXuc) {
    setCamXucChon(cx);
    setLoiKhuyenIndex(Math.floor(Math.random() * cx.loiKhuyen.length));
  }

  function doiLoiKhuyen() {
    if (!camXucChon) return;
    setLoiKhuyenIndex((prev) => (prev + 1) % camXucChon.loiKhuyen.length);
  }

  return (
    <div className="min-h-screen bg-surface pb-28 lg:pb-10">
      <AppHeader />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 space-y-8">
        {/* Back button */}
        <button
          onClick={() => navigate("/thai-phu/bang-dieu-khien")}
          className="flex items-center gap-1 text-sm font-bold text-muted hover:text-primary transition"
        >
          <span className="material-symbols-outlined text-lg">arrow_back</span>
          Quay lại
        </button>

        {/* Section 1: Emotion check-in */}
        <section>
          <h2 className="text-xl font-bold flex items-center gap-2 mb-5">
            <span className="material-symbols-outlined mso text-primary">
              favorite
            </span>
            Cảm xúc của Mẹ hôm nay?
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {DANH_SACH_CAM_XUC.map((cx) => (
              <button
                key={cx.id}
                onClick={() => chonCamXuc(cx)}
                className={`group p-5 rounded-2xl bg-card border border-border hover:bg-primary hover:text-white hover:border-primary transition-all text-center space-y-2 card-hover ${
                  camXucChon?.id === cx.id ? "emotion-btn selected" : ""
                }`}
              >
                <span className="material-symbols-outlined mso text-4xl block group-hover:scale-110 transition-transform">
                  {cx.icon}
                </span>
                <span className="text-base font-bold block">{cx.ten}</span>
              </button>
            ))}
          </div>
        </section>

        {/* Section 2: Scripted advice */}
        {camXucChon && (
          <section className="animate-fade-up">
            <div className="bg-amber-50 rounded-2xl p-6 border border-amber-100 relative overflow-hidden">
              <span className="material-symbols-outlined absolute -right-4 -bottom-4 text-8xl text-amber-200/40 rotate-12">
                psychology
              </span>
              <h4 className="text-base font-bold text-amber-900 mb-2">
                Lời khuyên cho mẹ
              </h4>
              <p className="text-amber-800 text-base leading-relaxed max-w-md">
                {camXucChon.loiKhuyen[loiKhuyenIndex]}
              </p>
              <button
                onClick={doiLoiKhuyen}
                className="inline-flex items-center gap-1 text-primary font-bold text-sm mt-3"
              >
                <span className="material-symbols-outlined text-sm">
                  refresh
                </span>
                Lời khuyên khác
              </button>
            </div>
          </section>
        )}

        {/* Section 3: Call psychologist */}
        <section className="bg-card rounded-2xl p-6 shadow-sm border border-border">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 bg-danger-bg rounded-2xl flex items-center justify-center flex-shrink-0">
              <span className="material-symbols-outlined mso text-3xl text-danger">
                call
              </span>
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold mb-1">Gọi chuyên gia tâm lý</h3>
              <p className="text-sm text-muted leading-relaxed mb-4">
                Nếu mẹ cảm thấy buồn, lo lắng kéo dài hoặc cần người lắng nghe,
                đừng ngần ngại gọi cho chúng tôi. Miễn phí và bảo mật.
              </p>
              <div className="flex flex-wrap gap-3">
                <a
                  href={`tel:${HOTLINE_TAM_LY}`}
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-primary to-primary-light text-white px-6 py-3 rounded-xl font-bold shadow-lg hover:shadow-xl transition text-base"
                >
                  <span className="material-symbols-outlined mso text-xl">
                    phone
                  </span>
                  {HOTLINE_TAM_LY}
                </a>
                <span className="inline-flex items-center gap-1 text-sm text-muted">
                  <span className="material-symbols-outlined text-lg">
                    schedule
                  </span>
                  {GIO_LAM_VIEC}
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Section 4: Relaxation exercises */}
        <section>
          <h3 className="text-lg font-bold flex items-center gap-2 mb-5">
            <span className="material-symbols-outlined mso text-accent">
              self_improvement
            </span>
            Bài tập thư giãn
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {BAI_TAP_THU_GIAN.map((bt) => (
              <div
                key={bt.id}
                className="bg-card rounded-2xl p-6 shadow-sm border border-border card-hover"
              >
                <div className="w-12 h-12 bg-accent-bg rounded-2xl flex items-center justify-center mb-4">
                  <span className="material-symbols-outlined mso text-2xl text-accent">
                    {bt.icon}
                  </span>
                </div>
                <h4 className="font-bold text-base mb-1">{bt.ten}</h4>
                <p className="text-sm text-muted mb-4">{bt.moTa}</p>
                <ol className="space-y-2">
                  {bt.buoc.map((b, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-2 text-sm text-stone-600"
                    >
                      <span className="w-5 h-5 rounded-full bg-primary-soft text-primary text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                        {i + 1}
                      </span>
                      {b}
                    </li>
                  ))}
                </ol>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
