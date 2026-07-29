import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { collection, query, where, orderBy, getDocs } from "firebase/firestore";
import { db } from "../../lib/firebase";
import { COLLECTIONS } from "../../lib/constants";
import AppHeader from "../../components/AppHeader";

interface ChiSo {
  id: string;
  huyet_ap: string;
  can_nang: number;
  tuan_thai: number;
  recorded_at: string;
}

export default function ChiTietHo() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [chiSoList, setChiSoList] = useState<ChiSo[]>([]);
  const [dangTai, setDangTai] = useState(true);

  useEffect(() => {
    async function layChiSo() {
      if (!id) return;
      try {
        const q = query(
          collection(db, COLLECTIONS.CHI_SO_SUC_KHOE),
          where("mother_id", "==", id),
          orderBy("recorded_at", "desc"),
        );
        const snap = await getDocs(q);
        const danhSach: ChiSo[] = snap.docs.map((docSnap) => ({
          id: docSnap.id,
          huyet_ap: docSnap.data().huyet_ap,
          can_nang: docSnap.data().can_nang,
          tuan_thai: docSnap.data().tuan_thai,
          recorded_at:
            docSnap
              .data()
              .recorded_at?.toDate?.()
              .toLocaleDateString("vi-VN") || "",
        }));
        setChiSoList(danhSach);
      } catch (err) {
        console.warn("Loi lay chi so:", err);
      } finally {
        setDangTai(false);
      }
    }
    layChiSo();
  }, [id]);

  return (
    <div className="min-h-screen bg-surface pb-28 lg:pb-10">
      <AppHeader />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6">
        {/* Back button */}
        <button
          onClick={() => navigate("/co-do/bang-dieu-khien")}
          className="flex items-center gap-1 text-sm font-bold text-muted hover:text-primary transition mb-6"
        >
          <span className="material-symbols-outlined text-lg">arrow_back</span>
          Quay lại
        </button>

        {/* Profile card */}
        <div className="bg-card rounded-2xl p-6 shadow-sm border border-border mb-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-primary-soft flex items-center justify-center text-primary font-bold text-xl">
              {id?.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <h1 className="text-xl font-extrabold">Chi tiết hộ</h1>
              <p className="text-sm text-muted">ID: {id?.slice(0, 12)}...</p>
            </div>
          </div>
        </div>

        {/* Vitals history */}
        <div className="bg-card rounded-2xl shadow-sm border border-border overflow-hidden">
          <div className="px-6 py-4 border-b border-stone-100 flex items-center gap-2">
            <span className="material-symbols-outlined mso text-primary">
              history
            </span>
            <h3 className="font-bold text-base">Lịch sử chỉ số sức khỏe</h3>
          </div>

          {dangTai ? (
            <div className="p-8 text-center">
              <div className="spinner mx-auto mb-3"></div>
              <p className="text-sm text-muted">Đang tải...</p>
            </div>
          ) : chiSoList.length === 0 ? (
            <div className="p-8 text-center">
              <span className="material-symbols-outlined mso text-5xl text-stone-300 mb-3">
                monitoring
              </span>
              <p className="text-sm text-muted">Chưa có dữ liệu chỉ số.</p>
            </div>
          ) : (
            <div className="divide-y divide-stone-100">
              {chiSoList.map((cs) => (
                <div
                  key={cs.id}
                  className="flex items-center justify-between p-4 px-6 hover:bg-surface transition"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-accent"></div>
                    <div>
                      <p className="font-bold text-base">Tuần {cs.tuan_thai}</p>
                      <p className="text-sm text-muted">{cs.recorded_at}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-sm font-semibold text-blue-700">
                      {cs.huyet_ap} mmHg
                    </span>
                    <span className="text-sm font-semibold text-accent">
                      {cs.can_nang} kg
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
