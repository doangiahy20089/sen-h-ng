import { useState, useEffect, useCallback } from "react";
import { onAuthStateChanged } from "firebase/auth";
import type { User, IdTokenResult } from "firebase/auth";
import { auth } from "../lib/firebase";
import type { VaiTro } from "../lib/constants";

const ROLE_STORAGE_KEY = "momcare_role";

interface TrangThaiAuth {
  user: User | null;
  role: VaiTro | null;
  dangTai: boolean;
  capNhatVaiTro: (role: VaiTro) => void;
}

/**
 * Hook lang nghe trang thai dang nhap + custom claims (role)
 * Fallback: doc role tu localStorage neu chua co custom claim
 */
export function useAuth(): TrangThaiAuth {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<VaiTro | null>(null);
  const [dangTai, setDangTai] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      if (fbUser) {
        const token: IdTokenResult = await fbUser.getIdTokenResult(true);
        const claimRole = (token.claims.role as VaiTro) || null;
        const localRole = localStorage.getItem(
          ROLE_STORAGE_KEY,
        ) as VaiTro | null;
        setUser(fbUser);
        setRole(claimRole || localRole);
      } else {
        localStorage.removeItem(ROLE_STORAGE_KEY);
        setUser(null);
        setRole(null);
      }
      setDangTai(false);
    });

    return () => unsubscribe();
  }, []);

  const capNhatVaiTro = useCallback((newRole: VaiTro) => {
    localStorage.setItem(ROLE_STORAGE_KEY, newRole);
    setRole(newRole);
  }, []);

  return { user, role, dangTai, capNhatVaiTro };
}
