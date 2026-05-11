import { createFileRoute } from "@tanstack/react-router";
import { Bot, Send, Sparkles, MessageCircle, Mic, Languages, Zap, Heart } from "lucide-react";
import { useEffect, useState } from "react";

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
  head: () => ({
    meta: [
      { title: "លីម សុវណ្ណរដ្យ — អ្នកអភិវឌ្ឍន៍ Telegram Bot" },
      { name: "description", content: "បង្កើត Telegram bots ដ៏ឆ្លាតវៃ — បំលែងអត្ថបទទៅសំឡេង បកប្រែភាសា និងមុខងារមានប្រយោជន៍ជាច្រើន។" },
      { property: "og:title", content: "លីម សុវណ្ណរដ្យ — Telegram Bot Developer" },
      { property: "og:description", content: "បង្កើត Telegram bots ដ៏ឆ្លាតវៃ និងមានអានុភាព។" },
      { property: "og:image", content: "https://i.ibb.co/RTRWzWt7/x.jpg" },
    ],
  }),
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
  return (
    <header className="fixed top-0 inset-x-0 z-50">
      <div className="mx-auto max-w-6xl px-4 py-4">
        <nav className="glass rounded-2xl px-5 py-3 flex items-center justify-between">
          <a href="#home" onClick={(e) => smoothScroll(e, "home")} className="flex items-center gap-2 font-bold">
            <div className="size-8 rounded-lg bg-gradient-hero grid place-items-center shadow-glow">
              <Bot className="size-4 text-white" />
            </div>
            <span className="text-gradient">សុវណ្ណរដ្យ</span>
          </a>
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
          <a href={TELEGRAM} target="_blank" rel="noreferrer" className="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition">
            <Send className="size-4" /> Telegram
          </a>
        </nav>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section id="home" className="scroll-mt-24 pt-32 md:pt-40 pb-20">
      <div className="mx-auto max-w-6xl px-4 grid md:grid-cols-2 gap-12 items-center">
        <div className="order-2 md:order-1 flex justify-center md:justify-start animate-fade-up">
          <div className="relative">
            <div className="absolute -inset-6 bg-gradient-hero rounded-full blur-3xl opacity-40 animate-glow" />
            <div className="relative size-64 md:size-80 rounded-full overflow-hidden ring-4 ring-primary/40 shadow-glow animate-float">
              <img src={AVATAR} alt="លីម សុវណ្ណរដ្យ" className="size-full object-cover" />
            </div>
            <div className="absolute -bottom-2 -right-2 glass rounded-full px-4 py-2 flex items-center gap-2 text-sm shadow-cyan">
              <span className="size-2 rounded-full bg-[var(--cyan)] animate-pulse" />
              <span>នៅអនឡាញ</span>
            </div>
          </div>
        </div>

        <div className="order-1 md:order-2 text-center md:text-left animate-fade-up" style={{ animationDelay: "0.1s" }}>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass text-xs mb-5">
            <Zap className="size-3.5 text-[var(--orange)]" />
            <span className="text-muted-foreground">Telegram Bot Developer</span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-4">
            សួស្តី! ខ្ញុំឈ្មោះ <br />
            <span className="text-gradient">លីម សុវណ្ណរដ្យ</span> 👋
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-3 font-medium">
            អ្នកអភិវឌ្ឍន៍ Telegram Bot | បង្កើត Bots ឆ្លាតវៃ
          </p>
          <p className="text-base text-muted-foreground/90 mb-8 leading-relaxed max-w-xl">
            ខ្ញុំបង្កើត Telegram bots ដ៏មានអានុភាព ដូចជា បំលែងអត្ថបទទៅជាសំឡេង បកប្រែភាសា និងមុខងារមានប្រយោជន៍ជាច្រើនទៀត។
          </p>
          <div className="flex flex-wrap gap-3 justify-center md:justify-start">
            <a href="#bots" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-hero text-white font-semibold shadow-glow hover:scale-[1.03] transition-transform">
              <Bot className="size-5" /> សាកល្បង Bots របស់ខ្ញុំ
            </a>
            <a href={TELEGRAM} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl glass font-semibold hover:border-[var(--orange)]/60 transition-colors">
              <Send className="size-5 text-[var(--orange)]" /> ទាក់ទងតាម Telegram
            </a>
          </div>

          <div className="grid grid-cols-3 gap-4 mt-10 max-w-md mx-auto md:mx-0">
            {[{n:"3+",l:"Bots"},{n:"1K+",l:"អ្នកប្រើ"},{n:"24/7",l:"ដំណើរការ"}].map((s) => (
              <div key={s.l} className="glass rounded-xl p-3 text-center">
                <div className="text-xl font-bold text-gradient">{s.n}</div>
                <div className="text-xs text-muted-foreground mt-1">{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Bots() {
  return (
    <section id="bots" className="scroll-mt-24 py-20">
      <div className="mx-auto max-w-6xl px-4">
        <div className="text-center mb-14 animate-fade-up">
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

        <div className="grid md:grid-cols-3 gap-6">
          {bots.map((b, i) => {
            const Icon = b.icon;
            const accentClass =
              b.accent === "cyan" ? "shadow-cyan ring-[var(--cyan)]/40" :
              b.accent === "orange" ? "shadow-orange ring-[var(--orange)]/40" :
              "shadow-glow ring-primary/40";
            return (
              <a
                key={b.name}
                href={b.link}
                target="_blank"
                rel="noreferrer"
                className="group bg-gradient-card rounded-2xl overflow-hidden border border-border hover:border-primary/50 transition-all hover:-translate-y-1 animate-fade-up"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <div className="relative h-48 overflow-hidden">
                  <img src={b.img} alt={b.name} className="size-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-card via-card/40 to-transparent" />
                  <div className={`absolute top-3 right-3 size-10 rounded-xl bg-gradient-hero grid place-items-center ${accentClass}`}>
                    <Icon className="size-5 text-white" />
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-1">{b.name}</h3>
                  <p className="text-sm text-[var(--cyan)] font-mono mb-3">{b.username}</p>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-4">{b.desc}</p>
                  <div className="flex items-center gap-2 text-sm font-medium text-[var(--orange)] group-hover:gap-3 transition-all">
                    សាកល្បងឥឡូវ <Send className="size-4" />
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
        <div>© 2026 លីម សុវណ្ណរដ្យ — រក្សាសិទ្ធិគ្រប់យ៉ាង</div>
        <div className="flex items-center gap-1.5">
          បង្កើតឡើងដោយ <Heart className="size-4 text-[var(--orange)] fill-[var(--orange)]" /> សម្រាប់សហគមន៍ Telegram
        </div>
      </div>
    </footer>
  );
}

function Index() {
  return (
    <div className="min-h-screen">
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
  );
}
