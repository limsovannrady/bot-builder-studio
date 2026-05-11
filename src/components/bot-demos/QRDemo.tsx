import { useState, useRef } from "react";
import { QrCode, ScanLine, Download, Upload, Loader2 } from "lucide-react";
import jsQR from "jsqr";

type Tab = "generate" | "scan";

export default function QRDemo() {
  const [tab, setTab] = useState<Tab>("generate");
  const [qrText, setQrText] = useState("");
  const [qrUrl, setQrUrl] = useState("");
  const [scanResult, setScanResult] = useState("");
  const [scanError, setScanError] = useState("");
  const [scanLoading, setScanLoading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  function generateQR() {
    if (!qrText.trim()) return;
    const url = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(qrText)}&margin=10&color=000000&bgcolor=ffffff`;
    setQrUrl(url);
  }

  function downloadQR() {
    if (!qrUrl) return;
    const a = document.createElement("a");
    a.href = qrUrl;
    a.download = "qrcode.png";
    a.target = "_blank";
    a.click();
  }

  function handleScanFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setScanResult("");
    setScanError("");
    setScanLoading(true);

    const img = new Image();
    const reader = new FileReader();
    reader.onload = ev => {
      img.src = ev.target?.result as string;
      img.onload = () => {
        const canvas = canvasRef.current!;
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d")!;
        ctx.drawImage(img, 0, 0);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const code = jsQR(imageData.data, imageData.width, imageData.height);
        setScanLoading(false);
        if (code) {
          setScanResult(code.data);
        } else {
          setScanError("រកមិនឃើញ QR Code នៅក្នុងរូបភាពនេះ");
        }
      };
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex rounded-xl border border-border overflow-hidden">
        <button
          onClick={() => setTab("generate")}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-medium transition-colors ${
            tab === "generate" ? "bg-[var(--orange)] text-black" : "bg-secondary/40 text-muted-foreground hover:text-foreground"
          }`}
        >
          <QrCode className="size-4" /> បង្កើត QR
        </button>
        <button
          onClick={() => setTab("scan")}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-medium transition-colors ${
            tab === "scan" ? "bg-[var(--orange)] text-black" : "bg-secondary/40 text-muted-foreground hover:text-foreground"
          }`}
        >
          <ScanLine className="size-4" /> Scan QR
        </button>
      </div>

      {tab === "generate" && (
        <div className="flex flex-col gap-3">
          <textarea
            value={qrText}
            onChange={e => setQrText(e.target.value)}
            placeholder="វាយ URL ឬអត្ថបទ... (https://example.com)"
            rows={3}
            className="w-full rounded-xl border border-border bg-secondary/30 px-4 py-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[var(--orange)] placeholder:text-muted-foreground/60"
          />
          <button
            onClick={generateQR}
            disabled={!qrText.trim()}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-[var(--orange)] text-black font-semibold text-sm hover:opacity-90 transition disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <QrCode className="size-4" /> បង្កើត QR Code
          </button>

          {qrUrl && (
            <div className="flex flex-col items-center gap-3 p-4 rounded-xl border border-[var(--orange)]/30 bg-[var(--orange)]/5">
              <img src={qrUrl} alt="QR Code" className="size-48 rounded-xl shadow-md" />
              <button
                onClick={downloadQR}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-secondary/60 border border-border text-sm font-medium hover:bg-secondary transition-colors"
              >
                <Download className="size-4" /> ទាញយក QR Code
              </button>
            </div>
          )}
        </div>
      )}

      {tab === "scan" && (
        <div className="flex flex-col gap-3">
          <button
            onClick={() => fileRef.current?.click()}
            className="w-full flex flex-col items-center gap-3 py-8 rounded-xl border-2 border-dashed border-[var(--orange)]/40 hover:border-[var(--orange)]/70 hover:bg-[var(--orange)]/5 transition-colors cursor-pointer"
          >
            {scanLoading ? (
              <Loader2 className="size-8 animate-spin text-[var(--orange)]" />
            ) : (
              <Upload className="size-8 text-[var(--orange)]" />
            )}
            <span className="text-sm text-muted-foreground">
              {scanLoading ? "កំពុង Scan..." : "ចុចដើម្បីបើករូបភាព QR Code"}
            </span>
          </button>
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleScanFile} />
          <canvas ref={canvasRef} className="hidden" />

          {scanResult && (
            <div className="rounded-xl border border-[var(--orange)]/30 bg-[var(--orange)]/5 px-4 py-3">
              <p className="text-xs text-muted-foreground mb-1">លទ្ធផល:</p>
              <p className="text-sm font-medium break-all">
                {scanResult.startsWith("http") ? (
                  <a href={scanResult} target="_blank" rel="noreferrer" className="text-[var(--orange)] underline underline-offset-2">
                    {scanResult}
                  </a>
                ) : scanResult}
              </p>
            </div>
          )}
          {scanError && (
            <p className="text-xs text-red-400 text-center">{scanError}</p>
          )}
        </div>
      )}
    </div>
  );
}
