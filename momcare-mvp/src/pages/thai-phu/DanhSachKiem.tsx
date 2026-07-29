import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CHECKLIST_THAI_KY } from "../../data/checklist";
import AppHeader from "../../components/AppHeader";

export default function DanhSachKiem() {
  const navigate = useNavigate();
  const [checklist, setChecklist] = useState(CHECKLIST_THAI_KY);

  function toggleItem(tamCaIndex: number, itemId: string) {
    setChecklist((prev) =>
      prev.map((tamCa, i) =>
        i === tamCaIndex
          ? {
              ...tamCa,
              items: tamCa.items.map((item) =>
                item.id === itemId
                  ? { ...item, hoanThanh: !item.hoanThanh }
                  : item,
              ),
            }
          : tamCa,
      ),
    );
  }

  return (
    <div className="min-h-screen bg-surface pb-28 lg:pb-10">
      <AppHeader />

      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-6">
        {/* Back button */}
        <button
          onClick={() => navigate("/thai-phu/bang-dieu-khien")}
          className="flex items-center gap-1 text-sm font-bold text-muted hover:text-primary transition mb-6"
        >
          <span className="material-symbols-outlined text-lg">arrow_back</span>
          Quay lại
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-accent-bg rounded-2xl flex items-center justify-center">
            <span className="material-symbols-outlined mso text-2xl text-accent">
              checklist
            </span>
          </div>
          <div>
            <h1 className="text-xl font-extrabold">Danh sách kiểm thai kỳ</h1>
            <p className="text-sm text-muted">Theo dõi các mốc quan trọng</p>
          </div>
        </div>

        {/* Checklist sections */}
        <div className="space-y-5">
          {checklist.map((tamCa, tamCaIndex) => {
            const soHoanThanh = tamCa.items.filter((i) => i.hoanThanh).length;
            const phanTram = Math.round(
              (soHoanThanh / tamCa.items.length) * 100,
            );
            return (
              <div
                key={tamCa.ten}
                className="bg-card rounded-2xl p-6 shadow-sm border border-border"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-base">{tamCa.ten}</h3>
                  <span className="text-xs font-black px-3 py-1.5 bg-primary-soft text-primary rounded-full">
                    {tamCa.tuanTu}
                  </span>
                </div>

                {/* Progress bar */}
                <div className="mb-4">
                  <div className="flex justify-between text-xs text-muted font-semibold mb-1.5">
                    <span>
                      {soHoanThanh}/{tamCa.items.length} hoàn thành
                    </span>
                    <span>{phanTram}%</span>
                  </div>
                  <div className="h-2 bg-stone-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-primary to-primary-light rounded-full transition-all duration-300"
                      style={{ width: `${phanTram}%` }}
                    />
                  </div>
                </div>

                {/* Items */}
                <div className="space-y-2">
                  {tamCa.items.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => toggleItem(tamCaIndex, item.id)}
                      className={`w-full flex items-center gap-3 p-3.5 rounded-xl transition text-left ${
                        item.hoanThanh
                          ? "bg-accent-bg/50 opacity-70"
                          : "bg-surface hover:bg-primary-soft/30"
                      }`}
                    >
                      <div
                        className={`w-6 h-6 rounded-lg border-2 flex-shrink-0 flex items-center justify-center transition ${
                          item.hoanThanh
                            ? "bg-accent border-accent"
                            : "border-primary/40"
                        }`}
                      >
                        {item.hoanThanh && (
                          <span className="material-symbols-outlined text-white text-sm">
                            check
                          </span>
                        )}
                      </div>
                      <span
                        className={`text-sm font-medium ${
                          item.hoanThanh
                            ? "line-through text-muted"
                            : "text-stone-700"
                        }`}
                      >
                        {item.noiDung}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
