import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../../lib/firebase";
import { useAuthContext } from "../../context/AuthContext";
import { COLLECTIONS } from "../../lib/constants";
import { dangXuat } from "../../lib/auth";
import AppHeader from "../../components/AppHeader";
import MobileNav from "../../components/MobileNav";

interface HoThaiPhu {
  mother_id: string;
  dan_toc: string;
  huyen: string;
  xa?: string;
  consent_status: boolean;
}

const NAV_ITEMS = [
  { icon: "explore", label: "Tổng quan", path: "/co-do/bang-dieu-khien" },
  { icon: "qr_code_scanner", label: "Quét QR", path: "/co-do/quet-qr" },
  { icon: "warning", label: "Cảnh báo", path: "/co-do/canh-bao" },
];

export default function BangDieuKhienCoDo() {
  const { user } = useAuthContext();
  const navigate = useNavigate();
  const [danhSachHo, setDanhSachHo] = useState<HoThaiPhu[]>([]);
  const [dangTai, setDangTai] = useState(true);

  useEffect(() => {
    async function layDanhSach() {
      if (!user) return;
      try {
        const q = query(
          collection(db, COLLECTIONS.HO_SO_THAI_KY),
          where("assigned_co_do_id", "==", user.uid),
        );
        const snap = await getDocs(q);
        const danhSach: HoThaiPhu[] = snap.docs.map((docSnap) => ({
          mother_id: docSnap.id,
          ...docSnap.data(),
        })) as HoThaiPhu[];
        setDanhSachHo(danhSach);
      } catch (err) {
        console.warn("Loi lay danh sach ho:", err);
      } finally {
        setDangTai(false);
      }
    }
    layDanhSach();
  }, [user]);

  async function xuLyDangXuat() {
    await dangXuat();
    navigate("/dang-nhap");
  }

  const soDaDongY = danhSachHo.filter((h) => h.consent_status).length;

  return (
    <div className="min-h-screen bg-surface pb-28 lg:pb-10">
      <AppHeader onThoat={xuLyDangXuat} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-2xl font-extrabold">Quản lý thai phụ</h2>
            <p className="text-muted text-base">
              Cô đỡ thôn bản — Huyện Định Quán
            </p>
          </div>
          <button
            onClick={() => navigate("/co-do/quet-qr")}
            className="flex items-center gap-2 bg-gradient-to-r from-primary to-primary-light text-white px-5 py-3 rounded-xl text-sm font-bold shadow-lg hover:shadow-xl transition"
          >
            <span className="material-symbols-outlined text-lg">
              qr_code_scanner
            </span>
            Quét QR liên kết
          </button>
        </div>

        {/* Stats */}
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-card rounded-2xl p-5 shadow-sm border border-border card-hover relative overflow-hidden">
            <div className="absolute -right-3 -top-3 w-20 h-20 bg-primary-soft rounded-full opacity-60"></div>
            <p className="text-muted text-sm font-semibold mb-1">
              Hộ phân công
            </p>
            <p className="text-3xl font-black text-primary">
              {dangTai ? "..." : danhSachHo.length}
            </p>
          </div>
          <div className="bg-card rounded-2xl p-5 shadow-sm border border-border card-hover relative overflow-hidden">
            <div className="absolute -right-3 -top-3 w-20 h-20 bg-accent-bg rounded-full opacity-60"></div>
            <p className="text-muted text-sm font-semibold mb-1">Đã đồng ý</p>
            <p className="text-3xl font-black text-accent">
              {dangTai ? "..." : soDaDongY}
            </p>
          </div>
          <div className="bg-card rounded-2xl p-5 shadow-sm border border-border card-hover relative overflow-hidden">
            <div className="absolute -right-3 -top-3 w-20 h-20 bg-warn-bg rounded-full opacity-60"></div>
            <p className="text-muted text-sm font-semibold mb-1">Chưa đồng ý</p>
            <p className="text-3xl font-black text-warn">
              {dangTai ? "..." : danhSachHo.length - soDaDongY}
            </p>
          </div>
          <div className="bg-card rounded-2xl p-5 shadow-sm border border-border card-hover relative overflow-hidden">
            <div className="absolute -right-3 -top-3 w-20 h-20 bg-blue-50 rounded-full opacity-60"></div>
            <p className="text-muted text-sm font-semibold mb-1">
              Tỷ lệ đồng ý
            </p>
            <p className="text-3xl font-black text-blue-700">
              {dangTai || danhSachHo.length === 0
                ? "--"
                : `${Math.round((soDaDongY / danhSachHo.length) * 100)}%`}
            </p>
          </div>
        </section>

        {/* Patient table */}
        <div className="bg-card rounded-2xl shadow-sm border border-border overflow-hidden">
          <div className="px-6 py-4 border-b border-stone-100">
            <h3 className="font-bold text-base">
              Danh sách hộ ({danhSachHo.length})
            </h3>
          </div>

          {dangTai ? (
            <div className="p-8 text-center">
              <div className="spinner mx-auto mb-3"></div>
              <p className="text-sm text-muted">Đang tải...</p>
            </div>
          ) : danhSachHo.length === 0 ? (
            <div className="p-8 text-center">
              <span className="material-symbols-outlined mso text-5xl text-stone-300 mb-3">
                person_off
              </span>
              <p className="text-sm text-muted">
                Chưa có hộ nào được phân công.
              </p>
              <p className="text-xs text-muted mt-1">
                Quét mã QR của thai phụ để liên kết.
              </p>
              <button
                onClick={() => navigate("/co-do/quet-qr")}
                className="mt-4 px-6 py-3 bg-gradient-to-r from-primary to-primary-light text-white font-bold rounded-xl shadow hover:shadow-md transition text-sm"
              >
                Quét QR ngay
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-stone-50">
                    <th className="px-6 py-4 text-xs font-black text-muted uppercase tracking-widest">
                      Thai phụ
                    </th>
                    <th className="px-6 py-4 text-xs font-black text-muted uppercase tracking-widest">
                      Dân tộc
                    </th>
                    <th className="px-6 py-4 text-xs font-black text-muted uppercase tracking-widest">
                      Địa chỉ
                    </th>
                    <th className="px-6 py-4 text-xs font-black text-muted uppercase tracking-widest">
                      Trạng thái
                    </th>
                    <th className="px-6 py-4 text-xs font-black text-muted uppercase tracking-widest">
                      Thao tác
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {danhSachHo.map((ho) => (
                    <tr
                      key={ho.mother_id}
                      className="hover:bg-primary-soft/30 transition-colors"
                    >
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-3">
                          <div className="w-11 h-11 rounded-full bg-primary-soft flex items-center justify-center text-primary font-bold text-sm">
                            {ho.mother_id.slice(0, 2).toUpperCase()}
                          </div>
                          <p className="font-bold text-sm">
                            {ho.mother_id.slice(0, 8)}...
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <span
                          className={`text-base ${ho.dan_toc !== "Kinh" ? "font-semibold text-primary" : "text-muted"}`}
                        >
                          {ho.dan_toc}
                        </span>
                      </td>
                      <td className="px-6 py-5 text-base text-muted">
                        {ho.xa || ho.huyen}
                      </td>
                      <td className="px-6 py-5">
                        <span
                          className={`text-xs font-black px-3 py-1.5 rounded-full ${
                            ho.consent_status
                              ? "bg-accent-bg text-accent"
                              : "bg-warn-bg text-warn"
                          }`}
                        >
                          {ho.consent_status ? "ĐÃ ĐỒNG Ý" : "CHƯA ĐỒNG Ý"}
                        </span>
                      </td>
                      <td className="px-6 py-5">
                        <button
                          onClick={() => navigate(`/co-do/ho/${ho.mother_id}`)}
                          className="p-2 hover:bg-primary-soft rounded-lg transition"
                          title="Xem hồ sơ"
                        >
                          <span className="material-symbols-outlined mso-o text-primary text-lg">
                            visibility
                          </span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      <MobileNav items={NAV_ITEMS} />
    </div>
  );
}
