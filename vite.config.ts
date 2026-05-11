import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { TanStackRouterVite } from "@tanstack/router-plugin/vite";
import tsconfigPaths from "vite-tsconfig-paths";
import WebSocket from "ws";
import type { IncomingMessage, ServerResponse } from "http";

const TRUSTED_TOKEN = "6A5AA1D4EAFF4E9FB37E23D68491D6F4";
const EDGE_WSS = `wss://speech.platform.bing.com/consumer/speech/synthesize/readaloud/edge/v1?TrustedClientToken=${TRUSTED_TOKEN}`;

function makeId(): string {
  return Array.from(
    { length: 16 },
    () => Math.floor(Math.random() * 256).toString(16).padStart(2, "0"),
  ).join("");
}

function escXml(s: string): string {
  return s.replace(/[<>&'"]/g, (c) =>
    ({ "<": "&lt;", ">": "&gt;", "&": "&amp;", "'": "&apos;", '"': "&quot;" }[c]!),
  );
}

function buildSSML(text: string, voice: string): string {
  return (
    `<speak version='1.0' xmlns='http://www.w3.org/2001/10/synthesis' xml:lang='km-KH'>` +
    `<voice name='${voice}'>${escXml(text)}</voice></speak>`
  );
}

function synthesizeEdge(text: string, voice: string): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const id = makeId();
    const ws = new WebSocket(`${EDGE_WSS}&ConnectionId=${id}`);
    const chunks: Buffer[] = [];
    const timer = setTimeout(() => {
      ws.terminate();
      reject(new Error("Edge TTS timeout"));
    }, 20000);

    ws.on("open", () => {
      const ts = new Date().toISOString();
      ws.send(
        `X-Timestamp:${ts}\r\nContent-Type:application/json; charset=utf-8\r\nPath:speech.config\r\n\r\n` +
        `{"context":{"synthesis":{"audio":{"metadataoptions":{"sentenceBoundaryEnabled":"false","wordBoundaryEnabled":"false"},"outputFormat":"audio-24khz-48kbitrate-mono-mp3"}}}}`,
      );
      ws.send(
        `X-RequestId:${id}\r\nContent-Type:application/ssml+xml\r\nX-Timestamp:${new Date().toISOString()}\r\nPath:ssml\r\n\r\n${buildSSML(text, voice)}`,
      );
    });

    ws.on("message", (data: Buffer | string, isBinary: boolean) => {
      if (isBinary && Buffer.isBuffer(data)) {
        const headerLen = data.readUInt16BE(0);
        const header = data.slice(2, 2 + headerLen).toString();
        if (header.includes("Path:audio")) {
          chunks.push(data.slice(2 + headerLen));
        }
      } else if (typeof data === "string" && data.includes("Path:turn.end")) {
        clearTimeout(timer);
        ws.close();
        resolve(Buffer.concat(chunks));
      }
    });

    ws.on("error", (err) => {
      clearTimeout(timer);
      reject(err);
    });
  });
}

function ttsProxy(): Plugin {
  return {
    name: "tts-proxy",
    configureServer(server) {
      server.middlewares.use(
        "/api/tts",
        async (req: IncomingMessage, res: ServerResponse) => {
          try {
            const qs = req.url?.split("?")[1] ?? "";
            const params = new URLSearchParams(qs);
            const text = params.get("text") ?? "";
            const voice = params.get("voice") ?? "km-KH-PisethNeural";

            if (!text.trim()) {
              res.statusCode = 400;
              res.end("Missing text");
              return;
            }

            const audio = await synthesizeEdge(text, voice);
            res.setHeader("Content-Type", "audio/mpeg");
            res.setHeader("Access-Control-Allow-Origin", "*");
            res.setHeader("Cache-Control", "public, max-age=3600");
            res.end(audio);
          } catch (err) {
            res.statusCode = 500;
            res.end("TTS proxy error: " + (err as Error).message);
          }
        },
      );
    },
  };
}

export default defineConfig({
  plugins: [
    TanStackRouterVite({ target: "react", autoCodeSplitting: true }),
    react(),
    tailwindcss(),
    tsconfigPaths(),
    ttsProxy(),
  ],
  server: {
    host: "0.0.0.0",
    port: 5000,
    strictPort: true,
    allowedHosts: true,
  },
  build: {
    outDir: "dist",
  },
});
