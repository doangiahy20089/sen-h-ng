import { useNavigate, useLocation } from "react-router-dom";

interface NavItem {
  icon: string;
  label: string;
  path: string;
}

interface MobileNavProps {
  items: NavItem[];
}

export default function MobileNav({ items }: MobileNavProps) {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 w-full flex justify-around items-center px-2 pb-5 pt-2 bg-white/95 backdrop-blur-xl rounded-t-3xl z-50 shadow-[0_-4px_24px_rgba(0,0,0,.06)] border-t border-border">
      {items.map((item) => {
        const isActive = location.pathname === item.path;
        return (
          <button
            key={item.path}
            onClick={() => navigate(item.path)}
            className={`flex flex-col items-center gap-0.5 px-4 py-2 rounded-2xl transition-colors ${
              isActive
                ? "text-primary bg-primary-soft"
                : "text-stone-400 hover:text-stone-600"
            }`}
          >
            <span
              className={`material-symbols-outlined text-2xl ${isActive ? "mso" : "mso-o"}`}
            >
              {item.icon}
            </span>
            <span
              className={`text-xs ${isActive ? "font-bold" : "font-medium"}`}
            >
              {item.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
