import { createFileRoute } from "@tanstack/react-router";
import { Bot, Send, Sparkles, MessageCircle, Mic, Languages, Zap, Heart, Sun, Moon, Menu, X } from "lucide-react";
import { useEffect, useState } from "react";

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

const AVATAR = "https://i.ibb.co/RTRWzWt7/x.jpg";
const BOT_TTS = "https://i.ibb.co/BHLg2TzD/x.jpg";
const BOT_TRANS = "https://i.ibb.co/rGWPY8K2/x.jpg";
const BOT_AI = "https://i.ibb.co/GQjZdsng/x.jpg";
const TELEGRAM = "https://t.me/limsvannrady";

const bots = [
  {
    name: "Text to Voice Bot",
    username: "@limsvannrady",
    desc: "បំលែងអត្ថបទទៅជាសំឡេងធម្មជាតិភ្លាមៗ ជាមួយគុណភាពច្បាស់",
    img: BOT_TTS,
    icon: Mic,
    accent: "cyan",
    link: "https://t.me/limsvannrady",
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
  return (
    <section id="home" className="scroll-mt-24 pt-28 md:pt-36 pb-20">
      <div className="mx-auto max-w-2xl px-4 flex flex-col items-center text-center">

        {/* Profile photo */}
        <div className="relative mb-6">
          <div className="absolute -inset-3 bg-gradient-hero rounded-full blur-2xl opacity-30" />
          <div className="relative size-28 md:size-36 rounded-full overflow-hidden shadow-glow">
            <img src={AVATAR} alt="លឹម សុវណ្ណរ៉ាឌី" className="size-full object-cover" />
          </div>
        </div>

        {/* Name & title */}
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight mb-2">
          <span className="text-gradient">លឹម សុវណ្ណរ៉ាឌី</span>
        </h1>
        <p className="text-base md:text-lg text-muted-foreground font-medium mb-2">
          អ្នកអភិវឌ្ឍន៍ Telegram Bot | បង្កើត Bots ឆ្លាតវៃ
        </p>
        <p className="text-sm text-muted-foreground/80 mb-8 leading-relaxed max-w-lg">
          ខ្ញុំបង្កើត Telegram bots ដ៏មានអានុភាព ដូចជា បំលែងអត្ថបទទៅជាសំឡេង បកប្រែភាសា និងមុខងារមានប្រយោជន៍ជាច្រើនទៀត។
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
            href={TELEGRAM}
            target="_blank"
            rel="noreferrer"
            className="focus-ring inline-flex items-center gap-2 px-5 py-2.5 rounded-xl glass font-semibold hover:border-[var(--orange)]/60 transition-colors text-sm"
          >
            <Send className="size-4 text-[var(--orange)]" /> ទាក់ទងតាម Telegram
          </a>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 w-full max-w-sm">
          {[{n:"3+",l:"Bots"},{n:"1K+",l:"អ្នកប្រើ"},{n:"24/7",l:"ដំណើរការ"}].map((s) => (
            <div key={s.l} className="glass rounded-xl py-3 px-2 text-center">
              <div className="text-lg font-bold text-gradient">{s.n}</div>
              <div className="text-xs text-muted-foreground mt-0.5">{s.l}</div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}

function Bots() {
  return (
    <section id="bots" className="scroll-mt-24 py-20">
      <div className="mx-auto max-w-6xl px-4">
        <div className="text-center mb-14">
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

        <div className="grid md:grid-cols-3 gap-5">
          {bots.map((b, i) => {
            const Icon = b.icon;
            const cardClass =
              b.accent === "cyan" ? "bot-card-cyan" :
              b.accent === "orange" ? "bot-card-orange" :
              "bot-card-primary";
            const accentColor =
              b.accent === "cyan" ? "var(--cyan)" :
              b.accent === "orange" ? "var(--orange)" :
              "var(--primary)";
            const iconBg =
              b.accent === "cyan"
                ? "bg-[oklch(0.82_0.15_200/15%)] text-[var(--cyan)]"
                : b.accent === "orange"
                ? "bg-[oklch(0.78_0.18_55/15%)] text-[var(--orange)]"
                : "bg-[oklch(0.62_0.19_245/15%)] text-[var(--primary)]";
            const glowOverlay =
              b.accent === "cyan"
                ? "from-[oklch(0.82_0.15_200/25%)]"
                : b.accent === "orange"
                ? "from-[oklch(0.78_0.18_55/25%)]"
                : "from-[oklch(0.62_0.19_245/25%)]";
            return (
              <a
                key={b.name}
                href={b.link}
                target="_blank"
                rel="noreferrer"
                className={`group relative bg-gradient-card rounded-3xl overflow-hidden transition-all duration-300 hover:-translate-y-2 animate-fade-up ${cardClass}`}
                style={{ animationDelay: `${i * 0.12}s` }}
              >
                {/* Glow blur blob behind card */}
                <div
                  className="absolute -inset-px rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl -z-10"
                  style={{ background: `radial-gradient(ellipse at 50% 0%, ${accentColor} 0%, transparent 70%)` }}
                />

                {/* Image */}
                <div className="relative h-36 overflow-hidden">
                  <img
                    src={b.img}
                    alt={b.name}
                    className="size-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  />
                  {/* gradient overlay bottom */}
                  <div className="absolute inset-0 bg-gradient-to-t from-card via-card/50 to-transparent" />
                  {/* accent tint overlay on hover */}
                  <div className={`absolute inset-0 bg-gradient-to-t ${glowOverlay} to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                  {/* Icon badge */}
                  <div className={`absolute top-3 right-3 size-8 rounded-xl ${iconBg} backdrop-blur-md border border-white/10 grid place-items-center shadow-lg`}>
                    <Icon className="size-3.5" />
                  </div>
                  {/* Shine line at top */}
                  <div
                    className="absolute top-0 inset-x-0 h-px opacity-60"
                    style={{ background: `linear-gradient(90deg, transparent, ${accentColor}, transparent)` }}
                  />
                </div>

                {/* Content */}
                <div className="p-4">
                  <h3 className="text-base font-bold mb-0.5 leading-tight">{b.name}</h3>
                  <p className="text-xs font-mono mb-2" style={{ color: accentColor }}>{b.username}</p>
                  <p className="text-xs text-muted-foreground leading-relaxed mb-3">{b.desc}</p>

                  {/* CTA row */}
                  <div className="flex items-center justify-between pt-3 border-t border-white/5">
                    <span className="text-xs font-semibold" style={{ color: accentColor }}>
                      សាកល្បងឥឡូវ
                    </span>
                    <div
                      className="size-7 rounded-lg grid place-items-center transition-transform duration-200 group-hover:translate-x-1"
                      style={{ background: `${accentColor}22`, color: accentColor }}
                    >
                      <Send className="size-3" />
                    </div>
                  </div>
                </div>
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function QrSection() {
  const qr = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&bgcolor=23-30-50&color=ffffff&margin=10&data=${encodeURIComponent(TELEGRAM)}`;
  return (
    <section className="py-20">
      <div className="mx-auto max-w-5xl px-4">
        <div className="bg-gradient-card glass rounded-3xl p-8 md:p-12 grid md:grid-cols-2 gap-10 items-center">
          <div className="flex justify-center">
            <div className="relative p-4 bg-white rounded-2xl shadow-glow animate-float">
              <img src={qr} alt="QR Code" className="size-56 md:size-64" />
              <div className="absolute -top-3 -right-3 size-12 rounded-full bg-gradient-hero grid place-items-center shadow-orange">
                <Send className="size-5 text-white" />
              </div>
            </div>
          </div>
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--orange)]/10 text-[var(--orange)] text-xs mb-4">
              <Zap className="size-3.5" /> ងាយស្រួល
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              ស្កេនដើម្បី <span className="text-gradient">សាកល្បង Bots</span> ភ្លាមៗ
            </h2>
            <p className="text-muted-foreground mb-6 leading-relaxed">
              ប្រើទូរស័ព្ទរបស់អ្នកស្កេន QR Code នេះ ដើម្បីបើក Telegram ហើយចាប់ផ្ដើមសន្ទនាជាមួយ bots របស់ខ្ញុំភ្លាមៗ ដោយឥតគិតថ្លៃ។
            </p>
            <a href={TELEGRAM} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-hero text-white font-semibold shadow-glow hover:scale-[1.03] transition">
              <MessageCircle className="size-5" /> បើក Telegram
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

function About() {
  return (
    <section id="about" className="scroll-mt-24 py-20">
      <div className="mx-auto max-w-4xl px-4 text-center animate-fade-up">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass text-xs mb-4">
          <Heart className="size-3.5 text-[var(--orange)]" />
          <span className="text-muted-foreground">អំពីខ្ញុំ</span>
        </div>
        <h2 className="text-3xl md:text-5xl font-bold mb-6">
          មនុស្សម្នាក់ <span className="text-gradient">ចូលចិត្តកូដ</span>
        </h2>
        <p className="text-lg text-muted-foreground leading-relaxed mb-4">
          ខ្ញុំជាអ្នកអភិវឌ្ឍន៍ឯករាជ្យដែលមានចំណង់ចំណូលចិត្តក្នុងការបង្កើត Telegram bots ដ៏មានប្រយោជន៍ សម្រាប់សហគមន៍ខ្មែរ និងពិភពលោក។
        </p>
        <p className="text-muted-foreground leading-relaxed">
          ខ្ញុំជឿជាក់ថា បច្ចេកវិទ្យាល្អ គួរតែងាយស្រួលប្រើ និងជួយដោះស្រាយបញ្ហាជាក់ស្ដែងក្នុងជីវិតប្រចាំថ្ងៃ។
        </p>

        <div className="grid sm:grid-cols-3 gap-4 mt-10">
          {[
            { icon: Bot, t: "Bot Development", d: "Node.js, Python, AI APIs" },
            { icon: Sparkles, t: "AI Integration", d: "OpenAI, Gemini, Custom Models" },
            { icon: Zap, t: "Fast & Reliable", d: "Cloud-hosted 24/7 uptime" },
          ].map((s) => {
            const I = s.icon;
            return (
              <div key={s.t} className="glass rounded-2xl p-5 text-left hover:border-[var(--cyan)]/50 transition">
                <I className="size-6 text-[var(--cyan)] mb-3" />
                <div className="font-semibold mb-1">{s.t}</div>
                <div className="text-xs text-muted-foreground">{s.d}</div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function Contact() {
  return (
    <section id="contact" className="scroll-mt-24 py-20">
      <div className="mx-auto max-w-3xl px-4">
        <div className="bg-gradient-hero rounded-3xl p-10 md:p-14 text-center shadow-glow relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.2),transparent_50%)]" />
          <div className="relative">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
              ចង់សហការ ឬមានសំណួរ?
            </h2>
            <p className="text-white/90 text-lg mb-8 max-w-xl mx-auto">
              ផ្ញើសារមកខ្ញុំតាម Telegram — ខ្ញុំនឹងឆ្លើយតបយ៉ាងឆាប់រហ័ស
            </p>
            <a href={TELEGRAM} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 px-7 py-4 rounded-xl bg-white text-primary font-bold hover:scale-[1.03] transition shadow-orange">
              <Send className="size-5" /> ទាក់ទងតាម Telegram
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
        <div>© 2026 លឹម សុវណ្ណរ៉ាឌី — រក្សាសិទ្ធិគ្រប់យ៉ាង</div>
      </div>
    </footer>
  );
}

function LotusIcon({ className }: { className?: string }) {
  // Petal with explicitly ROUNDED tip using quadratic bezier — clearly lotus, not star
  // Outer: long petal, rounded tip, wide belly
  const p1 = "M100 100 C118 88 120 62 109 34 Q104 22 100 24 Q96 22 91 34 C80 62 82 88 100 100Z";
  // Mid: medium petal, same rounded tip
  const p2 = "M100 100 C115 91 116 72 107 50 Q103 40 100 42 Q97 40 93 50 C84 72 85 91 100 100Z";
  // Inner: short, round-tipped
  const p3 = "M100 100 C110 94 111 83 105 68 Q102 61 100 62 Q98 61 95 68 C89 83 90 94 100 100Z";

  const outer = Array.from({ length: 8 }, (_, i) => i * 45);
  const mid   = Array.from({ length: 8 }, (_, i) => i * 45 + 22.5);
  const inner = Array.from({ length: 8 }, (_, i) => i * 45);

  return (
    <svg viewBox="0 0 200 200" fill="currentColor" xmlns="http://www.w3.org/2000/svg" className={className}>
      {outer.map(a => <path key={`o${a}`} d={p1} transform={`rotate(${a} 100 100)`} opacity={0.48} />)}
      {mid.map(a   => <path key={`m${a}`} d={p2} transform={`rotate(${a} 100 100)`} opacity={0.66} />)}
      {inner.map(a => <path key={`i${a}`} d={p3} transform={`rotate(${a} 100 100)`} opacity={0.85} />)}
      <circle cx="100" cy="100" r="8" opacity={0.96} />
    </svg>
  );
}

function LotusBackground() {
  const c = "var(--lotus-color)";
  const flowers = [
    { top: "-6%",  left: "66%",  size: 480, color: c, opacity: 0.13, delay: "0s",  dur: "22s", rotate: "15deg"  },
    { top: "26%",  left: "-9%",  size: 360, color: c, opacity: 0.11, delay: "4s",  dur: "26s", rotate: "-20deg" },
    { top: "58%",  left: "76%",  size: 320, color: c, opacity: 0.11, delay: "8s",  dur: "20s", rotate: "40deg"  },
    { top: "80%",  left: "13%",  size: 240, color: c, opacity: 0.10, delay: "2s",  dur: "30s", rotate: "-8deg"  },
    { top: "8%",   left: "2%",   size: 200, color: c, opacity: 0.10, delay: "6s",  dur: "28s", rotate: "-35deg" },
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
            animationDelay: f.delay,
          }}
        >
          <LotusIcon className="size-full" />
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
          <QrSection />
          <About />
          <Contact />
        </main>
        <Footer />
      </div>
    </div>
  );
}
