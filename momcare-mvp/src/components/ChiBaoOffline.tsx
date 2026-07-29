import { useState, useEffect } from "react";

/**
 * Chi bao trang thai online/offline
 * Hien thi banner khi mat mang
 */
export default function ChiBaoOffline() {
  const [online, setOnline] = useState(navigator.onLine);

  useEffect(() => {
    function xuLyOnline() {
      setOnline(true);
    }
    function xuLyOffline() {
      setOnline(false);
    }

    window.addEventListener("online", xuLyOnline);
    window.addEventListener("offline", xuLyOffline);

    return () => {
      window.removeEventListener("online", xuLyOnline);
      window.removeEventListener("offline", xuLyOffline);
    };
  }, []);

  if (online) return null;

  return (
    <div className="fixed top-0 left-0 w-full bg-warn text-white text-center py-2 text-sm font-bold z-[999] flex items-center justify-center gap-2">
      <span className="material-symbols-outlined text-lg">wifi_off</span>
      Bạn đang ngoại tuyến — Dữ liệu sẽ đồng bộ khi có mạng
    </div>
  );
}
