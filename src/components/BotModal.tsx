import { useEffect, type ReactNode } from "react";
import { ArrowLeft, Send } from "lucide-react";

interface BotPageProps {
  open: boolean;
  onClose: () => void;
  botName: string;
  botUsername: string;
  botDesc: string;
  botImg: string;
  telegramLink: string;
  accentColor: string;
  children: ReactNode;
}

export default function BotPage({
  open, onClose, botName, botUsername, botDesc, botImg, telegramLink, accentColor, children,
}: BotPageProps) {
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

  return (
    <div
      className="fixed inset-0 z-[200] flex flex-col"
      style={{
        background: "var(--background)",
        transform: open ? "translateX(0)" : "translateX(100%)",
        transition: "transform 0.35s cubic-bezier(0.4, 0, 0.2, 1)",
        visibility: open ? "visible" : "hidden",
      }}
    >
      {/* Top bar */}
      <div
        className="shrink-0 flex items-center gap-3 px-4 py-3 border-b border-border"
        style={{
          background: `linear-gradient(135deg, ${accentColor}15, var(--background) 60%)`,
        }}
      >
        <button
          onClick={onClose}
          className="shrink-0 flex items-center gap-2 px-3 py-2 rounded-xl border border-border bg-secondary/50 hover:bg-secondary text-sm font-medium transition-colors"
        >
          <ArrowLeft className="size-4" />
          <span className="hidden sm:inline">ត្រឡប់ក្រោយ</span>
        </button>

        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className="relative size-10 rounded-2xl overflow-hidden shrink-0">
            <div
              className="absolute -inset-1 rounded-2xl blur-md opacity-50"
              style={{ background: accentColor }}
            />
            <img src={botImg} alt={botName} className="relative size-full object-cover" />
          </div>
          <div className="min-w-0">
            <h2 className="font-bold text-sm sm:text-base leading-tight truncate">{botName}</h2>
            <p className="text-[11px] text-muted-foreground truncate">{botUsername}</p>
          </div>
        </div>

        <a
          href={telegramLink}
          target="_blank"
          rel="noreferrer"
          className="shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold text-white transition hover:opacity-80 active:scale-95"
          style={{ background: accentColor }}
        >
          <Send className="size-3.5" />
          <span>Telegram</span>
        </a>
      </div>

      {/* Accent strip */}
      <div className="h-0.5 shrink-0" style={{ background: `linear-gradient(90deg, ${accentColor}, transparent)` }} />

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-lg px-4 py-6">
          {botDesc && (
            <p className="text-sm text-muted-foreground mb-5 text-center">{botDesc}</p>
          )}
          {children}
        </div>
      </div>
    </div>
  );
}
