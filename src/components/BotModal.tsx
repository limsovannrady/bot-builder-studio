import { useEffect, useRef, type ReactNode } from "react";
import { X, Send } from "lucide-react";

interface BotModalProps {
  open: boolean;
  onClose: () => void;
  botName: string;
  botUsername: string;
  botImg: string;
  telegramLink: string;
  accentColor: string;
  children: ReactNode;
}

export default function BotModal({
  open, onClose, botName, botUsername, botImg, telegramLink, accentColor, children,
}: BotModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4"
      onClick={e => { if (e.target === overlayRef.current) onClose(); }}
    >
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      <div
        className="relative w-full sm:max-w-lg max-h-[92dvh] sm:max-h-[88vh] rounded-t-3xl sm:rounded-3xl flex flex-col overflow-hidden shadow-2xl"
        style={{
          background: "var(--card)",
          border: `1px solid ${accentColor}40`,
          boxShadow: `0 0 60px -10px ${accentColor}30`,
        }}
      >
        <div
          className="shrink-0 flex items-center gap-3 px-5 py-4 border-b border-border"
          style={{ background: `linear-gradient(135deg, ${accentColor}12, transparent)` }}
        >
          <div className="relative size-11 rounded-2xl overflow-hidden shrink-0">
            <div className="absolute -inset-1 rounded-2xl blur-md opacity-60" style={{ background: accentColor }} />
            <img src={botImg} alt={botName} className="relative size-full object-cover" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-base leading-tight">{botName}</h3>
            <p className="text-xs text-muted-foreground truncate">{botUsername}</p>
          </div>
          <a
            href={telegramLink}
            target="_blank"
            rel="noreferrer"
            className="shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-white transition hover:opacity-80"
            style={{ background: accentColor }}
          >
            <Send className="size-3.5" /> Telegram
          </a>
          <button
            onClick={onClose}
            className="shrink-0 size-8 rounded-xl bg-secondary/60 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
          >
            <X className="size-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-5">
          {children}
        </div>
      </div>
    </div>
  );
}
