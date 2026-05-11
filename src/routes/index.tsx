import { createFileRoute } from "@tanstack/react-router";
import { Bot, Send, Sparkles, MessageCircle, Mic, Languages, Zap, Heart, Sun, Moon, Menu, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

function useScrollReveal<T extends HTMLElement = HTMLDivElement>() {
  const ref = useRef<T>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { el.classList.add("in-view"); observer.unobserve(el); } },
      { threshold: 0.12 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  return ref;
}

function useTheme() {
  const [theme, setTheme] = useState<"dark" | "light">(() => {
    if (typeof window === "undefined") return "light";
    const stored = localStorage.getItem("theme-v2") as "dark" | "light" | null;
    if (stored === "dark") return "dark";
    return "light";
  });
  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    localStorage.setItem("theme-v2", theme);
  }, [theme]);
  return { theme, toggle: () => setTheme((t) => (t === "dark" ? "light" : "dark")) };
}

const NAV_LINKS = [
  { id: "home", label: "ទំព័រដើម" },
  { id: "bots", label: "Bots" },
  { id: "work", label: "ការងារ" },
  { id: "about", label: "អំពីខ្ញុំ" },
];

function useActiveSection() {
  const [active, setActive] = useState("home");
  useEffect(() => {
    const sections = NAV_LINKS.map((l) => document.getElementById(l.id)).filter(Boolean) as HTMLElement[];
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "-40% 0px -50% 0px", threshold: [0, 0.25, 0.5, 0.75, 1] }
    );
    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);
  return active;
}

function smoothScroll(e: React.MouseEvent<HTMLAnchorElement>, id: string) {
  e.preventDefault();
  const el = document.getElementById(id);
  if (el) {
    el.scrollIntoView({ behavior: "smooth", block: "start" });
    history.replaceState(null, "", `#${id}`);
  }
}

export const Route = createFileRoute("/")({
  component: Index,
});

const AVATAR = "/profile.jpg";
const BOT_TTS = "https://i.ibb.co/BHLg2TzD/x.jpg";
const BOT_TRANS = "https://i.ibb.co/rGWPY8K2/x.jpg";
const BOT_AI = "https://i.ibb.co/GQjZdsng/x.jpg";
const BOT_4  = "https://i.ibb.co/p8HrfN5/x.jpg";
const TELEGRAM = "https://t.me/limsvannrady";
const FACEBOOK = "https://www.facebook.com/limsovannrady";
const TELEGRAM_CHANNEL = "https://t.me/limsovannrady_Channel";

const bots = [
  {
    name: "បកប្រែភាសា",
    username: "@GoogleTranslate2026_Bot",
    desc: "",
    img: BOT_TTS,
    icon: Mic,
    accent: "cyan",
    link: "https://t.me/GoogleTranslate2026_Bot",
  },
  {
    name: "Create QR & Scan",
    username: "@CreateQR_ScanBot",
    desc: "",
    img: BOT_TRANS,
    icon: Languages,
    accent: "orange",
    link: "https://t.me/CreateQR_ScanBot",
  },
  {
    name: "Auto Reaction",
    username: "@AutoReaction2026Bot",
    desc: "",
    img: BOT_AI,
    icon: Sparkles,
    accent: "primary",
    link: "https://t.me/AutoReaction2026Bot",
  },
  {
    name: "បង្កើតសំឡេង Ai",
    username: "@limsovannradybot",
    desc: "",
    img: BOT_4,
    icon: Bot,
    accent: "green",
    link: "https://t.me/limsovannradybot",
  },
];

function Nav() {
  const active = useActiveSection();
  const { theme, toggle } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    smoothScroll(e, id);
    setMenuOpen(false);
  };

  return (
    <header className="fixed top-0 inset-x-0 z-50">
      <div className="mx-auto max-w-6xl px-4 py-4">
        <nav className="glass rounded-2xl px-5 py-3 flex items-center justify-between">
          <a
            href="#home"
            onClick={(e) => smoothScroll(e, "home")}
            aria-label="ត្រឡប់ទៅទំព័រដើម — សុវណ្ណរ៉ាឌី"
            className="focus-ring flex items-center gap-2 font-bold rounded-lg"
          >
            <img
              src="/logo-avatar.jpg"
              alt="logo"
              className="size-8 rounded-lg object-cover shadow-glow"
            />
            <span className="text-gradient">សុវណ្ណរ៉ាឌី</span>
          </a>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-1 text-sm">
            {NAV_LINKS.map((l) => {
              const isActive = active === l.id;
              return (
                <a
                  key={l.id}
                  href={`#${l.id}`}
                  onClick={(e) => smoothScroll(e, l.id)}
                  aria-current={isActive ? "page" : undefined}
                  className={`relative px-4 py-2 rounded-lg transition-colors outline-none focus-visible:ring-2 focus-visible:ring-[var(--cyan)] focus-visible:ring-offset-2 focus-visible:ring-offset-background ${
                    isActive
                      ? "text-foreground bg-secondary/70"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary/60"
                  }`}
                >
                  {l.label}
                  {isActive && (
                    <span className="absolute left-1/2 -translate-x-1/2 -bottom-0.5 h-0.5 w-6 rounded-full bg-gradient-hero" />
                  )}
                </a>
              );
            })}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={toggle}
              aria-label={theme === "dark" ? "ប្តូរទៅ Light Mode" : "ប្តូរទៅ Dark Mode"}
              className="focus-ring size-9 rounded-lg glass flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
            >
              {theme === "dark" ? <Sun className="size-4" /> : <Moon className="size-4" />}
            </button>
            <a
              href={TELEGRAM}
              target="_blank"
              rel="noreferrer"
              className="focus-ring hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition"
            >
              <Send className="size-4" /> Telegram
            </a>
            {/* Hamburger button — mobile only */}
            <button
              onClick={() => setMenuOpen((o) => !o)}
              aria-label={menuOpen ? "បិទម៉ឺនុយ" : "បើកម៉ឺនុយ"}
              aria-expanded={menuOpen}
              className="focus-ring md:hidden size-9 rounded-lg glass flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
            >
              {menuOpen ? <X className="size-4" /> : <Menu className="size-4" />}
            </button>
          </div>
        </nav>

        {/* Mobile dropdown */}
        {menuOpen && (
          <div className="md:hidden mt-2 glass rounded-2xl px-4 py-3 flex flex-col gap-1 animate-fade-up">
            {NAV_LINKS.map((l) => {
              const isActive = active === l.id;
              return (
                <a
                  key={l.id}
                  href={`#${l.id}`}
                  onClick={(e) => handleNavClick(e, l.id)}
                  className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                    isActive
                      ? "text-foreground bg-secondary/70"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                  }`}
                >
                  {l.label}
                </a>
              );
            })}
          </div>
        )}
      </div>
    </header>
  );
}

function Hero() {
  const ref = useScrollReveal();
  return (
    <section id="home" className="scroll-mt-24 pt-24 md:pt-28 pb-10">
      <div ref={ref} className="reveal mx-auto max-w-2xl px-4 flex flex-col items-center text-center animate-hero">

        {/* Headline */}
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight mb-4">
          <span className="text-gradient">បង្កើត Bots</span>{" "}
          <span>ឆ្លាតវៃសម្រាប់</span>
          <br />
          <span>អ្នករាល់គ្នា</span>
        </h1>

        {/* Buttons */}
        <div className="flex flex-wrap gap-3 justify-center mb-10">
          <a
            href="#bots"
            onClick={(e) => smoothScroll(e, "bots")}
            className="focus-ring inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-hero text-white font-semibold shadow-glow hover:scale-[1.03] transition-transform text-sm"
          >
            <Bot className="size-4" /> សាកល្បង Bots
          </a>
          <a
            href="#about"
            onClick={(e) => smoothScroll(e, "about")}
            className="focus-ring inline-flex items-center gap-2 px-5 py-2.5 rounded-xl glass font-semibold hover:border-[var(--orange)]/60 transition-colors text-sm"
          >
            <MessageCircle className="size-4 text-[var(--orange)]" /> អំពីខ្ញុំ
          </a>
        </div>

      </div>
    </section>
  );
}

function Bots() {
  const headRef = useScrollReveal();
  const listRef = useScrollReveal();
  return (
    <section id="bots" className="scroll-mt-24 py-10">
      <div className="mx-auto max-w-6xl px-4">
        <div ref={headRef} className="reveal text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass text-xs mb-4">
            <Bot className="size-3.5 text-[var(--cyan)]" />
            <span className="text-muted-foreground">My Bots</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-bold mb-3">
            Bots <span className="text-gradient">ដែលខ្ញុំបានបង្កើត</span>
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            ស្វែងយល់ និងសាកល្បង Telegram bots ឆ្លាតវៃរបស់ខ្ញុំ ឥតគិតថ្លៃ
          </p>
        </div>

        <div ref={listRef} className="reveal grid grid-cols-2 md:grid-cols-4 gap-4 mx-auto max-w-3xl">
          {bots.map((b, i) => {
            const accentColor =
              b.accent === "cyan"   ? "var(--cyan)" :
              b.accent === "orange" ? "var(--orange)" :
              b.accent === "green"  ? "oklch(0.72 0.19 145)" :
              "var(--primary)";
            return (
              <a
                key={b.name}
                href={b.link}
                target="_blank"
                rel="noreferrer"
                className="group glass rounded-2xl overflow-hidden flex flex-col items-center gap-3 p-4 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg animate-fade-up"
                style={{ animationDelay: `${i * 0.08}s` }}
              >
                {/* Thumbnail */}
                <div className="relative size-16 rounded-2xl overflow-hidden shrink-0">
                  <img src={b.img} alt={b.name} className="size-full object-cover group-hover:scale-110 transition-transform duration-500" />
                </div>

                {/* Name */}
                <h3 className="font-semibold text-sm text-center leading-snug">{b.name}</h3>

                {/* Open button */}
                <div
                  className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full transition-all duration-200 group-hover:opacity-90"
                  style={{ background: `${accentColor}22`, color: accentColor }}
                >
                  <Send className="size-3" />
                  Open
                </div>
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}


function About() {
  const badgeRef = useScrollReveal();
  const cardRef  = useScrollReveal();
  return (
    <section id="about" className="scroll-mt-24 py-10">
      <div className="mx-auto max-w-4xl px-4">
        <div ref={badgeRef} className="reveal flex justify-center mb-4">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass text-xs">
            <Heart className="size-3.5 text-[var(--orange)]" />
            <span className="text-muted-foreground">អំពីខ្ញុំ</span>
          </div>
        </div>

        {/* Profile card */}
        <div ref={cardRef} className="reveal reveal-scale glass rounded-3xl p-8 md:p-12 flex flex-col md:flex-row items-center gap-8 md:gap-12">
          {/* Avatar */}
          <div className="relative shrink-0 flex items-center justify-center">
            {/* Outer glow bloom */}
            <div className="absolute inset-0 rounded-full bg-gradient-hero blur-3xl opacity-40 scale-125" />

            {/* Spinning gradient ring */}
            <div
              className="absolute rounded-full"
              style={{
                inset: "-5px",
                background: "conic-gradient(from 0deg, oklch(0.52 0.22 290), oklch(0.62 0.16 200), oklch(0.58 0.18 55), oklch(0.52 0.22 290))",
                animation: "spin-ring 4s linear infinite",
                borderRadius: "9999px",
              }}
            />

            {/* White gap between ring and image */}
            <div className="absolute rounded-full bg-background" style={{ inset: "3px" }} />

            {/* Second inner pulse ring */}
            <div
              className="absolute rounded-full opacity-60"
              style={{
                inset: "-12px",
                background: "conic-gradient(from 180deg, oklch(0.62 0.16 200 / 0.5), transparent 60%, oklch(0.58 0.18 55 / 0.5), transparent 60%)",
                animation: "spin-ring 8s linear infinite reverse",
                borderRadius: "9999px",
              }}
            />

            {/* Light beam top-left */}
            <div className="absolute -top-4 -left-2 w-2 h-8 rounded-full bg-gradient-to-b from-[oklch(0.62_0.16_200)] to-transparent opacity-60 rotate-[-30deg] blur-[2px]" />
            {/* Light beam bottom-right */}
            <div className="absolute -bottom-4 -right-2 w-2 h-8 rounded-full bg-gradient-to-t from-[oklch(0.58_0.18_55)] to-transparent opacity-60 rotate-[-30deg] blur-[2px]" />

            {/* Sparkle dots */}
            <div className="absolute -top-2 right-4 size-2 rounded-full bg-[oklch(0.78_0.18_55)] opacity-80 animate-pulse" style={{ animationDuration: "2s" }} />
            <div className="absolute -bottom-1 left-3 size-1.5 rounded-full bg-[oklch(0.62_0.16_200)] opacity-70 animate-pulse" style={{ animationDuration: "3s" }} />
            <div className="absolute top-1/2 -right-3 size-1.5 rounded-full bg-[oklch(0.52_0.22_290)] opacity-80 animate-pulse" style={{ animationDuration: "2.5s" }} />

            {/* Profile image */}
            <div className="relative size-32 md:size-44 rounded-full overflow-hidden shadow-glow z-10">
              <img src={AVATAR} alt="លឹម សុវណ្ណរ៉ាឌី" className="size-full object-cover" />
              {/* Inner light overlay */}
              <div className="absolute inset-0 rounded-full"
                style={{ background: "radial-gradient(circle at 30% 25%, oklch(1 0 0 / 0.15), transparent 60%)" }}
              />
            </div>
          </div>

          {/* Info */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <h2 className="text-3xl md:text-4xl font-bold leading-tight mb-2">
              <span className="text-gradient">លឹម សុវណ្ណរ៉ាឌី</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full max-w-sm md:max-w-md">
              {/* Telegram Personal */}
              <a
                href={TELEGRAM}
                target="_blank"
                rel="noreferrer"
                className="focus-ring group flex flex-col items-center gap-2 px-4 py-4 rounded-2xl border border-[oklch(0.55_0.24_25/40%)] bg-[oklch(0.55_0.24_25/10%)] hover:bg-[oklch(0.55_0.24_25/20%)] hover:border-[oklch(0.55_0.24_25/70%)] hover:shadow-glow hover:scale-[1.04] transition-all duration-300"
              >
                <div className="size-11 rounded-xl bg-[oklch(0.55_0.24_25/15%)] border border-[oklch(0.55_0.24_25/30%)] flex items-center justify-center group-hover:bg-[oklch(0.55_0.24_25/25%)] transition-colors">
                  <Send className="size-5 text-[oklch(0.70_0.22_25)]" />
                </div>
                <div className="text-center">
                  <p className="text-xs font-bold text-foreground">Telegram</p>
                  <p className="text-[10px] text-muted-foreground">ផ្ទាល់ខ្លួន</p>
                </div>
              </a>

              {/* Facebook */}
              <a
                href={FACEBOOK}
                target="_blank"
                rel="noreferrer"
                className="focus-ring group flex flex-col items-center gap-2 px-4 py-4 rounded-2xl border border-[oklch(0.55_0.20_245/40%)] bg-[oklch(0.55_0.20_245/08%)] hover:bg-[oklch(0.55_0.20_245/18%)] hover:border-[oklch(0.55_0.20_245/70%)] hover:scale-[1.04] transition-all duration-300"
                style={{ boxShadow: "none" }}
                onMouseEnter={e => (e.currentTarget.style.boxShadow = "0 0 40px -8px oklch(0.55 0.20 245 / 0.4)")}
                onMouseLeave={e => (e.currentTarget.style.boxShadow = "none")}
              >
                <div className="size-11 rounded-xl bg-[oklch(0.55_0.20_245/12%)] border border-[oklch(0.55_0.20_245/30%)] flex items-center justify-center group-hover:bg-[oklch(0.55_0.20_245/22%)] transition-colors">
                  <svg className="size-5 text-[oklch(0.65_0.20_245)]" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </div>
                <div className="text-center">
                  <p className="text-xs font-bold text-foreground">Facebook</p>
                  <p className="text-[10px] text-muted-foreground">ទំព័រ</p>
                </div>
              </a>

              {/* Telegram Channel */}
              <a
                href={TELEGRAM_CHANNEL}
                target="_blank"
                rel="noreferrer"
                className="focus-ring group flex flex-col items-center gap-2 px-4 py-4 rounded-2xl border border-[oklch(0.72_0.19_195/40%)] bg-[oklch(0.72_0.19_195/08%)] hover:bg-[oklch(0.72_0.19_195/18%)] hover:border-[oklch(0.72_0.19_195/70%)] hover:scale-[1.04] transition-all duration-300"
                style={{ boxShadow: "none" }}
                onMouseEnter={e => (e.currentTarget.style.boxShadow = "0 0 40px -8px oklch(0.72 0.19 195 / 0.4)")}
                onMouseLeave={e => (e.currentTarget.style.boxShadow = "none")}
              >
                <div className="size-11 rounded-xl bg-[oklch(0.72_0.19_195/12%)] border border-[oklch(0.72_0.19_195/30%)] flex items-center justify-center group-hover:bg-[oklch(0.72_0.19_195/22%)] transition-colors">
                  <svg className="size-5 text-[oklch(0.72_0.19_195)]" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.447 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.12L7.28 13.4l-2.95-.924c-.64-.204-.657-.64.136-.953l11.57-4.461c.537-.194 1.006.131.858.16z"/>
                  </svg>
                </div>
                <div className="text-center">
                  <p className="text-xs font-bold text-foreground">Channel</p>
                  <p className="text-[10px] text-muted-foreground">Telegram</p>
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}


function Footer() {
  return (
    <footer className="py-10 border-t border-border">
      <div className="mx-auto max-w-6xl px-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
        <div>២០២៦ លឹម សុវណ្ណរ៉ាឌី</div>
      </div>
    </footer>
  );
}

const OA = [0, 120, 240];
const IA = [60, 180, 300];
// Refined petal paths — wider, more rounded Rumdul shape
const OPETAL = "M100 100 C142 84 146 38 100 12 C54 38 58 84 100 100Z";
const IPETAL = "M100 100 C126 90 129 60 100 40 C71 60 74 90 100 100Z";
// Highlight tip on outer petal
const OTIP   = "M100 40 C118 32 128 18 100 12 C72 18 82 32 100 40Z";

function LotusIconFilled({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className={className}>
      {OA.map(a => <path key={`o${a}`} d={OPETAL} transform={`rotate(${a} 100 100)`} fill="currentColor" opacity={0.72} />)}
      {OA.map(a => <path key={`t${a}`} d={OTIP}   transform={`rotate(${a} 100 100)`} fill="white"        opacity={0.28} />)}
      {IA.map(a => <path key={`i${a}`} d={IPETAL} transform={`rotate(${a} 100 100)`} fill="currentColor" opacity={0.94} />)}
      {IA.map(a => <path key={`h${a}`} d={IPETAL} transform={`rotate(${a} 100 100) scale(0.55) translate(82 82)`} fill="white" opacity={0.15} />)}
      <circle cx="100" cy="100" r="15" fill="currentColor" opacity={1.0} />
      <circle cx="100" cy="100" r="8"  fill="white"        opacity={0.35} />
    </svg>
  );
}

function LotusIconOutline({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className={className}>
      {OA.map(a => <path key={`o${a}`} d={OPETAL} transform={`rotate(${a} 100 100)`} fill="none" stroke="currentColor" strokeWidth="3" opacity={0.80} />)}
      {OA.map(a => <path key={`t${a}`} d={OTIP}   transform={`rotate(${a} 100 100)`} fill="currentColor" opacity={0.22} />)}
      {IA.map(a => <path key={`i${a}`} d={IPETAL} transform={`rotate(${a} 100 100)`} fill="none" stroke="currentColor" strokeWidth="2.5" opacity={0.90} />)}
      <circle cx="100" cy="100" r="32" fill="none" stroke="currentColor" strokeWidth="1.5" strokeDasharray="4 5" opacity={0.40} />
      <circle cx="100" cy="100" r="15" fill="currentColor" opacity={0.80} />
      <circle cx="100" cy="100" r="7"  fill="white"        opacity={0.30} />
    </svg>
  );
}

function LotusIconDetailed({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className={className}>
      {OA.map(a => <path key={`o${a}`} d={OPETAL} transform={`rotate(${a} 100 100)`} fill="currentColor" opacity={0.65} />)}
      {OA.map(a => <path key={`t${a}`} d={OTIP}   transform={`rotate(${a} 100 100)`} fill="white"        opacity={0.30} />)}
      {OA.map(a => <line key={`v${a}`} x1="100" y1="86" x2="100" y2="22" transform={`rotate(${a} 100 100)`} stroke="currentColor" strokeWidth="1.5" opacity={0.30} />)}
      {OA.map(a => <circle key={`d${a}`} cx="100" cy="14" r="3.5" transform={`rotate(${a} 100 100)`} fill="currentColor" opacity={0.55} />)}
      {IA.map(a => <path key={`i${a}`} d={IPETAL} transform={`rotate(${a} 100 100)`} fill="currentColor" opacity={0.92} />)}
      {IA.map(a => <circle key={`id${a}`} cx="100" cy="42" r="2.5" transform={`rotate(${a} 100 100)`} fill="white" opacity={0.40} />)}
      <circle cx="100" cy="100" r="38" fill="none" stroke="currentColor" strokeWidth="1.2" strokeDasharray="3 5" opacity={0.28} />
      <circle cx="100" cy="100" r="15" fill="currentColor" opacity={1.0} />
      <circle cx="100" cy="100" r="7"  fill="white"        opacity={0.38} />
    </svg>
  );
}

type FlowerVariant = "filled" | "outline" | "detailed";

function LotusBackground() {
  const gold = "var(--lotus-color)";
  const S = 200;
  const flowers: Array<{ top: string; left: string; size: number; color: string; opacity: number; delay: string; dur: string; rotate: string; dx: string; dy: string; variant: FlowerVariant }> = [
    // Row 1 — top
    { top: "-4%",  left: "2%",   size: S, color: gold, opacity: 0.28, delay: "0s",  dur: "42s", rotate: "-20deg", dx: "-6px", dy: "6px",  variant: "detailed" },
    { top: "-5%",  left: "38%",  size: S, color: gold, opacity: 0.22, delay: "7s",  dur: "58s", rotate: "25deg",  dx: "5px",  dy: "-5px", variant: "outline"  },
    { top: "-3%",  left: "74%",  size: S, color: gold, opacity: 0.30, delay: "14s", dur: "46s", rotate: "10deg",  dx: "7px",  dy: "-6px", variant: "filled"   },
    // Row 2
    { top: "24%",  left: "-4%",  size: S, color: gold, opacity: 0.24, delay: "4s",  dur: "52s", rotate: "-35deg", dx: "-5px", dy: "7px",  variant: "filled"   },
    { top: "23%",  left: "46%",  size: S, color: gold, opacity: 0.18, delay: "20s", dur: "60s", rotate: "50deg",  dx: "6px",  dy: "5px",  variant: "detailed" },
    { top: "25%",  left: "82%",  size: S, color: gold, opacity: 0.26, delay: "10s", dur: "48s", rotate: "-15deg", dx: "-7px", dy: "-5px", variant: "outline"  },
    // Row 3
    { top: "52%",  left: "4%",   size: S, color: gold, opacity: 0.22, delay: "17s", dur: "54s", rotate: "40deg",  dx: "5px",  dy: "-6px", variant: "outline"  },
    { top: "51%",  left: "40%",  size: S, color: gold, opacity: 0.20, delay: "3s",  dur: "44s", rotate: "-55deg", dx: "-6px", dy: "5px",  variant: "filled"   },
    { top: "53%",  left: "80%",  size: S, color: gold, opacity: 0.24, delay: "25s", dur: "56s", rotate: "70deg",  dx: "6px",  dy: "4px",  variant: "detailed" },
    // Row 4 — bottom
    { top: "80%",  left: "-2%",  size: S, color: gold, opacity: 0.20, delay: "8s",  dur: "62s", rotate: "-70deg", dx: "5px",  dy: "-4px", variant: "filled"   },
    { top: "79%",  left: "36%",  size: S, color: gold, opacity: 0.16, delay: "22s", dur: "50s", rotate: "-10deg", dx: "-5px", dy: "6px",  variant: "outline"  },
    { top: "81%",  left: "76%",  size: S, color: gold, opacity: 0.22, delay: "13s", dur: "64s", rotate: "60deg",  dx: "-6px", dy: "-5px", variant: "detailed" },
  ];
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 1 }} aria-hidden="true">
      {flowers.map((f, i) => (
        <div
          key={i}
          className="lotus-float absolute"
          style={{
            top: f.top, left: f.left,
            width: f.size, height: f.size,
            color: f.color,
            opacity: f.opacity,
            ["--lo" as string]: f.opacity,
            ["--lr" as string]: f.rotate,
            ["--ld" as string]: f.dur,
            ["--dx" as string]: f.dx,
            ["--dy" as string]: f.dy,
            animationDelay: f.delay,
          }}
        >
          {f.variant === "filled"   && <LotusIconFilled   className="size-full" />}
          {f.variant === "outline"  && <LotusIconOutline  className="size-full" />}
          {f.variant === "detailed" && <LotusIconDetailed className="size-full" />}
        </div>
      ))}
    </div>
  );
}

const COL1 = [
  { src: "/work1.jpg",  caption: "ទទួលរង្វាន់ E-GetS Annual Party" },
  { src: "/work4.jpg",  caption: "ពិធីប្រគល់រង្វាន់ជាមួយប្រធាន" },
  { src: "https://st-img.e-gets.com/MARKETING/d358f02abbd9ea9b336f86c9f66c7beb.png!840.jpg", caption: "ស្ដេចសេវាកម្ម ក្រុងព្រះសីហនុ" },
  { src: "/work5.jpg",  caption: "E-GetS Annual Party 2025" },
  { src: "/work7.jpg",  caption: "ក្រុមការងារ E-GetS" },
  { src: "/work10.jpg", caption: "វគ្គបណ្ដុះបណ្ដាល Sihanoukville" },
];
const COL2 = [
  { src: "/work2.jpg",  caption: "ពិធីប្រគល់រង្វាន់ E-GetS" },
  { src: "/work11.jpg", caption: "គំរូ 3D E-GetS Rider" },
  { src: "/work3.jpg",  caption: "ក្រុម Rider E-GetS ត្រៀមខ្លួន" },
  { src: "/work6.jpg",  caption: "សកម្មភាពសម្អាតបរិស្ថាន" },
  { src: "/work8.jpg",  caption: "សកម្មភាពសម្អាតជាមួយក្រុម" },
  { src: "/work9.jpg",  caption: "ការងារប្រចាំថ្ងៃ E-GetS" },
];
const ALL_WORK = [...COL1, ...COL2];

function MarqueeCol({ images, duration, onClick }: {
  images: { src: string; caption: string }[];
  duration: number;
  onClick: (img: { src: string; caption: string }) => void;
}) {
  const doubled = [...images, ...images];
  return (
    <div className="marquee-wrap overflow-hidden flex-1 h-[600px]">
      <div className="marquee-col flex flex-col gap-3" style={{ animationDuration: `${duration}s` }}>
        {doubled.map((img, i) => (
          <button
            key={i}
            onClick={() => onClick(img)}
            className="group relative w-full rounded-2xl overflow-hidden shrink-0 focus:outline-none"
            style={{ aspectRatio: "4/3" }}
          >
            <img
              src={img.src}
              alt={img.caption}
              className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-2.5">
              <p className="text-white text-xs leading-tight font-medium">{img.caption}</p>
            </div>
            <div className="absolute inset-0 rounded-2xl ring-2 ring-white/0 group-hover:ring-white/30 transition-all duration-300" />
          </button>
        ))}
      </div>
    </div>
  );
}

function Work() {
  const headRef = useScrollReveal();
  const [selected, setSelected] = useState<{ src: string; caption: string } | null>(null);
  const selectedIdx = selected ? ALL_WORK.findIndex(w => w.src === selected.src) : -1;

  return (
    <section id="work" className="scroll-mt-24 py-10">
      <div className="mx-auto max-w-6xl px-4">
        {/* Header */}
        <div ref={headRef} className="reveal text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass text-xs mb-4">
            <Zap className="size-3.5 text-[var(--orange)]" />
            <span className="text-muted-foreground">Work History</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-bold mb-3">
            <span className="text-gradient">ប្រវត្តិ</span>ការងារ
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            បទពិសោធន៍ការងាររបស់ខ្ញុំនៅ E-GetS Technology Co., Ltd.
          </p>
        </div>

        {/* Company badge */}
        <div className="flex justify-center mb-8">
          <div className="glass rounded-2xl px-6 py-4 flex items-center gap-4">
            <div className="size-12 rounded-xl bg-orange-500/10 border border-orange-500/20 grid place-items-center shrink-0">
              <Zap className="size-5 text-orange-400" />
            </div>
            <div>
              <p className="font-bold text-sm">E-GetS Technology Co., Ltd.</p>
              <p className="text-xs text-muted-foreground mt-0.5">Sihanoukville, Cambodia</p>
            </div>
          </div>
        </div>

        {/* Marquee columns */}
        <div className="flex gap-4 items-start">
          <MarqueeCol images={COL1} duration={22} onClick={setSelected} />
          <MarqueeCol images={COL2} duration={28} onClick={setSelected} />
        </div>

        {/* Lightbox */}
        {selected !== null && (
          <div
            className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setSelected(null)}
          >
            <div
              className="relative max-w-2xl w-full rounded-2xl overflow-hidden shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={selected.src}
                alt={selected.caption}
                className="w-full object-contain max-h-[80vh]"
              />
              <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/70 to-transparent px-4 py-3">
                <p className="text-white text-sm font-medium">{selected.caption}</p>
              </div>
              <button
                onClick={() => setSelected(ALL_WORK[(selectedIdx - 1 + ALL_WORK.length) % ALL_WORK.length])}
                className="absolute left-2 top-1/2 -translate-y-1/2 size-9 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/70 transition text-xl"
              >‹</button>
              <button
                onClick={() => setSelected(ALL_WORK[(selectedIdx + 1) % ALL_WORK.length])}
                className="absolute right-2 top-1/2 -translate-y-1/2 size-9 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/70 transition text-xl"
              >›</button>
              <button
                onClick={() => setSelected(null)}
                className="absolute top-2 right-2 size-8 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/70 transition text-lg leading-none"
              >×</button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

const SNOWFLAKES = Array.from({ length: 35 }, (_, i) => ({
  id: i,
  left: `${(i * 2.86 + Math.random() * 5)}%`,
  size: `${Math.random() * 5 + 3}px`,
  duration: `${Math.random() * 6 + 7}s`,
  delay: `${Math.random() * 4}s`,
  opacity: Math.random() * 0.35 + 0.25,
}));

function Snow() {
  return (
    <>
      {SNOWFLAKES.map((f) => (
        <div
          key={f.id}
          className="snowflake"
          style={{
            left: f.left,
            width: f.size,
            height: f.size,
            animationDuration: f.duration,
            animationDelay: f.delay,
            opacity: f.opacity,
          }}
        />
      ))}
    </>
  );
}

function Index() {
  return (
    <div className="min-h-screen">
      <Snow />
      <LotusBackground />
      <div className="relative" style={{ zIndex: 2 }}>
        <Nav />
        <main>
          <Hero />
          <Bots />
          <Work />
          <About />
        </main>
        <Footer />
      </div>
    </div>
  );
}
