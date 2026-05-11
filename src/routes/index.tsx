import { createFileRoute } from "@tanstack/react-router";
import { Send, Heart, Sun, Moon, Menu, X } from "lucide-react";
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
const TELEGRAM = "https://t.me/limsvannrady";
const FACEBOOK = "https://www.facebook.com/limsovannrady";
const TELEGRAM_CHANNEL = "https://t.me/limsovannrady_Channel";
const MY_BOT_LINK = "https://t.me/AutoReaction2026Bot";

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

            {/* Bot របស់ខ្ញុំ tab — opens Telegram directly */}
            <a
              href={MY_BOT_LINK}
              target="_blank"
              rel="noreferrer"
              className="relative px-4 py-2 rounded-lg transition-all outline-none text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary/60 flex items-center gap-1.5"
            >
              <span>⚡</span> Bot របស់ខ្ញុំ
            </a>
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
            {/* Bot របស់ខ្ញុំ — mobile, opens Telegram */}
            <a
              href={MY_BOT_LINK}
              target="_blank"
              rel="noreferrer"
              onClick={() => setMenuOpen(false)}
              className="px-4 py-2.5 rounded-xl text-sm font-medium transition-colors text-left flex items-center gap-2 text-muted-foreground hover:text-foreground hover:bg-secondary/50"
            >
              <span>⚡</span> Bot របស់ខ្ញុំ
            </a>
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
            href="#about"
            onClick={(e) => smoothScroll(e, "about")}
            className="focus-ring inline-flex items-center gap-2 px-5 py-2.5 rounded-xl glass font-semibold hover:border-[var(--orange)]/60 transition-colors text-sm"
          >
            <Send className="size-4 text-[var(--orange)]" /> អំពីខ្ញុំ
          </a>
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
          <About />
        </main>
        <Footer />
      </div>
    </div>
  );
}
