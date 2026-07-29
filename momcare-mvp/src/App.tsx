import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ToastProvider } from "./components/Toast";
import { VAI_TRO } from "./lib/constants";
import BaoVeRoute from "./components/BaoVeRoute";
import ChiBaoOffline from "./components/ChiBaoOffline";

// Pages - Auth
import DangNhapPage from "./pages/DangNhapPage";
import ChonVaiTroPage from "./pages/ChonVaiTroPage";

// Pages - Thai phu
import BangDieuKhien from "./pages/thai-phu/BangDieuKhien";
import NhapChiSo from "./pages/thai-phu/NhapChiSo";
import DanhSachKiem from "./pages/thai-phu/DanhSachKiem";
import MaQR from "./pages/thai-phu/MaQR";
import SucKhoeTinhThan from "./pages/thai-phu/SucKhoeTinhThan";

// Pages - Co do
import BangDieuKhienCoDo from "./pages/co-do/BangDieuKhienCoDo";
import ChiTietHo from "./pages/co-do/ChiTietHo";
import QuetQR from "./pages/co-do/QuetQR";
import CanhBaoNguyHiem from "./pages/co-do/CanhBaoNguyHiem";

export default function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <BrowserRouter>
          <ChiBaoOffline />
          <Routes>
            {/* Auth */}
            <Route path="/dang-nhap" element={<DangNhapPage />} />
            <Route path="/chon-vai-tro" element={<ChonVaiTroPage />} />

            {/* Thai phu */}
            <Route
              path="/thai-phu/bang-dieu-khien"
              element={
                <BaoVeRoute vaiTroYeuCau={VAI_TRO.THAI_PHU}>
                  <BangDieuKhien />
                </BaoVeRoute>
              }
            />
            <Route
              path="/thai-phu/nhap-chi-so"
              element={
                <BaoVeRoute vaiTroYeuCau={VAI_TRO.THAI_PHU}>
                  <NhapChiSo />
                </BaoVeRoute>
              }
            />
            <Route
              path="/thai-phu/danh-sach-kiem"
              element={
                <BaoVeRoute vaiTroYeuCau={VAI_TRO.THAI_PHU}>
                  <DanhSachKiem />
                </BaoVeRoute>
              }
            />
            <Route
              path="/thai-phu/ma-qr"
              element={
                <BaoVeRoute vaiTroYeuCau={VAI_TRO.THAI_PHU}>
                  <MaQR />
                </BaoVeRoute>
              }
            />
            <Route
              path="/thai-phu/suc-khoe-tinh-than"
              element={
                <BaoVeRoute vaiTroYeuCau={VAI_TRO.THAI_PHU}>
                  <SucKhoeTinhThan />
                </BaoVeRoute>
              }
            />

            {/* Co do thon ban */}
            <Route
              path="/co-do/bang-dieu-khien"
              element={
                <BaoVeRoute vaiTroYeuCau={VAI_TRO.CO_DO}>
                  <BangDieuKhienCoDo />
                </BaoVeRoute>
              }
            />
            <Route
              path="/co-do/ho/:id"
              element={
                <BaoVeRoute vaiTroYeuCau={VAI_TRO.CO_DO}>
                  <ChiTietHo />
                </BaoVeRoute>
              }
            />
            <Route
              path="/co-do/quet-qr"
              element={
                <BaoVeRoute vaiTroYeuCau={VAI_TRO.CO_DO}>
                  <QuetQR />
                </BaoVeRoute>
              }
            />
            <Route
              path="/co-do/canh-bao"
              element={
                <BaoVeRoute vaiTroYeuCau={VAI_TRO.CO_DO}>
                  <CanhBaoNguyHiem />
                </BaoVeRoute>
              }
            />

            {/* Mac dinh */}
            <Route path="*" element={<Navigate to="/dang-nhap" replace />} />
          </Routes>
        </BrowserRouter>
      </ToastProvider>
    </AuthProvider>
  );
}
