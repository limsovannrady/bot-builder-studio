import { useState, useEffect, useRef } from "react";
import { Play, Square, Loader2, Volume2 } from "lucide-react";

const VOICE_PRESETS = [
  { lang: "km-KH", label: "ខ្មែរ 🇰🇭", sample: "សួស្ដី! ខ្ញុំគឺជា AI Voice Bot" },
  { lang: "en-US", label: "English 🇺🇸", sample: "Hello! I am an AI Voice Bot." },
  { lang: "zh-CN", label: "中文 🇨🇳", sample: "你好！我是AI语音机器人。" },
  { lang: "ja-JP", label: "日本語 🇯🇵", sample: "こんにちは！私はAI音声ボットです。" },
  { lang: "ko-KR", label: "한국어 🇰🇷", sample: "안녕하세요! 저는 AI 음성 봇입니다." },
  { lang: "th-TH", label: "ไทย 🇹🇭", sample: "สวัสดี! ฉันคือหุ่นยนต์เสียง AI" },
  { lang: "fr-FR", label: "Français 🇫🇷", sample: "Bonjour! Je suis un robot vocal IA." },
  { lang: "vi-VN", label: "Tiếng Việt 🇻🇳", sample: "Xin chào! Tôi là bot giọng nói AI." },
];

export default function VoiceDemo() {
  const [text, setText] = useState("សួស្ដី! ខ្ញុំគឺជា AI Voice Bot របស់ Sovannrady។");
  const [lang, setLang] = useState("km-KH");
  const [rate, setRate] = useState(1);
  const [pitch, setPitch] = useState(1);
  const [playing, setPlaying] = useState(false);
  const [supported, setSupported] = useState(true);
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);
  const uttRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    if (!("speechSynthesis" in window)) {
      setSupported(false);
      return;
    }
    function loadVoices() {
      setAvailableVoices(window.speechSynthesis.getVoices());
    }
    loadVoices();
    window.speechSynthesis.addEventListener("voiceschanged", loadVoices);
    return () => window.speechSynthesis.removeEventListener("voiceschanged", loadVoices);
  }, []);

  function speak() {
    if (!supported || !text.trim()) return;
    window.speechSynthesis.cancel();

    const utt = new SpeechSynthesisUtterance(text);
    utt.lang = lang;
    utt.rate = rate;
    utt.pitch = pitch;

    const voice = availableVoices.find(v => v.lang.startsWith(lang.split("-")[0]));
    if (voice) utt.voice = voice;

    utt.onstart = () => setPlaying(true);
    utt.onend = () => setPlaying(false);
    utt.onerror = () => setPlaying(false);

    uttRef.current = utt;
    window.speechSynthesis.speak(utt);
  }

  function stop() {
    window.speechSynthesis.cancel();
    setPlaying(false);
  }

  function pickPreset(preset: typeof VOICE_PRESETS[0]) {
    setLang(preset.lang);
    setText(preset.sample);
    if (playing) stop();
  }

  if (!supported) {
    return (
      <div className="text-center py-8 text-muted-foreground text-sm">
        Browser របស់អ្នកមិនគាំទ្រ Speech Synthesis។<br />
        សូមប្រើ Chrome ឬ Edge ។
      </div>
    );
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
                lang === p.lang
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
        onChange={e => setText(e.target.value)}
        rows={4}
        placeholder="វាយអត្ថបទដែលចង់ស្ដាប់..."
        className="w-full rounded-xl border border-border bg-secondary/30 px-4 py-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-green-500 placeholder:text-muted-foreground/60"
      />

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs text-muted-foreground mb-1 flex justify-between">
            <span>ល្បឿន</span> <span className="text-foreground">{rate.toFixed(1)}x</span>
          </label>
          <input
            type="range" min="0.5" max="2" step="0.1"
            value={rate}
            onChange={e => setRate(Number(e.target.value))}
            className="w-full accent-green-500"
          />
        </div>
        <div>
          <label className="text-xs text-muted-foreground mb-1 flex justify-between">
            <span>កម្ពស់សំឡេង</span> <span className="text-foreground">{pitch.toFixed(1)}</span>
          </label>
          <input
            type="range" min="0.5" max="2" step="0.1"
            value={pitch}
            onChange={e => setPitch(Number(e.target.value))}
            className="w-full accent-green-500"
          />
        </div>
      </div>

      <div className="flex gap-3">
        <button
          onClick={playing ? stop : speak}
          disabled={!text.trim()}
          className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-sm transition disabled:opacity-40 disabled:cursor-not-allowed ${
            playing
              ? "bg-red-500/20 border border-red-500/50 text-red-400 hover:bg-red-500/30"
              : "bg-green-500 text-black hover:opacity-90"
          }`}
        >
          {playing ? (
            <><Square className="size-4 fill-current" /> បញ្ឈប់</>
          ) : (
            <><Play className="size-4 fill-current" /> ស្ដាប់សំឡេង</>
          )}
        </button>
      </div>

      {playing && (
        <div className="flex items-center justify-center gap-3 py-3 rounded-xl bg-green-500/10 border border-green-500/20">
          <Volume2 className="size-5 text-green-400 animate-pulse" />
          <div className="flex gap-1 items-end h-5">
            {[1,2,3,4,5].map(i => (
              <div
                key={i}
                className="w-1 bg-green-400 rounded-full"
                style={{
                  height: `${40 + i * 12}%`,
                  animation: `wave-bar 0.8s ease-in-out infinite`,
                  animationDelay: `${i * 0.1}s`,
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
          50% { transform: scaleY(1); }
        }
      `}</style>
    </div>
  );
}
