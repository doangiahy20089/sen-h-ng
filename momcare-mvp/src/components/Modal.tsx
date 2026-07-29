import { type ReactNode, useEffect } from "react";

interface ModalProps {
  mo: boolean;
  onDong: () => void;
  tieuDe: string;
  children: ReactNode;
}

export default function Modal({ mo, onDong, tieuDe, children }: ModalProps) {
  useEffect(() => {
    if (!mo) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onDong();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [mo, onDong]);

  if (!mo) return null;

  return (
    <div
      className="modal-overlay open"
      onClick={(e) => {
        if (e.target === e.currentTarget) onDong();
      }}
    >
      <div className="modal-box animate-fade-up">
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-extrabold text-xl">{tieuDe}</h3>
          <button
            onClick={onDong}
            className="p-2 hover:bg-stone-100 rounded-full transition-colors"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
