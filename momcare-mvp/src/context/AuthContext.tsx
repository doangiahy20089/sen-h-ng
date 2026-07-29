import { createContext, useContext } from "react";
import type { ReactNode } from "react";
import type { User } from "firebase/auth";
import { useAuth } from "../hooks/useAuth";
import type { VaiTro } from "../lib/constants";

interface AuthContextValue {
  user: User | null;
  role: VaiTro | null;
  dangTai: boolean;
  capNhatVaiTro: (role: VaiTro) => void;
}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  role: null,
  dangTai: true,
  capNhatVaiTro: () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const { user, role, dangTai, capNhatVaiTro } = useAuth();

  return (
    <AuthContext.Provider value={{ user, role, dangTai, capNhatVaiTro }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext(): AuthContextValue {
  return useContext(AuthContext);
}
