import { createFileRoute } from "@tanstack/react-router";
import { Send, Sun, Moon, Menu, X, Zap, QrCode, Languages, Mic } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import BotPage from "@/components/BotModal";
import AutoReactionDemo from "@/components/bot-demos/AutoReactionDemo";
import QRDemo from "@/components/bot-demos/QRDemo";
import TranslateDemo from "@/components/bot-demos/TranslateDemo";
import VoiceDemo from "@/components/bot-demos/VoiceDemo";

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
  { id: "bots", label: "Bot ទាំងអស់" },
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

const TELEGRAM = "https://t.me/limsvannrady";
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

        <p className="text-muted-foreground text-sm md:text-base max-w-md mb-8 leading-relaxed">
          Telegram Bots ដែលជួយអ្នកឆ្លើយតប, បកប្រែ, ចែករំលែក QR Code, និងច្រើនទៀត — ឥតគិតថ្លៃ។
        </p>

        {/* Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3">
          <a
            href={TELEGRAM}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition shadow-glow"
          >
            <Send className="size-4" /> ទំនាក់ទំនង Telegram
          </a>
          <a
            href="#bots"
            onClick={(e) => smoothScroll(e, "bots")}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-border bg-secondary/60 text-foreground font-semibold text-sm hover:bg-secondary transition"
          >
            <Zap className="size-4" /> មើល Bot ទាំងអស់
          </a>
        </div>
      </div>
    </section>
  );
}

const BOTS = [
  {
    id: "autoreaction",
    name: "Auto Reaction Bot",
    username: "@AutoReaction2026Bot",
    desc: "React Emoji ដោយស្វ័យប្រវត្តិទៅសារ Telegram — ជ្រើសសន្លប់ Emoji ហើយ Bot នឹង React ជំនួសអ្នក។",
    img: "/auto-reaction-bot.jpg",
    telegramLink: MY_BOT_LINK,
    accentColor: "oklch(0.65 0.22 290)",
    cardClass: "bot-card-primary",
    icon: <Zap className="size-5" />,
    tag: "⚡ Auto Reaction",
    demo: <AutoReactionDemo />,
  },
  {
    id: "translate",
    name: "Translate Bot",
    username: "@GoogleTranslate2026_Bot",
    desc: "បកប្រែអត្ថបទរវាងភាសា ខ្មែរ, English, 中文, 日本語 និងច្រើនទៀត — លឿន និងត្រឹមត្រូវ។",
    img: "/translate-bot.jpg",
    telegramLink: "https://t.me/GoogleTranslate2026_Bot",
    accentColor: "oklch(0.82 0.15 200)",
    cardClass: "bot-card-cyan",
    icon: <Languages className="size-5" />,
    tag: "🌐 Translate",
    demo: <TranslateDemo />,
  },
  {
    id: "qr",
    name: "QR Code Bot",
    username: "@SovannradyQRBot",
    desc: "បង្កើត QR Code ពី Link ឬអត្ថបទ, Scan QR Code ពីរូបភាព — ងាយស្រួល និងរហ័ស។",
    img: "/logo-avatar.jpg",
    telegramLink: TELEGRAM,
    accentColor: "oklch(0.78 0.18 55)",
    cardClass: "bot-card-orange",
    icon: <QrCode className="size-5" />,
    tag: "📱 QR Code",
    demo: <QRDemo />,
  },
  {
    id: "voice",
    name: "Voice Bot",
    username: "@limsovannradybot",
    desc: "បំប្លែងអត្ថបទជាសំឡេង AI ភាសាខ្មែរ — ជ្រើសសំឡេងបុរស Piseth ឬ ស្ត្រី Sreymom។",
    img: "/voice-bot.jpg",
    telegramLink: "https://t.me/limsovannradybot",
    accentColor: "oklch(0.72 0.19 145)",
    cardClass: "bot-card-green",
    icon: <Mic className="size-5" />,
    tag: "🎙️ Voice",
    demo: <VoiceDemo />,
  },
];

function BotsSection() {
  const ref = useScrollReveal();
  const [openBot, setOpenBot] = useState<string | null>(null);

  const activeBot = BOTS.find((b) => b.id === openBot) ?? null;

  return (
    <section id="bots" className="scroll-mt-24 py-16 px-4">
      <div ref={ref} className="reveal mx-auto max-w-5xl">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold mb-2">
            <span className="text-gradient">Bot</span> ទាំងអស់
          </h2>
          <p className="text-muted-foreground text-sm max-w-sm mx-auto">
            សាកល្បង Demo ឥឡូវ — ឬ ចូល Telegram ដើម្បីប្រើពេញលេញ
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {BOTS.map((bot, i) => (
            <div
              key={bot.id}
              className={`relative rounded-2xl p-5 bg-gradient-card transition-all duration-300 cursor-pointer hover-lift ${bot.cardClass}`}
              style={{ transitionDelay: `${i * 60}ms` }}
            >
              {/* Tag */}
              <span
                className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full mb-4"
                style={{ background: `${bot.accentColor}20`, color: bot.accentColor }}
              >
                {bot.tag}
              </span>

              <div className="flex items-start gap-4 mb-4">
                {/* Bot logo */}
                <div
                  className="relative size-14 shrink-0 rounded-2xl overflow-hidden bot-logo-float"
                  style={{ ["--bf-dur" as string]: `${4.5 + i * 0.4}s`, ["--bf-delay" as string]: `${i * 0.3}s` }}
                >
                  <div
                    className="absolute -inset-1 rounded-2xl blur-md opacity-60"
                    style={{ background: bot.accentColor }}
                  />
                  <img src={bot.img} alt={bot.name} className="relative size-full object-cover" />
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-base leading-tight">{bot.name}</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">{bot.username}</p>
                  <p className="text-sm text-muted-foreground mt-2 leading-relaxed line-clamp-2">{bot.desc}</p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <button
                  onClick={() => setOpenBot(bot.id)}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-sm font-semibold transition-all hover:opacity-90 active:scale-95"
                  style={{ background: bot.accentColor, color: "oklch(0.15 0.04 290)" }}
                >
                  {bot.icon} សាកល្បង Demo
                </button>
                <a
                  href={bot.telegramLink}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl border border-border bg-secondary/50 text-sm font-medium hover:bg-secondary transition-colors"
                >
                  <Send className="size-3.5" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bot Modals */}
      {BOTS.map((bot) => (
        <BotPage
          key={bot.id}
          open={openBot === bot.id}
          onClose={() => setOpenBot(null)}
          botName={bot.name}
          botUsername={bot.username}
          botDesc={bot.desc}
          botImg={bot.img}
          telegramLink={bot.telegramLink}
          accentColor={bot.accentColor}
        >
          {bot.demo}
        </BotPage>
      ))}
    </section>
  );
}

function Footer() {
  return (
    <footer className="py-10 border-t border-border">
      <div className="mx-auto max-w-6xl px-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
        <div>២០២៦ លឹម សុវណ្ណរ៉ាឌី</div>
        <a
          href={TELEGRAM}
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-2 hover:text-foreground transition-colors"
        >
          <Send className="size-4" /> ទំនាក់ទំនង
        </a>
      </div>
    </footer>
  );
}

const OA = [0, 120, 240];
const IA = [60, 180, 300];
const OPETAL = "M100 100 C142 84 146 38 100 12 C54 38 58 84 100 100Z";
const IPETAL = "M100 100 C126 90 129 60 100 40 C71 60 74 90 100 100Z";
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
    { top: "-4%",  left: "2%",   size: S, color: gold, opacity: 0.28, delay: "0s",  dur: "42s", rotate: "-20deg", dx: "-6px", dy: "6px",  variant: "detailed" },
    { top: "-5%",  left: "38%",  size: S, color: gold, opacity: 0.22, delay: "7s",  dur: "58s", rotate: "25deg",  dx: "5px",  dy: "-5px", variant: "outline"  },
    { top: "-3%",  left: "74%",  size: S, color: gold, opacity: 0.30, delay: "14s", dur: "46s", rotate: "10deg",  dx: "7px",  dy: "-6px", variant: "filled"   },
    { top: "24%",  left: "-4%",  size: S, color: gold, opacity: 0.24, delay: "4s",  dur: "52s", rotate: "-35deg", dx: "-5px", dy: "7px",  variant: "filled"   },
    { top: "23%",  left: "46%",  size: S, color: gold, opacity: 0.18, delay: "20s", dur: "60s", rotate: "50deg",  dx: "6px",  dy: "5px",  variant: "detailed" },
    { top: "25%",  left: "82%",  size: S, color: gold, opacity: 0.26, delay: "10s", dur: "48s", rotate: "-15deg", dx: "-7px", dy: "-5px", variant: "outline"  },
    { top: "52%",  left: "4%",   size: S, color: gold, opacity: 0.22, delay: "17s", dur: "54s", rotate: "40deg",  dx: "5px",  dy: "-6px", variant: "outline"  },
    { top: "51%",  left: "40%",  size: S, color: gold, opacity: 0.20, delay: "3s",  dur: "44s", rotate: "-55deg", dx: "-6px", dy: "5px",  variant: "filled"   },
    { top: "53%",  left: "80%",  size: S, color: gold, opacity: 0.24, delay: "25s", dur: "56s", rotate: "70deg",  dx: "6px",  dy: "4px",  variant: "detailed" },
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
          <BotsSection />
        </main>
        <Footer />
      </div>
    </div>
  );
}
