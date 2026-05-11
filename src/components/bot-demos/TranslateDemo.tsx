import { useState } from "react";
import { Languages, ArrowRightLeft, Loader2, Copy, Check } from "lucide-react";

const LANGUAGES = [
  { code: "km", label: "ខ្មែរ" },
  { code: "en", label: "English" },
  { code: "zh", label: "中文" },
  { code: "ja", label: "日本語" },
  { code: "ko", label: "한국어" },
  { code: "fr", label: "Français" },
  { code: "th", label: "ไทย" },
  { code: "vi", label: "Tiếng Việt" },
];

export default function TranslateDemo() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [from, setFrom] = useState("km");
  const [to, setTo] = useState("en");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");

  async function translate() {
    if (!input.trim()) return;
    setLoading(true);
    setError("");
    setOutput("");
    try {
      const res = await fetch(
        `https://api.mymemory.translated.net/get?q=${encodeURIComponent(input)}&langpair=${from}|${to}`
      );
      const data = await res.json();
      if (data.responseStatus === 200) {
        setOutput(data.responseData.translatedText);
      } else {
        setError("មិនអាចបកប្រែបាន សូមព្យាយាមម្ដងទៀត");
      }
    } catch {
      setError("មានបញ្ហាបណ្ដាញ សូមព្យាយាមម្ដងទៀត");
    } finally {
      setLoading(false);
    }
  }

  function swap() {
    setFrom(to);
    setTo(from);
    setInput(output);
    setOutput(input);
  }

  function copy() {
    if (!output) return;
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <select
          value={from}
          onChange={e => setFrom(e.target.value)}
          className="flex-1 rounded-xl border border-border bg-secondary/50 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--cyan)]"
        >
          {LANGUAGES.map(l => (
            <option key={l.code} value={l.code}>{l.label}</option>
          ))}
        </select>

        <button
          onClick={swap}
          className="shrink-0 size-9 rounded-xl bg-secondary/60 border border-border flex items-center justify-center hover:bg-secondary transition-colors"
          title="ប្ដូរភាសា"
        >
          <ArrowRightLeft className="size-4 text-[var(--cyan)]" />
        </button>

        <select
          value={to}
          onChange={e => setTo(e.target.value)}
          className="flex-1 rounded-xl border border-border bg-secondary/50 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--cyan)]"
        >
          {LANGUAGES.map(l => (
            <option key={l.code} value={l.code}>{l.label}</option>
          ))}
        </select>
      </div>

      <textarea
        value={input}
        onChange={e => setInput(e.target.value)}
        onKeyDown={e => { if (e.key === "Enter" && e.ctrlKey) translate(); }}
        placeholder="វាយអត្ថបទដែលចង់បកប្រែ..."
        rows={4}
        className="w-full rounded-xl border border-border bg-secondary/30 px-4 py-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[var(--cyan)] placeholder:text-muted-foreground/60"
      />

      <button
        onClick={translate}
        disabled={loading || !input.trim()}
        className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-[var(--cyan)] text-black font-semibold text-sm hover:opacity-90 transition disabled:opacity-40 disabled:cursor-not-allowed"
      >
        {loading ? <Loader2 className="size-4 animate-spin" /> : <Languages className="size-4" />}
        {loading ? "កំពុងបកប្រែ..." : "បកប្រែ (Ctrl+Enter)"}
      </button>

      {error && (
        <p className="text-xs text-red-400 text-center">{error}</p>
      )}

      {output && (
        <div className="relative rounded-xl border border-[var(--cyan)]/30 bg-[var(--cyan)]/5 px-4 py-3">
          <p className="text-sm leading-relaxed pr-8">{output}</p>
          <button
            onClick={copy}
            className="absolute top-2 right-2 size-7 rounded-lg bg-secondary/60 flex items-center justify-center hover:bg-secondary transition-colors"
          >
            {copied ? <Check className="size-3.5 text-[var(--cyan)]" /> : <Copy className="size-3.5 text-muted-foreground" />}
          </button>
        </div>
      )}
    </div>
  );
}
