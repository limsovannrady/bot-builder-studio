import { useState, useRef, useEffect } from "react";
import { Play, Square, Volume2, Loader2, Mic } from "lucide-react";

const VOICES = [
  {
    id: "piseth",
    name: "Piseth",
    label: "បុរស",
    emoji: "👨",
    slow: false,
    sample: "សួស្ដី! ខ្ញុំឈ្មោះ Piseth ជា AI Voice Bot របស់ Sovannrady។",
  },
  {
    id: "sreymom",
    name: "Sreymom",
    label: "ស្ត្រី",
    emoji: "👩",
    slow: true,
    sample: "សួស្ដី! ខ្ញុំឈ្មោះ Sreymom ជា AI Voice Bot របស់ Sovannrady។",
  },
] as const;

type Voice = (typeof VOICES)[number];

function buildTTSUrl(text: string, slow: boolean) {
  return `/api/tts?text=${encodeURIComponent(text)}&slow=${slow}`;
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
  const [text, setText] = useState<string>(VOICES[0].sample);
  const [voice, setVoice] = useState<Voice>(VOICES[0]);
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
      const url = buildTTSUrl(chunk, voice.slow);
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

  function pickVoice(v: Voice) {
    stop();
    setVoice(v);
    setText(v.sample);
    setError("");
  }

  return (
    <div className="flex flex-col gap-5">

      {/* Voice selector */}
      <div>
        <label className="text-xs text-muted-foreground mb-2 block">ជ្រើសរើសសំឡេង</label>
        <div className="grid grid-cols-2 gap-3">
          {VOICES.map((v) => {
            const active = voice.id === v.id;
            return (
              <button
                key={v.id}
                onClick={() => pickVoice(v)}
                className={`relative flex flex-col items-center gap-2 rounded-2xl py-4 px-3 border-2 transition-all duration-200 ${
                  active
                    ? "border-green-500 bg-green-500/10 text-green-400"
                    : "border-border bg-secondary/30 text-muted-foreground hover:border-green-500/40 hover:bg-secondary/60 hover:text-foreground"
                }`}
              >
                {active && (
                  <span className="absolute top-2 right-2 size-2 rounded-full bg-green-500 animate-pulse" />
                )}
                <span className="text-3xl">{v.emoji}</span>
                <span className="font-bold text-sm">{v.name}</span>
                <span className="text-[10px] opacity-70">{v.label} · Khmer AI</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Text area */}
      <textarea
        value={text}
        onChange={(e) => { setText(e.target.value); if (playing) stop(); }}
        rows={4}
        placeholder="វាយអត្ថបទដែលចង់ស្ដាប់..."
        className="w-full rounded-xl border border-border bg-secondary/30 px-4 py-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-green-500 placeholder:text-muted-foreground/60"
      />

      {/* Play / stop button */}
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
          <><Mic className="size-4" /> ស្ដាប់សំឡេង {voice.name}</>
        )}
      </button>

      {/* Error */}
      {error && (
        <p className="text-xs text-red-400 text-center rounded-xl border border-red-500/20 bg-red-500/10 px-3 py-2">
          {error}
        </p>
      )}

      {/* Now playing indicator */}
      {playing && (
        <div className="flex items-center justify-center gap-3 py-3 rounded-xl bg-green-500/10 border border-green-500/20">
          <Volume2 className="size-5 text-green-400 animate-pulse" />
          <div className="flex gap-1 items-end h-5">
            {[1, 2, 3, 4, 5].map((i) => (
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
          <span className="text-xs text-green-400">
            {voice.name} · {voice.label}...
          </span>
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
