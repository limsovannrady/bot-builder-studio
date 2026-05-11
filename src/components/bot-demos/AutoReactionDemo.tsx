import { useState, useEffect } from "react";
import { Smile, Zap } from "lucide-react";

const EMOJI_GROUPS = [
  { label: "ពេញចិត្ត", emojis: ["❤️", "🔥", "👍", "🥰", "😍", "💯", "✨", "🎉"] },
  { label: "អារម្មណ៍", emojis: ["😂", "😭", "😮", "😡", "🤩", "🥺", "😎", "🤔"] },
  { label: "ផ្សេងៗ", emojis: ["👏", "🙌", "💪", "🎊", "🌟", "💥", "🚀", "🎯"] },
];

interface FloatingEmoji {
  id: number;
  emoji: string;
  x: number;
  size: number;
}

export default function AutoReactionDemo() {
  const [message, setMessage] = useState("សាកល្បងប្រើ Auto Reaction! 🎉");
  const [selected, setSelected] = useState<string[]>([]);
  const [floating, setFloating] = useState<FloatingEmoji[]>([]);
  const [reactions, setReactions] = useState<Record<string, number>>({});
  const [counter, setCounter] = useState(0);

  useEffect(() => {
    if (floating.length === 0) return;
    const t = setTimeout(() => {
      setFloating(f => f.slice(1));
    }, 1200);
    return () => clearTimeout(t);
  }, [floating]);

  function toggleEmoji(e: string) {
    setSelected(s =>
      s.includes(e) ? s.filter(x => x !== e) : [...s, e]
    );
  }

  function autoReact() {
    if (selected.length === 0) return;
    const newReactions = { ...reactions };
    selected.forEach(e => {
      newReactions[e] = (newReactions[e] || 0) + 1;
    });
    setReactions(newReactions);

    const newFloating: FloatingEmoji[] = selected.flatMap((emoji, i) =>
      Array.from({ length: 3 }, (_, j) => ({
        id: counter + i * 3 + j,
        emoji,
        x: 10 + Math.random() * 80,
        size: 1.2 + Math.random() * 1.2,
      }))
    );
    setCounter(c => c + newFloating.length);
    setFloating(f => [...f, ...newFloating]);
  }

  function clearAll() {
    setReactions({});
    setSelected([]);
    setFloating([]);
  }

  return (
    <div className="flex flex-col gap-4">
      <div>
        <label className="text-xs text-muted-foreground mb-1.5 block">សារ / Message</label>
        <textarea
          value={message}
          onChange={e => setMessage(e.target.value)}
          rows={2}
          className="w-full rounded-xl border border-border bg-secondary/30 px-4 py-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary placeholder:text-muted-foreground/60"
        />
      </div>

      <div>
        <label className="text-xs text-muted-foreground mb-2 block">ជ្រើសរើស Emoji Reaction</label>
        {EMOJI_GROUPS.map(g => (
          <div key={g.label} className="mb-2">
            <p className="text-[10px] text-muted-foreground/60 mb-1">{g.label}</p>
            <div className="flex flex-wrap gap-2">
              {g.emojis.map(e => (
                <button
                  key={e}
                  onClick={() => toggleEmoji(e)}
                  className={`size-10 rounded-xl text-xl flex items-center justify-center transition-all ${
                    selected.includes(e)
                      ? "bg-primary/20 border-2 border-primary scale-110 shadow-md"
                      : "bg-secondary/40 border border-border hover:bg-secondary hover:scale-105"
                  }`}
                >
                  {e}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={autoReact}
        disabled={selected.length === 0}
        className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gradient-to-r from-primary to-[var(--cyan)] text-white font-semibold text-sm hover:opacity-90 transition disabled:opacity-40 disabled:cursor-not-allowed"
      >
        <Zap className="size-4" /> Auto React ({selected.length} emoji)
      </button>

      {(message || Object.keys(reactions).length > 0) && (
        <div className="relative rounded-xl border border-primary/20 bg-primary/5 p-4 overflow-hidden min-h-[80px]">
          {floating.map(f => (
            <span
              key={f.id}
              className="absolute animate-float-up pointer-events-none select-none"
              style={{
                left: `${f.x}%`,
                bottom: 0,
                fontSize: `${f.size}rem`,
                animationDuration: "1.2s",
                animationFillMode: "forwards",
              }}
            >
              {f.emoji}
            </span>
          ))}

          <p className="text-sm mb-3 relative z-10">{message}</p>

          {Object.keys(reactions).length > 0 && (
            <div className="flex flex-wrap gap-2 relative z-10">
              {Object.entries(reactions).map(([e, count]) => (
                <button
                  key={e}
                  onClick={() => {
                    const updated = { ...reactions, [e]: (reactions[e] || 0) + 1 };
                    setReactions(updated);
                    setFloating(f => [...f, { id: counter, emoji: e, x: 10 + Math.random() * 80, size: 1.5 }]);
                    setCounter(c => c + 1);
                  }}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-secondary/60 border border-border text-sm hover:bg-secondary hover:scale-105 transition-transform"
                >
                  {e} <span className="text-xs font-medium">{count}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {Object.keys(reactions).length > 0 && (
        <button
          onClick={clearAll}
          className="w-full py-2 rounded-xl border border-border text-xs text-muted-foreground hover:text-foreground hover:bg-secondary/40 transition-colors"
        >
          សម្អាត
        </button>
      )}

      <style>{`
        @keyframes float-up {
          0%   { transform: translateY(0) scale(1); opacity: 1; }
          80%  { opacity: 0.8; }
          100% { transform: translateY(-120px) scale(0.5); opacity: 0; }
        }
        .animate-float-up { animation: float-up 1.2s ease-out forwards; }
      `}</style>
    </div>
  );
}
