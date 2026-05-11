import { useState, useRef, useEffect } from "react";
import { Play, Square, Volume2, Loader2 } from "lucide-react";

const VOICE_PRESETS = [
  { lang: "km",    label: "ខ្មែរ 🇰🇭",      sample: "សួស្ដី! ខ្ញុំគឺជា AI Voice Bot របស់ Sovannrady។" },
  { lang: "en",    label: "English 🇺🇸",     sample: "Hello! I am Sovannrady's AI Voice Bot." },
  { lang: "zh-CN", label: "中文 🇨🇳",         sample: "你好！我是Sovannrady的AI语音机器人。" },
  { lang: "ja",    label: "日本語 🇯🇵",       sample: "こんにちは！SovannradyのAI音声ボットです。" },
  { lang: "ko",    label: "한국어 🇰🇷",       sample: "안녕하세요! Sovannrady의 AI 음성 봇입니다." },
  { lang: "th",    label: "ไทย 🇹🇭",         sample: "สวัสดี! ฉันคือ AI Voice Bot ของ Sovannrady" },
  { lang: "fr",    label: "Français 🇫🇷",    sample: "Bonjour! Je suis le robot vocal IA de Sovannrady." },
  { lang: "vi",    label: "Tiếng Việt 🇻🇳",  sample: "Xin chào! Tôi là bot giọng nói AI của Sovannrady." },
];

function buildTTSUrl(text: string, lang: string, slow: boolean) {
  return `/api/tts?text=${encodeURIComponent(text)}&lang=${lang}&slow=${slow}`;
}

function splitText(text: string, max = 180): string[] {
  if (text.length <= max) return [text];
  const parts: string[] = [];
  let rest = text;
  while (rest.length > 0) {
    let cut = rest.lastIndexOf(" ", max);
    if (cut <= 0 || rest.length <= max) cut = Math.min(max, rest.length);
    parts.push(rest.slice(0, cut).trim());
    rest = rest.slice(cut).trim();
  }
  return parts.filter(Boolean);
}

export default function VoiceDemo() {
  const [text, setText] = useState("សួស្ដី! ខ្ញុំគឺជា AI Voice Bot របស់ Sovannrady។");
  const [preset, setPreset] = useState(VOICE_PRESETS[0]);
  const [slow, setSlow] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const stopRef = useRef(false);

  useEffect(() => () => { stop(); }, []);

  function stop() {
    stopRef.current = true;
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = "";
      audioRef.current = null;
    }
    setPlaying(false);
    setLoading(false);
  }

  async function playChunk(chunk: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const url = buildTTSUrl(chunk, preset.lang, slow);
      const audio = new Audio(url);
      audioRef.current = audio;
      audio.oncanplay = () => { setLoading(false); setPlaying(true); };
      audio.onended = () => resolve();
      audio.onerror = () => reject(new Error("audio_error"));
      audio.play().catch(reject);
    });
  }

  async function speak() {
    stop();
    stopRef.current = false;
    if (!text.trim()) return;
    setError("");
    setLoading(true);

    const chunks = splitText(text);
    try {
      for (const chunk of chunks) {
        if (stopRef.current) break;
        await playChunk(chunk);
      }
    } catch {
      if (!stopRef.current) {
        setError("មិនអាចចាក់សំឡេងបាន។ សូមពិនិត្យការតភ្ជាប់អ៊ីនធឺណិត ហើយព្យាយាមម្ដងទៀត។");
      }
    } finally {
      if (!stopRef.current) {
        setPlaying(false);
        setLoading(false);
      }
    }
  }

  function pickPreset(p: typeof VOICE_PRESETS[0]) {
    stop();
    setPreset(p);
    setText(p.sample);
    setError("");
  }

  return (
    <div className="flex flex-col gap-4">
      <div>
        <label className="text-xs text-muted-foreground mb-2 block">ជ្រើសរើសភាសា</label>
        <div className="grid grid-cols-4 gap-2">
          {VOICE_PRESETS.map(p => (
            <button
              key={p.lang}
              onClick={() => pickPreset(p)}
              className={`rounded-xl py-2 px-1 text-xs font-medium transition-all ${
                preset.lang === p.lang
                  ? "bg-green-500/20 border-2 border-green-500 text-green-400"
                  : "bg-secondary/40 border border-border hover:bg-secondary text-muted-foreground hover:text-foreground"
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      <textarea
        value={text}
        onChange={e => { setText(e.target.value); if (playing) stop(); }}
        rows={4}
        placeholder="វាយអត្ថបទដែលចង់ស្ដាប់..."
        className="w-full rounded-xl border border-border bg-secondary/30 px-4 py-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-green-500 placeholder:text-muted-foreground/60"
      />

      <div className="flex items-center gap-3 px-1">
        <span className="text-xs text-muted-foreground">ល្បឿន:</span>
        <button
          onClick={() => setSlow(false)}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all border ${
            !slow ? "bg-green-500/20 border-green-500 text-green-400" : "border-border bg-secondary/40 text-muted-foreground hover:text-foreground hover:bg-secondary"
          }`}
        >
          ធម្មតា
        </button>
        <button
          onClick={() => setSlow(true)}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all border ${
            slow ? "bg-green-500/20 border-green-500 text-green-400" : "border-border bg-secondary/40 text-muted-foreground hover:text-foreground hover:bg-secondary"
          }`}
        >
          យឺត
        </button>
      </div>

      <button
        onClick={playing || loading ? stop : speak}
        disabled={!text.trim()}
        className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-sm transition disabled:opacity-40 disabled:cursor-not-allowed ${
          playing || loading
            ? "bg-red-500/20 border border-red-500/50 text-red-400 hover:bg-red-500/30"
            : "bg-green-500 text-black hover:opacity-90"
        }`}
      >
        {loading ? (
          <><Loader2 className="size-4 animate-spin" /> កំពុងភ្ជាប់...</>
        ) : playing ? (
          <><Square className="size-4 fill-current" /> បញ្ឈប់</>
        ) : (
          <><Play className="size-4 fill-current" /> ស្ដាប់សំឡេង</>
        )}
      </button>

      {error && (
        <p className="text-xs text-red-400 text-center rounded-xl border border-red-500/20 bg-red-500/10 px-3 py-2">
          {error}
        </p>
      )}

      {playing && (
        <div className="flex items-center justify-center gap-3 py-3 rounded-xl bg-green-500/10 border border-green-500/20">
          <Volume2 className="size-5 text-green-400 animate-pulse" />
          <div className="flex gap-1 items-end h-5">
            {[1, 2, 3, 4, 5].map(i => (
              <div
                key={i}
                className="w-1 bg-green-400 rounded-full"
                style={{
                  height: `${40 + i * 12}%`,
                  animation: "wave-bar 0.8s ease-in-out infinite",
                  animationDelay: `${i * 0.12}s`,
                }}
              />
            ))}
          </div>
          <span className="text-xs text-green-400">កំពុងចាក់សំឡេង...</span>
        </div>
      )}

      <style>{`
        @keyframes wave-bar {
          0%, 100% { transform: scaleY(0.4); }
          50%       { transform: scaleY(1);   }
        }
      `}</style>
    </div>
  );
}
