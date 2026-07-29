import { Navigate } from "react-router-dom";
import { useAuthContext } from "../context/AuthContext";
import type { VaiTro } from "../lib/constants";

interface BaoVeRouteProps {
  children: React.ReactNode;
  vaiTroYeuCau: VaiTro;
}

/**
 * Bao ve route: kiem tra dang nhap + dung vai tro
 * Neu chua dang nhap → chuyen den /dang-nhap
 * Neu sai vai tro → chuyen den /chon-vai-tro
 */
export default function BaoVeRoute({
  children,
  vaiTroYeuCau,
}: BaoVeRouteProps) {
  const { user, role, dangTai } = useAuthContext();

  if (dangTai) {
    return <div style={{ textAlign: "center", padding: 40 }}>Đang tải...</div>;
  }

  if (!user) {
    return <Navigate to="/dang-nhap" replace />;
  }

  if (role !== vaiTroYeuCau) {
    return <Navigate to="/chon-vai-tro" replace />;
  }

  return <>{children}</>;
}
