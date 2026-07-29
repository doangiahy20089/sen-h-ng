import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../lib/firebase";
import { useAuthContext } from "../context/AuthContext";
import {
  COLLECTIONS,
  VAI_TRO,
  VAI_TRO_LABEL,
  VAI_TRO_ICON,
  DAN_TOC_MUC_TIEU,
  THI_TRAN,
  DANH_SACH_XA,
  HUYEN_THI_DIEM,
} from "../lib/constants";
import type { VaiTro } from "../lib/constants";

const ROUTE_MAP: Record<string, string> = {
  [VAI_TRO.THAI_PHU]: "/thai-phu/bang-dieu-khien",
  [VAI_TRO.CO_DO]: "/co-do/bang-dieu-khien",
  [VAI_TRO.TRAM_Y_TE]: "/co-do/bang-dieu-khien",
  [VAI_TRO.TTYT_HUYEN]: "/co-do/bang-dieu-khien",
  [VAI_TRO.SO_Y_TE]: "/co-do/bang-dieu-khien",
  [VAI_TRO.ADMIN]: "/co-do/bang-dieu-khien",
};

export default function ChonVaiTroPage() {
  const { user, capNhatVaiTro } = useAuthContext();
  const navigate = useNavigate();
  const [dangXuLy, setDangXuLy] = useState(false);
  const [xaChon, setXaChon] = useState<string>(THI_TRAN);
  const [vaiTroChon, setVaiTroChon] = useState<VaiTro | null>(null);

  async function xacNhanVaiTro() {
    if (!user || !vaiTroChon) return;
    setDangXuLy(true);

    capNhatVaiTro(vaiTroChon);
    navigate(ROUTE_MAP[vaiTroChon]);

    if (vaiTroChon === VAI_TRO.THAI_PHU) {
      try {
        await setDoc(doc(db, COLLECTIONS.HO_SO_THAI_KY, user.uid), {
          assigned_co_do_id: "",
          tram_y_te_id: "",
          huyen: HUYEN_THI_DIEM,
          xa: xaChon,
          dan_toc: DAN_TOC_MUC_TIEU,
          consent_status: false,
          created_at: serverTimestamp(),
        });
      } catch (err) {
        console.warn("Chua ghi duoc ho so Firestore:", err);
      }
    }

    setDangXuLy(false);
  }

  const danhSachVaiTro = Object.values(VAI_TRO);

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-bg via-white to-primary-soft flex items-center justify-center p-4">
      <div className="w-full max-w-lg animate-fade-up">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-primary to-primary-light flex items-center justify-center text-white shadow-lg mb-4">
            <span className="material-symbols-outlined mso text-3xl">spa</span>
          </div>
          <h1 className="text-2xl font-extrabold text-primary">Sen Hồng</h1>
          <p className="text-sm text-muted mt-1">
            Chọn vai trò của bạn để tiếp tục
          </p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-3xl shadow-xl border border-border p-8">
          {/* Role grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
            {danhSachVaiTro.map((vt) => (
              <button
                key={vt}
                onClick={() => setVaiTroChon(vt)}
                disabled={dangXuLy}
                className={`flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all text-center ${
                  vaiTroChon === vt
                    ? "border-primary bg-primary-soft shadow-md"
                    : "border-border bg-card hover:border-primary/30 hover:bg-primary-bg"
                }`}
              >
                <span
                  className={`material-symbols-outlined mso text-3xl ${
                    vaiTroChon === vt ? "text-primary" : "text-stone-400"
                  }`}
                >
                  {VAI_TRO_ICON[vt]}
                </span>
                <span
                  className={`text-xs font-bold leading-tight ${
                    vaiTroChon === vt ? "text-primary" : "text-stone-600"
                  }`}
                >
                  {VAI_TRO_LABEL[vt]}
                </span>
              </button>
            ))}
          </div>

          {/* Commune selection for Thai phu */}
          {vaiTroChon === VAI_TRO.THAI_PHU && (
            <div className="mb-6 animate-fade-up">
              <label className="text-xs font-bold text-muted uppercase tracking-wider block mb-1.5">
                Xã / Thị trấn (Huyện Định Quán)
              </label>
              <select
                className="w-full bg-stone-100 border-none rounded-xl px-4 py-3.5 text-base focus:ring-2 focus:ring-primary/30 outline-none"
                value={xaChon}
                onChange={(e) => setXaChon(e.target.value)}
              >
                <option value={THI_TRAN}>{THI_TRAN}</option>
                {DANH_SACH_XA.map((xa) => (
                  <option key={xa} value={xa}>
                    Xã {xa}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Confirm button */}
          <button
            onClick={xacNhanVaiTro}
            disabled={!vaiTroChon || dangXuLy}
            className="w-full py-3.5 bg-gradient-to-r from-primary to-primary-light text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition disabled:opacity-50 disabled:cursor-not-allowed text-base"
          >
            {dangXuLy ? (
              <span className="flex items-center justify-center gap-2">
                <span className="spinner !border-white/30 !border-t-white"></span>
                Đang xử lý...
              </span>
            ) : (
              "Xác nhận"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
