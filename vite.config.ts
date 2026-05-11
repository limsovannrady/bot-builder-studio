import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { TanStackRouterVite } from "@tanstack/router-plugin/vite";
import tsconfigPaths from "vite-tsconfig-paths";
import type { IncomingMessage, ServerResponse } from "http";

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
            const slow = params.get("slow") === "true" ? "true" : "false";

            if (!text.trim()) {
              res.statusCode = 400;
              res.end("Missing text");
              return;
            }

            const ttsUrl =
              `https://translate.google.com/translate_tts` +
              `?ie=UTF-8&q=${encodeURIComponent(text)}&tl=km&client=tw-ob&slow=${slow}`;

            const upstream = await fetch(ttsUrl, {
              headers: {
                "User-Agent":
                  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0 Safari/537.36",
                Referer: "https://translate.google.com/",
                Accept: "audio/mpeg,audio/*;q=0.9,*/*;q=0.5",
              },
            });

            if (!upstream.ok) {
              res.statusCode = upstream.status;
              res.end("TTS upstream error");
              return;
            }

            const buf = await upstream.arrayBuffer();
            res.setHeader("Content-Type", "audio/mpeg");
            res.setHeader("Access-Control-Allow-Origin", "*");
            res.setHeader("Cache-Control", "public, max-age=3600");
            res.end(Buffer.from(buf));
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
