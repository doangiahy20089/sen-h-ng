interface AppHeaderProps {
  tenNguoiDung?: string;
  onThoat?: () => void;
}

export default function AppHeader({ tenNguoiDung, onThoat }: AppHeaderProps) {
  return (
    <header className="sticky top-0 z-[100] bg-white/90 backdrop-blur-xl shadow-sm border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-primary-light flex items-center justify-center text-white">
            <span className="material-symbols-outlined mso text-xl">spa</span>
          </div>
          <div className="hidden sm:block">
            <h1 className="text-lg font-extrabold text-primary leading-tight">
              Sen Hồng
            </h1>
            <p className="text-[11px] text-muted -mt-0.5">Chăm sóc mẹ & bé</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {tenNguoiDung && (
            <span className="hidden md:inline text-sm font-semibold text-stone-600 mr-2">
              {tenNguoiDung}
            </span>
          )}
          <button className="relative p-2.5 hover:bg-primary-soft rounded-full transition-colors">
            <span className="material-symbols-outlined mso-o text-stone-500 text-2xl">
              notifications
            </span>
            <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-danger rounded-full border-2 border-white"></span>
          </button>
          {onThoat && (
            <button
              onClick={onThoat}
              className="p-2.5 hover:bg-primary-soft rounded-full transition-colors"
              title="Đăng xuất"
            >
              <span className="material-symbols-outlined mso text-stone-500 text-2xl">
                logout
              </span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
