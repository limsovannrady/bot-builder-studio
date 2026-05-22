import { createFileRoute } from "@tanstack/react-router";
import { Send, Sun, Moon, Menu, X, Zap, Camera, ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useRef, useState, useCallback } from "react";

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
  { id: "bots", label: "Bot ទាំងអស់" },
  { id: "memories", label: "រូបថតអនុស្សាវរីយ៍" },
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
            aria-label="ត្រឡប់ទៅទំព័រដើម — លឹម សុវណ្ណរ៉ាឌី"
            className="focus-ring rounded-2xl"
          >
            <img
              src="/logo-brand.png"
              alt="លឹម សុវណ្ណរ៉ាឌី"
              className="h-11 w-auto object-contain drop-shadow-[0_0_6px_rgba(212,175,55,0.8)]"
            />
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
    username: "",
    img: "/auto-reaction-bot.jpg",
    telegramLink: MY_BOT_LINK,
    accentColor: "oklch(0.65 0.22 290)",
    tag: "",
  },
  {
    id: "translate",
    name: "Translate Bot",
    username: "@GoogleTranslate2026_Bot",
    img: "/translate-bot.jpg",
    telegramLink: "https://t.me/GoogleTranslate2026_Bot",
    accentColor: "oklch(0.82 0.15 200)",
    tag: "",
  },
  {
    id: "voice",
    name: "បង្កើតសំឡេង Ai",
    username: "@limsovannradybot",
    img: "/voice-bot.jpg",
    telegramLink: "https://t.me/limsovannradybot",
    accentColor: "oklch(0.72 0.19 145)",
    tag: "",
  },
  {
    id: "qr",
    name: "Create QR & Scan",
    username: "@CreateQR_ScanBot",
    img: "/qr-bot.jpg",
    telegramLink: "https://t.me/CreateQR_ScanBot",
    accentColor: "oklch(0.78 0.18 55)",
    tag: "",
  },
];

function BotsSection() {
  const ref = useScrollReveal();

  return (
    <section id="bots" className="scroll-mt-24 py-16 px-4">
      <div ref={ref} className="reveal mx-auto max-w-5xl">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold mb-2">
            <span className="text-gradient">Bot</span> ទាំងអស់
          </h2>
          <p className="text-muted-foreground text-sm max-w-sm mx-auto">
            ប្រើប្រាស់បានតែនៅលើ Telegram — ចុចដើម្បីចូលប្រើ Bot
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-5">
          {BOTS.map((bot, i) => (
            <div
              key={bot.id}
              className="flex flex-col items-center gap-3 w-[140px] sm:w-[160px]"
            >
              {/* App-icon tile — links directly to Telegram */}
              <a
                href={bot.telegramLink}
                target="_blank"
                rel="noreferrer"
                className="bot-icon-tile relative w-full aspect-square rounded-[28px] bg-card border border-border/60 shadow-md hover:shadow-xl transition-all duration-300 active:scale-95 overflow-visible"
                style={{ transitionDelay: `${i * 60}ms` }}
                aria-label={bot.name}
              >
                {/* Animated logo centered inside tile */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div
                    className="relative size-20 bot-logo-float"
                    style={{ ["--bf-dur" as string]: `${4.5 + i * 0.4}s`, ["--bf-delay" as string]: `${i * 0.3}s` }}
                  >
                    {/* Glow */}
                    <div
                      className="absolute -inset-1 rounded-[22px] blur-lg opacity-50"
                      style={{ background: bot.accentColor }}
                    />
                    {/* Spinning ring */}
                    <div
                      className="bot-logo-ring absolute inset-0 rounded-[22px]"
                      style={{ background: `conic-gradient(from 0deg, ${bot.accentColor} 0%, transparent 45%, ${bot.accentColor} 100%)` }}
                    />
                    {/* Image */}
                    <div className="absolute inset-[2.5px] rounded-[19px] overflow-hidden">
                      <img src={bot.img} alt={bot.name} className="size-full object-cover" />
                      <div
                        className="bot-logo-shimmer absolute inset-0"
                        style={{ animationDelay: `${i * 0.9}s` }}
                      />
                    </div>
                  </div>
                </div>

              </a>

              {/* Name + username */}
              <div className="text-center w-full">
                <p className="text-sm font-bold leading-tight truncate">{bot.name}</p>
                {bot.username && <p className="text-[11px] text-muted-foreground mt-0.5 truncate">{bot.username}</p>}
              </div>

              {/* Telegram button */}
              <a
                href={bot.telegramLink}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-[11px] font-semibold border border-border bg-secondary/60 hover:bg-secondary transition-colors"
              >
                <Send className="size-3" /> Telegram
              </a>
            </div>
          ))}
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

const TIMELINE = [
  {
    year: "2024",
    month: "ខែវិច្ឆិកា",
    title: "ចូលរួមជាមួយ E-GetS",
    desc: "បានចាប់ផ្តើមការងារជា Delivery Driver នៅ E-GetS សាខា K16b (Klang Ler) ក្រុងព្រះសីហនុ",
    icon: "🚀",
    color: "oklch(0.65 0.22 290)",
  },
  {
    year: "2025",
    month: "ខែមីនា",
    title: "ម្ចាស់ Top 5 ស្លាចសេវាកម្ម",
    desc: "ទទួលបានការទទួលស្គាល់ Top 5 ពានស្លាចសេវាកម្មក្រុម ក្រុងព្រះសីហនុ — បង្ហាញពីការប្តេជ្ញាចិត្ត",
    icon: "🏆",
    color: "oklch(0.78 0.18 55)",
  },
  {
    year: "2025",
    month: "ខែមេសា",
    title: "សកម្មភាពអនុរក្សបរិស្ថាន",
    desc: "បានចូលរួមកម្មវិធីសំអាតឆ្នេរ E-GetS Green Clean ជាមួយក្រុមមិត្តរួម",
    icon: "🌿",
    color: "oklch(0.72 0.19 145)",
  },
  {
    year: "2025",
    month: "ខែធ្នូ",
    title: "E-GetS Annual Party — ពានរង្វាន់",
    desc: "ទទួលបានពានរង្វាន់ Best Driver Trophy និងវិញ្ញាបនបត្ររាប់អានពី E-GetS Tech Co., Ltd.",
    icon: "🥇",
    color: "oklch(0.82 0.15 200)",
  },
  {
    year: "2026",
    month: "ខែមករា",
    title: "បង្កើត Telegram Bots",
    desc: "ចាប់ផ្តើមសរសេរ Bots ដើម្បីជួយអ្នកប្រើប្រាស់ — Auto Reaction, Translate, Voice AI, QR Code",
    icon: "🤖",
    color: "oklch(0.72 0.16 82)",
  },
];

const STATS = [
  { value: "2+", label: "ឆ្នាំការងារ", icon: "📅" },
  { value: "4", label: "Telegram Bots", icon: "🤖" },
  { value: "Top 5", label: "ស្លាចសេវាកម្ម", icon: "🏅" },
  { value: "1k+", label: "ការដឹកជញ្ជូន", icon: "📦" },
];

function AboutSection() {
  const headerRef = useScrollReveal();
  const profileRef = useScrollReveal();
  const timelineRef = useScrollReveal();
  const statsRef = useScrollReveal();

  return (
    <section id="about" className="scroll-mt-24 py-16 px-4">
      <div className="mx-auto max-w-5xl">

        {/* Header */}
        <div ref={headerRef} className="reveal text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-secondary/70 border border-border/60 text-muted-foreground text-xs font-medium mb-4">
            <span>✦</span>
            <span>អំពីខ្ញុំ</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-bold mb-3">
            <span className="text-gradient">ជីវប្រវត្តិ</span> និងដំណើរ
          </h2>
          <p className="text-muted-foreground text-sm max-w-sm mx-auto">
            ដំណើរជីវិតការងារ ចាប់ពីអ្នកដឹកជញ្ជូន រហូតដល់អ្នករចនា Bots
          </p>
        </div>

        {/* Profile + Bio */}
        <div ref={profileRef} className="reveal grid md:grid-cols-2 gap-8 items-center mb-14">

          {/* Profile photo */}
          <div className="flex justify-center">
            <div className="relative">
              {/* Glow rings */}
              <div className="absolute -inset-3 rounded-[2.5rem] bg-gradient-to-br from-[oklch(0.52_0.22_290/30%)] via-[oklch(0.72_0.16_82/25%)] to-[oklch(0.78_0.18_55/30%)] blur-2xl" />
              <div className="absolute -inset-1 rounded-[2rem] border border-[oklch(0.72_0.16_82/40%)]" />
              <img
                src="/mem-01.jpg"
                alt="លឹម សុវណ្ណរ៉ាឌី"
                className="relative w-64 h-72 object-cover rounded-[1.75rem] shadow-2xl"
              />
              {/* Badge */}
              <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 whitespace-nowrap px-4 py-2 rounded-xl bg-card border border-border shadow-lg flex items-center gap-2">
                <span className="size-2 rounded-full bg-green-500 animate-pulse inline-block" />
                <span className="text-xs font-semibold text-foreground">E-GetS Delivery · K16b</span>
              </div>
            </div>
          </div>

          {/* Bio card */}
          <div className="space-y-4">
            <div>
              <h3 className="text-xl md:text-2xl font-bold mb-1">លឹម <span className="text-gradient">សុវណ្ណរ៉ាឌី</span></h3>
              <p className="text-muted-foreground text-sm">Lim Sovannrady · ID: 10080812</p>
            </div>

            <p className="text-sm text-muted-foreground leading-relaxed">
              ខ្ញុំជា Delivery Driver នៅ <span className="text-foreground font-medium">E-GetS</span> ដែលស្រឡាញ់ការងារ
              និងការច្នៃប្រឌិតបច្ចេកវិទ្យា។ ក្រៅពីការងារប្រចាំថ្ងៃ ខ្ញុំបង្កើត
              <span className="text-foreground font-medium"> Telegram Bots </span>
              ដើម្បីជួយអ្នកប្រើប្រាស់ Telegram ក្នុងប្រទេសកម្ពុជា
              — ឥតគិតថ្លៃ ហើយប្រើប្រាស់ងាយស្រួល។
            </p>

            <div className="flex flex-wrap gap-2">
              {["E-GetS Driver","Telegram Bot Dev","ក្រុងព្រះសីហនុ","Cambodia"].map(tag => (
                <span key={tag} className="px-3 py-1 rounded-full bg-secondary/60 border border-border/50 text-xs font-medium text-muted-foreground">
                  {tag}
                </span>
              ))}
            </div>

            <a
              href="https://t.me/limsvannrady"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition shadow-glow"
            >
              <Send className="size-4" /> ទំនាក់ទំនង Telegram
            </a>
          </div>
        </div>

        {/* Stats */}
        <div ref={statsRef} className="reveal grid grid-cols-2 sm:grid-cols-4 gap-3 mb-14">
          {STATS.map((s) => (
            <div key={s.label} className="flex flex-col items-center gap-1.5 py-5 px-3 rounded-2xl bg-card border border-border/60 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300">
              <span className="text-2xl">{s.icon}</span>
              <span className="text-2xl font-bold text-gradient">{s.value}</span>
              <span className="text-xs text-muted-foreground text-center font-medium">{s.label}</span>
            </div>
          ))}
        </div>

        {/* Timeline */}
        <div ref={timelineRef} className="reveal">
          <h3 className="text-lg font-bold mb-8 text-center">
            <span className="text-gradient">ដំណើរ</span>ការងារ
          </h3>
          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-5 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-border to-transparent md:-translate-x-px" />

            <div className="space-y-8">
              {TIMELINE.map((item, i) => {
                const isRight = i % 2 === 0;
                return (
                  <div
                    key={i}
                    className={`relative flex items-start gap-6 md:gap-0 ${
                      isRight ? "md:flex-row" : "md:flex-row-reverse"
                    }`}
                  >
                    {/* Content card */}
                    <div className={`flex-1 md:w-[calc(50%-2rem)] ml-12 md:ml-0 ${
                      isRight ? "md:pr-10 md:text-right" : "md:pl-10 md:text-left"
                    }`}>
                      <div className="group p-4 rounded-2xl bg-card border border-border/60 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300">
                        <div className={`flex items-center gap-2 mb-2 ${isRight ? "md:justify-end" : "md:justify-start"}`}>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full text-white" style={{ background: item.color }}>
                            {item.month} {item.year}
                          </span>
                        </div>
                        <h4 className="font-bold text-sm mb-1 text-foreground">{item.title}</h4>
                        <p className="text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
                      </div>
                    </div>

                    {/* Center dot */}
                    <div className="absolute left-5 md:left-1/2 md:-translate-x-1/2 top-4 size-4 rounded-full border-2 border-background flex items-center justify-center shadow-md z-10"
                      style={{ background: item.color }}>
                      <span className="text-[8px] leading-none">{item.icon}</span>
                    </div>

                    {/* Spacer for opposite side */}
                    <div className="hidden md:block flex-1" />
                  </div>
                );
              })}
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}

type MemoryPhoto = {
  src: string;
  caption: string;
  category: string;
  span?: "tall" | "wide" | "normal";
};

const MEMORY_PHOTOS: MemoryPhoto[] = [
  { src: "/mem-04.jpg", caption: "ទទួលបានពានរង្វាន់ E-GetS Annual Party", category: "ពានរង្វាន់", span: "tall" },
  { src: "/mem-05.jpg", caption: "រូបថតជាមួយក្រុមការងារ Klang Ler", category: "ក្រុម" },
  { src: "/mem-02.jpg", caption: "បង្ហាញ 3D Model ដែលជាខ្លួនខ្ញុំ", category: "ពិសេស", span: "tall" },
  { src: "/mem-03.jpg", caption: "ស្លាចសេវាកម្ម ក្រុងព្រះសីហនុ - Top 5", category: "ពានរង្វាន់" },
  { src: "/mem-11.jpg", caption: "ក្រុមការងារធំ — ទីតាំង Sihanoukville", category: "ក្រុម" },
  { src: "/mem-01.jpg", caption: "លឹម សុវណ្ណរ៉ាឌី — E-GetS Delivery K16b", category: "បុគ្គលិក", span: "tall" },
  { src: "/mem-06.jpg", caption: "សកម្មភាពអនុរក្សបរិស្ថានតាមឆ្នេរ", category: "សកម្មភាព" },
  { src: "/mem-07.jpg", caption: "ទទួលវិញ្ញាបនបត្រ — ម្ចាស់ E-GetS", category: "ពានរង្វាន់" },
  { src: "/mem-13.jpg", caption: "ប្រចាំការ — E-GetS Honda NCX", category: "ការងារ", span: "tall" },
  { src: "/mem-08.jpg", caption: "ក្រុមមិត្តក្នុងសកម្មភាពសំអាតឆ្នេរ", category: "សកម្មភាព" },
  { src: "/mem-15.jpg", caption: "ក្រុមការងារ — Sihanoukville District", category: "ក្រុម" },
  { src: "/mem-09.jpg", caption: "ទទួលឧបករណ៍ការងារ — E-GetS Office", category: "ការងារ" },
  { src: "/mem-10.jpg", caption: "ប្រជុំប្រចាំថ្ងៃ — Krong Preah Sihanouk", category: "ការងារ", span: "wide" },
  { src: "/mem-12.jpg", caption: "ក្រុមមឈរជួរ — Sihanoukville", category: "ក្រុម" },
  { src: "/mem-14.jpg", caption: "ប្រជុំនៅ E-GetS Hub", category: "ការងារ" },
  { src: "/mem-16.jpg", caption: "ម៉ូតូដឹកជញ្ជូន E-GetS — ឆ្នេរព្រះសីហនុ", category: "ការងារ", span: "wide" },
  { src: "/mem-17.jpg", caption: "ជួររថយន្ត E-GetS — Sihanoukville Road", category: "ការងារ" },
];

const MEM_CATEGORIES = ["ទាំងអស់", "ពានរង្វាន់", "ក្រុម", "ការងារ", "សកម្មភាព", "ពិសេស", "បុគ្គលិក"];

function MemoriesSection() {
  const ref = useScrollReveal();
  const [activeCategory, setActiveCategory] = useState("ទាំងអស់");
  const [lightbox, setLightbox] = useState<number | null>(null);

  const filtered = activeCategory === "ទាំងអស់"
    ? MEMORY_PHOTOS
    : MEMORY_PHOTOS.filter(p => p.category === activeCategory);

  const openLightbox = useCallback((idx: number) => setLightbox(idx), []);
  const closeLightbox = useCallback(() => setLightbox(null), []);

  const goPrev = useCallback(() => {
    setLightbox(i => i === null ? null : (i - 1 + filtered.length) % filtered.length);
  }, [filtered.length]);

  const goNext = useCallback(() => {
    setLightbox(i => i === null ? null : (i + 1) % filtered.length);
  }, [filtered.length]);

  useEffect(() => {
    if (lightbox === null) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowLeft") goPrev();
      if (e.key === "ArrowRight") goNext();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [lightbox, goPrev, goNext, closeLightbox]);

  return (
    <section id="memories" className="scroll-mt-24 py-16 px-4">
      <div ref={ref} className="reveal mx-auto max-w-6xl">

        {/* Section header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-secondary/70 border border-border/60 text-muted-foreground text-xs font-medium mb-4">
            <Camera className="size-3.5" />
            <span>រូបថតអនុស្សាវរីយ៍</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-bold mb-2">
            <span className="text-gradient">ទំព័រ</span> 추억
          </h2>
          <h2 className="text-2xl md:text-3xl font-bold mb-3">
            <span className="text-gradient">ការចងចាំ</span> នៃការងារ
          </h2>
          <p className="text-muted-foreground text-sm max-w-sm mx-auto">
            ឯកសារ ព្រឹត្តិការណ៍ ដែលបានកន្លងផ្តាច់ ក្នុងការិយាល័យ E-GetS
          </p>
        </div>

        {/* Category filter */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {MEM_CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => { setActiveCategory(cat); setLightbox(null); }}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold border transition-all duration-200 ${
                activeCategory === cat
                  ? "bg-primary text-primary-foreground border-primary shadow-glow"
                  : "bg-secondary/50 text-muted-foreground border-border/50 hover:bg-secondary hover:text-foreground"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Masonry grid */}
        <div className="columns-2 sm:columns-3 lg:columns-4 gap-3 space-y-3">
          {filtered.map((photo, idx) => (
            <div
              key={photo.src + idx}
              onClick={() => openLightbox(idx)}
              className={`mem-card group relative break-inside-avoid rounded-2xl overflow-hidden cursor-zoom-in border border-border/40 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 ${
                photo.span === "tall" ? "row-span-2" : ""
              }`}
            >
              <img
                src={photo.src}
                alt={photo.caption}
                className={`w-full object-cover transition-transform duration-500 group-hover:scale-105 ${
                  photo.span === "tall" ? "aspect-[3/4]" :
                  photo.span === "wide" ? "aspect-[16/9]" :
                  "aspect-square"
                }`}
                loading="lazy"
              />
              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3">
                <span className="inline-block px-2 py-0.5 rounded-full bg-primary/80 text-primary-foreground text-[10px] font-semibold mb-1.5 w-fit">
                  {photo.category}
                </span>
                <p className="text-white text-xs font-medium leading-snug line-clamp-2">
                  {photo.caption}
                </p>
              </div>
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center text-muted-foreground py-16 text-sm">
            មិនមានរូបថតសម្រាប់ប្រភេទនេះ
          </div>
        )}
      </div>

      {/* Lightbox */}
      {lightbox !== null && (
        <div
          className="fixed inset-0 z-[999] flex items-center justify-center bg-black/90 backdrop-blur-sm animate-fade-up"
          onClick={closeLightbox}
        >
          {/* Close */}
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 size-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors z-10"
            aria-label="បិទ"
          >
            <X className="size-5" />
          </button>

          {/* Prev */}
          <button
            onClick={(e) => { e.stopPropagation(); goPrev(); }}
            className="absolute left-3 md:left-6 size-10 rounded-full bg-white/10 hover:bg-white/25 text-white flex items-center justify-center transition-colors z-10"
            aria-label="មុន"
          >
            <ChevronLeft className="size-6" />
          </button>

          {/* Image */}
          <div
            className="relative max-w-4xl w-full mx-16 flex flex-col items-center"
            onClick={e => e.stopPropagation()}
          >
            <img
              src={filtered[lightbox].src}
              alt={filtered[lightbox].caption}
              className="max-h-[80vh] w-auto max-w-full rounded-2xl shadow-2xl object-contain"
            />
            <div className="mt-4 text-center px-4">
              <span className="inline-block px-3 py-1 rounded-full bg-primary/80 text-primary-foreground text-xs font-semibold mb-2">
                {filtered[lightbox].category}
              </span>
              <p className="text-white/90 text-sm font-medium">{filtered[lightbox].caption}</p>
              <p className="text-white/40 text-xs mt-1">{lightbox + 1} / {filtered.length}</p>
            </div>
          </div>

          {/* Next */}
          <button
            onClick={(e) => { e.stopPropagation(); goNext(); }}
            className="absolute right-3 md:right-6 size-10 rounded-full bg-white/10 hover:bg-white/25 text-white flex items-center justify-center transition-colors z-10"
            aria-label="បន្ទាប់"
          >
            <ChevronRight className="size-6" />
          </button>
        </div>
      )}
    </section>
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
        <main>
          <Hero />
          <AboutSection />
          <BotsSection />
          <MemoriesSection />
        </main>
        <Footer />
      </div>
    </div>
  );
}
