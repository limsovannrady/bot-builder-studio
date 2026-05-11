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
    if (typeof window === "undefined") return "dark";
    const stored = localStorage.getItem("theme") as "dark" | "light" | null;
    if (stored === "light" || stored === "dark") return stored;
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  });
  useEffect(() => {
    const root = document.documentElement;
    if (theme === "light") {
      root.classList.add("light");
    } else {
      root.classList.remove("light");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);
  return { theme, toggle: () => setTheme((t) => (t === "dark" ? "light" : "dark")) };
}

const NAV_LINKS = [
  { id: "home", label: "ទំព័រដើម" },
  { id: "bots", label: "Bots" },
  { id: "about", label: "អំពីខ្ញុំ" },
  { id: "contact", label: "ទាក់ទង" },
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

const bots = [
  {
    name: "បកប្រែភាសា",
    username: "@GoogleTranslate2026_Bot",
    desc: "បំលែងអត្ថបទទៅជាសំឡេងធម្មជាតិភ្លាមៗ ជាមួយគុណភាពច្បាស់",
    img: BOT_TTS,
    icon: Mic,
    accent: "cyan",
    link: "https://t.me/GoogleTranslate2026_Bot",
  },
  {
    name: "BotTranslate",
    username: "@BotTranslate",
    desc: "បកប្រែភាសាដោយ AI ដ៏រហ័ស គាំទ្រភាសាជាច្រើនលើពិភពលោក",
    img: BOT_TRANS,
    icon: Languages,
    accent: "orange",
    link: "https://t.me/BotTranslate",
  },
  {
    name: "AI Assistant Bot",
    username: "@limsvannrady_ai",
    desc: "ជំនួយការ AI ឆ្លាតវៃ សម្រាប់ឆ្លើយសំណួរ និងបង្កើតគំនិត",
    img: BOT_AI,
    icon: Sparkles,
    accent: "primary",
    link: "https://t.me/limsvannrady",
  },
  {
    name: "Sovannrady Bot",
    username: "@limsovannradybot",
    desc: "Bot ពហុមុខងារ ស្វែងរក ឆ្លើយ និងជួយដោះស្រាយបញ្ហារបស់អ្នក",
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
            <a
              href={TELEGRAM}
              target="_blank"
              rel="noreferrer"
              onClick={() => setMenuOpen(false)}
              className="mt-1 px-4 py-2.5 rounded-xl text-sm font-medium bg-primary text-primary-foreground text-center hover:opacity-90 transition flex items-center justify-center gap-2"
            >
              <Send className="size-4" /> Telegram
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
    <section id="home" className="scroll-mt-24 pt-28 md:pt-36 pb-20">
      <div ref={ref} className="reveal mx-auto max-w-2xl px-4 flex flex-col items-center text-center animate-hero">

        {/* Headline */}
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight mb-4">
          <span className="text-gradient">បង្កើត Bots</span>{" "}
          <span>ឆ្លាតវៃសម្រាប់</span>
          <br />
          <span>អ្នករាល់គ្នា</span>
        </h1>
        <p className="text-sm text-muted-foreground/80 mb-8 leading-relaxed max-w-lg">
          ស្វែងយល់ពី Telegram bots ដ៏មានអានុភាពដែលខ្ញុំបានបង្កើត សម្រាប់ជួយការងារប្រចាំថ្ងៃរបស់អ្នក។
        </p>

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
    <section id="bots" className="scroll-mt-24 py-20">
      <div className="mx-auto max-w-6xl px-4">
        <div ref={headRef} className="reveal text-center mb-14">
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

        <div ref={listRef} className="reveal mx-auto max-w-2xl flex flex-col gap-3">
          {bots.map((b, i) => {
            const Icon = b.icon;
            const accentColor =
              b.accent === "cyan"   ? "var(--cyan)" :
              b.accent === "orange" ? "var(--orange)" :
              b.accent === "green"  ? "oklch(0.72 0.19 145)" :
              "var(--primary)";
            const iconBg =
              b.accent === "cyan"
                ? "bg-[oklch(0.82_0.15_200/15%)] text-[var(--cyan)]"
                : b.accent === "orange"
                ? "bg-[oklch(0.78_0.18_55/15%)] text-[var(--orange)]"
                : b.accent === "green"
                ? "bg-[oklch(0.72_0.19_145/15%)] text-[oklch(0.72_0.19_145)]"
                : "bg-[oklch(0.62_0.19_245/15%)] text-[var(--primary)]";
            return (
              <a
                key={b.name}
                href={b.link}
                target="_blank"
                rel="noreferrer"
                className="group relative glass rounded-2xl overflow-hidden flex items-center gap-4 p-3 transition-all duration-300 hover:-translate-y-0.5 animate-fade-up"
                style={{ animationDelay: `${i * 0.08}s` }}
              >
                {/* Left accent bar */}
                <div className="absolute left-0 inset-y-0 w-0.5 rounded-full transition-all duration-300 group-hover:w-1" style={{ background: accentColor }} />

                {/* Thumbnail */}
                <div className="relative shrink-0 size-14 rounded-xl overflow-hidden">
                  <img src={b.img} alt={b.name} className="size-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-br from-transparent to-black/30" />
                </div>

                {/* Icon badge */}
                <div className={`shrink-0 size-9 rounded-xl ${iconBg} border border-white/10 grid place-items-center`}>
                  <Icon className="size-4" />
                </div>

                {/* Text */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-sm leading-tight">{b.name}</h3>
                  <p className="text-[11px] font-mono mb-0.5" style={{ color: accentColor }}>{b.username}</p>
                  <p className="text-xs text-muted-foreground leading-snug line-clamp-1">{b.desc}</p>
                </div>

                {/* Arrow */}
                <div
                  className="shrink-0 size-8 rounded-xl grid place-items-center transition-transform duration-200 group-hover:translate-x-0.5"
                  style={{ background: `${accentColor}22`, color: accentColor }}
                >
                  <Send className="size-3.5" />
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
    <section id="about" className="scroll-mt-24 py-20">
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
          <div className="relative shrink-0">
            <div className="absolute -inset-3 bg-gradient-hero rounded-full blur-2xl opacity-30" />
            <div className="relative size-32 md:size-44 rounded-full overflow-hidden shadow-glow">
              <img src={AVATAR} alt="លឹម សុវណ្ណរ៉ាឌី" className="size-full object-cover" />
            </div>
          </div>

          {/* Info */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <h2 className="text-3xl md:text-4xl font-bold leading-tight mb-2">
              <span className="text-gradient">លឹម សុវណ្ណរ៉ាឌី</span>
            </h2>
            <p className="text-base md:text-lg text-muted-foreground font-medium mb-4">
              អ្នកអភិវឌ្ឍន៍ Telegram Bot | បង្កើត Bots ឆ្លាតវៃ
            </p>
            <p className="text-sm text-muted-foreground/80 leading-relaxed mb-4">
              ខ្ញុំបង្កើត Telegram bots ដ៏មានអានុភាព ដូចជា បំលែងអត្ថបទទៅជាសំឡេង បកប្រែភាសា និងមុខងារមានប្រយោជន៍ជាច្រើនទៀត។
            </p>
            <p className="text-sm text-muted-foreground/70 leading-relaxed mb-6">
              ខ្ញុំជឿជាក់ថា បច្ចេកវិទ្យាល្អ គួរតែងាយស្រួលប្រើ និងជួយដោះស្រាយបញ្ហាជាក់ស្ដែងក្នុងជីវិតប្រចាំថ្ងៃ។
            </p>
            <a
              href={TELEGRAM}
              target="_blank"
              rel="noreferrer"
              className="focus-ring inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-hero text-white font-semibold shadow-glow hover:scale-[1.03] transition-transform text-sm"
            >
              <Send className="size-4" /> ទាក់ទងតាម Telegram
            </a>
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

const OUTER = "M100 100 C138 87 142 46 100 20 C58 46 62 87 100 100Z";
const INNER = "M100 100 C122 92 125 68 100 48 C75 68 78 92 100 100Z";
const OUTER_ANGLES = [0, 120, 240];
const INNER_ANGLES = [60, 180, 300];

function LotusIconFilled({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 200" fill="currentColor" xmlns="http://www.w3.org/2000/svg" className={className}>
      {OUTER_ANGLES.map(a => <path key={`o${a}`} d={OUTER} transform={`rotate(${a} 100 100)`} opacity={0.75} />)}
      {INNER_ANGLES.map(a => <path key={`i${a}`} d={INNER} transform={`rotate(${a} 100 100)`} opacity={0.95} />)}
      <circle cx="100" cy="100" r="14" opacity={1.0} />
      <circle cx="100" cy="100" r="8"  opacity={0.80} />
    </svg>
  );
}

function LotusIconOutline({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 200" fill="none" stroke="currentColor" strokeWidth="3.5" xmlns="http://www.w3.org/2000/svg" className={className}>
      {OUTER_ANGLES.map(a => <path key={`o${a}`} d={OUTER} transform={`rotate(${a} 100 100)`} opacity={0.85} />)}
      {INNER_ANGLES.map(a => <path key={`i${a}`} d={INNER} transform={`rotate(${a} 100 100)`} opacity={0.95} />)}
      <circle cx="100" cy="100" r="30" strokeDasharray="5 6" strokeWidth="2" opacity={0.45} />
      <circle cx="100" cy="100" r="14" fill="currentColor" stroke="none" opacity={0.75} />
      <circle cx="100" cy="100" r="6"  fill="currentColor" stroke="none" opacity={0.50} />
    </svg>
  );
}

function LotusIconDetailed({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className={className}>
      {OUTER_ANGLES.map(a => (
        <path key={`o${a}`} d={OUTER} transform={`rotate(${a} 100 100)`} fill="currentColor" opacity={0.68} />
      ))}
      {OUTER_ANGLES.map(a => (
        <line key={`v${a}`} x1="100" y1="88" x2="100" y2="28" transform={`rotate(${a} 100 100)`}
          stroke="currentColor" strokeWidth="1.8" opacity={0.38} />
      ))}
      {OUTER_ANGLES.map(a => (
        <circle key={`d${a}`} cx="100" cy="22" r="3.5" transform={`rotate(${a} 100 100)`}
          fill="currentColor" opacity={0.60} />
      ))}
      {INNER_ANGLES.map(a => (
        <path key={`i${a}`} d={INNER} transform={`rotate(${a} 100 100)`} fill="currentColor" opacity={0.92} />
      ))}
      {INNER_ANGLES.map(a => (
        <circle key={`id${a}`} cx="100" cy="50" r="2.5" transform={`rotate(${a} 100 100)`}
          fill="currentColor" opacity={0.55} />
      ))}
      <circle cx="100" cy="100" r="36" fill="none" stroke="currentColor" strokeWidth="1.5"
        strokeDasharray="3 6" opacity={0.32} />
      <circle cx="100" cy="100" r="14" fill="currentColor" opacity={1.0} />
      <circle cx="100" cy="100" r="7"  fill="currentColor" opacity={0.55} />
    </svg>
  );
}

type FlowerVariant = "filled" | "outline" | "detailed";

function LotusBackground() {
  const c = "var(--lotus-color)";
  const flowers: Array<{ top: string; left: string; size: number; color: string; opacity: number; delay: string; dur: string; rotate: string; dx: string; dy: string; variant: FlowerVariant }> = [
    { top: "-6%",  left: "66%",  size: 480, color: c, opacity: 0.32, delay: "0s",   dur: "22s", rotate: "15deg",  dx: "18px",  dy: "-14px", variant: "filled"   },
    { top: "26%",  left: "-9%",  size: 360, color: c, opacity: 0.28, delay: "4s",   dur: "26s", rotate: "-20deg", dx: "-16px", dy: "12px",  variant: "detailed" },
    { top: "58%",  left: "76%",  size: 320, color: c, opacity: 0.28, delay: "8s",   dur: "20s", rotate: "40deg",  dx: "20px",  dy: "10px",  variant: "filled"   },
    { top: "80%",  left: "13%",  size: 240, color: c, opacity: 0.25, delay: "2s",   dur: "30s", rotate: "-8deg",  dx: "-12px", dy: "-18px", variant: "outline"  },
    { top: "8%",   left: "2%",   size: 200, color: c, opacity: 0.25, delay: "6s",   dur: "28s", rotate: "-35deg", dx: "10px",  dy: "16px",  variant: "detailed" },
    { top: "42%",  left: "88%",  size: 170, color: c, opacity: 0.22, delay: "3s",   dur: "24s", rotate: "60deg",  dx: "-10px", dy: "8px",   variant: "outline"  },
    { top: "15%",  left: "42%",  size: 140, color: c, opacity: 0.18, delay: "7s",   dur: "32s", rotate: "25deg",  dx: "8px",   dy: "-12px", variant: "outline"  },
    { top: "68%",  left: "48%",  size: 210, color: c, opacity: 0.22, delay: "1s",   dur: "18s", rotate: "-50deg", dx: "14px",  dy: "6px",   variant: "detailed" },
    { top: "88%",  left: "72%",  size: 180, color: c, opacity: 0.20, delay: "5s",   dur: "25s", rotate: "80deg",  dx: "-8px",  dy: "-10px", variant: "filled"   },
    { top: "35%",  left: "28%",  size: 120, color: c, opacity: 0.16, delay: "9s",   dur: "35s", rotate: "-15deg", dx: "6px",   dy: "10px",  variant: "outline"  },
    { top: "-3%",  left: "22%",  size: 260, color: c, opacity: 0.20, delay: "11s",  dur: "29s", rotate: "50deg",  dx: "-14px", dy: "8px",   variant: "detailed" },
    { top: "52%",  left: "-4%",  size: 150, color: c, opacity: 0.18, delay: "13s",  dur: "23s", rotate: "-70deg", dx: "10px",  dy: "-8px",  variant: "filled"   },
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

function Index() {
  return (
    <div className="min-h-screen">
      <LotusBackground />
      <div className="relative" style={{ zIndex: 2 }}>
        <Nav />
        <main>
          <Hero />
          <Bots />
          <About />
        </main>
        <Footer />
      </div>
    </div>
  );
}
