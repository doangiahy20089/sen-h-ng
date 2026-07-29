import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  collection,
  query,
  where,
  orderBy,
  limit,
  getDocs,
} from "firebase/firestore";
import { db } from "../../lib/firebase";
import { useAuthContext } from "../../context/AuthContext";
import { COLLECTIONS } from "../../lib/constants";
import { dangXuat } from "../../lib/auth";
import AppHeader from "../../components/AppHeader";
import MobileNav from "../../components/MobileNav";
import StatCard from "../../components/StatCard";

interface ChiSoGanNhat {
  huyet_ap: string;
  can_nang: number;
  tuan_thai: number;
  recorded_at: string;
}

const NAV_ITEMS = [
  { icon: "explore", label: "Tổng quan", path: "/thai-phu/bang-dieu-khien" },
  { icon: "monitor_heart", label: "Chỉ số", path: "/thai-phu/nhap-chi-so" },
  { icon: "checklist", label: "Kiểm tra", path: "/thai-phu/danh-sach-kiem" },
  {
    icon: "psychology",
    label: "Tinh thần",
    path: "/thai-phu/suc-khoe-tinh-than",
  },
];

export default function BangDieuKhien() {
  const { user } = useAuthContext();
  const navigate = useNavigate();
  const [chiSo, setChiSo] = useState<ChiSoGanNhat | null>(null);
  const [dangTai, setDangTai] = useState(true);

  useEffect(() => {
    async function layChiSo() {
      if (!user) return;
      try {
        const q = query(
          collection(db, COLLECTIONS.CHI_SO_SUC_KHOE),
          where("mother_id", "==", user.uid),
          orderBy("recorded_at", "desc"),
          limit(1),
        );
        const snap = await getDocs(q);
        if (!snap.empty) {
          const data = snap.docs[0].data();
          setChiSo({
            huyet_ap: data.huyet_ap,
            can_nang: data.can_nang,
            tuan_thai: data.tuan_thai,
            recorded_at:
              data.recorded_at?.toDate?.().toLocaleDateString("vi-VN") || "",
          });
        }
      } catch (err) {
        console.warn("Loi lay chi so:", err);
      } finally {
        setDangTai(false);
      }
    }
    layChiSo();
  }, [user]);

  async function xuLyDangXuat() {
    await dangXuat();
    navigate("/dang-nhap");
  }

  const tuanThai = chiSo?.tuan_thai || 12;

  return (
    <div className="min-h-screen bg-surface pb-28 lg:pb-10">
      <AppHeader onThoat={xuLyDangXuat} />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 space-y-8">
        {/* Hero Banner */}
        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary via-pink-500 to-pink-300 p-6 sm:p-10 text-white shadow-xl">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="flex-1 space-y-4 text-center md:text-left">
              <span className="inline-block px-4 py-1.5 bg-white/20 backdrop-blur rounded-full text-sm font-semibold">
                Giai đoạn: Quý {tuanThai <= 13 ? 1 : tuanThai <= 26 ? 2 : 3}
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold leading-tight">
                Tuần {dangTai ? "..." : tuanThai}:
                <br />
                <span className="text-yellow-200">
                  {tuanThai <= 13
                    ? "Bé bằng quả Chanh"
                    : tuanThai <= 26
                      ? "Bé bằng quả Bơ"
                      : "Bé bằng trái Bí ngô"}
                </span>
              </h2>
              <p className="text-base text-pink-100 max-w-md leading-relaxed">
                Hệ thống xương của bé đang cứng dần. Mẹ hãy bổ sung Canxi và
                Vitamin D trong tuần này nhé!
              </p>
              <div className="flex flex-wrap justify-center md:justify-start gap-3 pt-2">
                <button
                  onClick={() => navigate("/thai-phu/nhap-chi-so")}
                  className="px-6 py-3 bg-white text-primary font-bold rounded-full hover:scale-105 transition-transform text-base"
                >
                  Cập nhật chỉ số
                </button>
                <button
                  onClick={() => navigate("/thai-phu/ma-qr")}
                  className="px-6 py-3 border-2 border-white/40 text-white font-bold rounded-full hover:bg-white/10 transition text-base"
                >
                  Mã QR của tôi
                </button>
              </div>
            </div>
            <div className="w-40 h-40 md:w-48 md:h-48 relative flex-shrink-0">
              <div className="absolute inset-0 bg-white/10 rounded-full blur-3xl"></div>
              <div className="w-full h-full rounded-full bg-white/15 flex items-center justify-center relative z-10">
                <span className="material-symbols-outlined mso text-7xl text-white/80">
                  child_care
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Stat Cards */}
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            icon="blood_pressure"
            iconColor="text-blue-600"
            label="Huyết áp"
            value={dangTai ? "..." : chiSo?.huyet_ap || "--"}
            status={chiSo ? "Bình thường" : "Chưa có dữ liệu"}
            statusColor={chiSo ? "accent" : "muted"}
            onClick={() => navigate("/thai-phu/nhap-chi-so")}
          />
          <StatCard
            icon="trending_up"
            iconColor="text-accent"
            label="Cân nặng"
            value={dangTai ? "..." : chiSo ? `${chiSo.can_nang} kg` : "--"}
            status={chiSo ? "Theo dõi tốt" : "Chưa có dữ liệu"}
            statusColor={chiSo ? "accent" : "muted"}
            onClick={() => navigate("/thai-phu/nhap-chi-so")}
          />
          <StatCard
            icon="favorite"
            iconColor="text-primary"
            label="Tuần thai"
            value={dangTai ? "..." : chiSo ? `Tuần ${chiSo.tuan_thai}` : "--"}
            status={chiSo ? "Đang phát triển" : "Chưa có dữ liệu"}
            statusColor={chiSo ? "accent" : "muted"}
          />
          <StatCard
            icon="bedtime"
            iconColor="text-amber-600"
            label="Giấc ngủ"
            value="6.5 giờ"
            status="Hơi thấp"
            statusColor="warn"
          />
        </section>

        {/* Quick Actions + Tips */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Quick Actions */}
          <div className="bg-card rounded-2xl p-6 shadow-sm border border-border">
            <h3 className="text-lg font-bold flex items-center gap-2 mb-5">
              <span className="material-symbols-outlined mso text-primary">
                bolt
              </span>
              Thao tác nhanh
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => navigate("/thai-phu/nhap-chi-so")}
                className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-primary-soft hover:bg-pink-100 transition text-center"
              >
                <span className="material-symbols-outlined mso text-2xl text-primary">
                  edit
                </span>
                <span className="text-sm font-bold text-primary">
                  Nhập chỉ số
                </span>
              </button>
              <button
                onClick={() => navigate("/thai-phu/danh-sach-kiem")}
                className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-accent-bg hover:bg-green-100 transition text-center"
              >
                <span className="material-symbols-outlined mso text-2xl text-accent">
                  checklist
                </span>
                <span className="text-sm font-bold text-accent">
                  Danh sách kiểm
                </span>
              </button>
              <button
                onClick={() => navigate("/thai-phu/ma-qr")}
                className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-blue-50 hover:bg-blue-100 transition text-center"
              >
                <span className="material-symbols-outlined mso text-2xl text-blue-600">
                  qr_code
                </span>
                <span className="text-sm font-bold text-blue-700">Mã QR</span>
              </button>
              <button
                onClick={() => navigate("/thai-phu/suc-khoe-tinh-than")}
                className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-warn-bg hover:bg-orange-100 transition text-center"
              >
                <span className="material-symbols-outlined mso text-2xl text-warn">
                  psychology
                </span>
                <span className="text-sm font-bold text-warn">Tinh thần</span>
              </button>
            </div>
          </div>

          {/* Tips */}
          <div className="bg-amber-50 rounded-2xl p-6 border border-amber-100 relative overflow-hidden">
            <span className="material-symbols-outlined absolute -right-4 -bottom-4 text-8xl text-amber-200/40 rotate-12">
              eco
            </span>
            <h4 className="text-lg font-bold text-amber-900 mb-2">
              Mẹo nhỏ cho mẹ
            </h4>
            <p className="text-amber-800 text-base leading-relaxed max-w-md">
              Bé bắt đầu có cử động nhỏ dù mẹ chưa cảm nhận được. Nghe nhạc nhẹ
              nhàng sẽ giúp cả mẹ và bé thư giãn!
            </p>
            <button
              onClick={() => navigate("/thai-phu/suc-khoe-tinh-than")}
              className="inline-flex items-center gap-1 text-primary font-bold text-sm mt-3"
            >
              Hỗ trợ tinh thần
              <span className="material-symbols-outlined text-sm">
                arrow_forward
              </span>
            </button>
          </div>
        </div>

        {/* Empty state */}
        {!chiSo && !dangTai && (
          <div className="bg-card rounded-2xl p-8 shadow-sm border border-border text-center">
            <span className="material-symbols-outlined mso text-5xl text-stone-300 mb-3">
              monitoring
            </span>
            <p className="text-muted text-sm">
              Chưa có dữ liệu sức khỏe. Hãy nhập chỉ số đầu tiên để bắt đầu theo
              dõi.
            </p>
            <button
              onClick={() => navigate("/thai-phu/nhap-chi-so")}
              className="mt-4 px-6 py-3 bg-gradient-to-r from-primary to-primary-light text-white font-bold rounded-xl shadow hover:shadow-md transition text-sm"
            >
              Nhập chỉ số ngay
            </button>
          </div>
        )}
      </div>

      <MobileNav items={NAV_ITEMS} />
    </div>
  );
}
