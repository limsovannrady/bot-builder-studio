const TRUSTED_TOKEN = "6A5AA1D4EAFF4E9FB37E23D68491D6F4";
const EDGE_WSS = `wss://speech.platform.bing.com/consumer/speech/synthesize/readaloud/edge/v1?TrustedClientToken=${TRUSTED_TOKEN}`;

function makeId() {
  const buf = new Uint8Array(16);
  crypto.getRandomValues(buf);
  return Array.from(buf).map((b) => b.toString(16).padStart(2, "0")).join("");
}

function escXml(s) {
  return s.replace(
    /[<>&'"]/g,
    (c) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;", "'": "&apos;", '"': "&quot;" }[c]),
  );
}

function buildSSML(text, voice) {
  return (
    `<speak version='1.0' xmlns='http://www.w3.org/2001/10/synthesis' xml:lang='km-KH'>` +
    `<voice name='${voice}'>${escXml(text)}</voice></speak>`
  );
}

function synthesize(text, voice) {
  return new Promise((resolve, reject) => {
    const id = makeId();
    const ws = new WebSocket(`${EDGE_WSS}&ConnectionId=${id}`);
    const chunks = [];
    const timer = setTimeout(() => {
      try { ws.close(); } catch {}
      reject(new Error("timeout"));
    }, 20000);

    ws.addEventListener("open", () => {
      const ts = new Date().toISOString();
      ws.send(
        `X-Timestamp:${ts}\r\nContent-Type:application/json; charset=utf-8\r\nPath:speech.config\r\n\r\n` +
        `{"context":{"synthesis":{"audio":{"metadataoptions":{"sentenceBoundaryEnabled":"false","wordBoundaryEnabled":"false"},"outputFormat":"audio-24khz-48kbitrate-mono-mp3"}}}}`,
      );
      ws.send(
        `X-RequestId:${id}\r\nContent-Type:application/ssml+xml\r\nX-Timestamp:${new Date().toISOString()}\r\nPath:ssml\r\n\r\n${buildSSML(text, voice)}`,
      );
    });

    ws.addEventListener("message", (event) => {
      if (event.data instanceof ArrayBuffer) {
        const view = new DataView(event.data);
        const headerLen = view.getUint16(0);
        const header = new TextDecoder().decode(new Uint8Array(event.data, 2, headerLen));
        if (header.includes("Path:audio")) {
          chunks.push(new Uint8Array(event.data, 2 + headerLen));
        }
      } else if (typeof event.data === "string" && event.data.includes("Path:turn.end")) {
        clearTimeout(timer);
        ws.close();
        const total = chunks.reduce((s, c) => s + c.length, 0);
        const out = new Uint8Array(total);
        let off = 0;
        for (const c of chunks) { out.set(c, off); off += c.length; }
        resolve(out.buffer);
      }
    });

    ws.addEventListener("error", (e) => {
      clearTimeout(timer);
      reject(e);
    });
  });
}

export async function onRequest(context) {
  const url = new URL(context.request.url);
  const text = url.searchParams.get("text") ?? "";
  const voice = url.searchParams.get("voice") ?? "km-KH-PisethNeural";

  if (!text.trim()) return new Response("Missing text", { status: 400 });

  try {
    const audio = await synthesize(text, voice);
    return new Response(audio, {
      headers: {
        "Content-Type": "audio/mpeg",
        "Access-Control-Allow-Origin": "*",
        "Cache-Control": "public, max-age=3600",
      },
    });
  } catch (e) {
    return new Response("TTS error: " + e.message, { status: 500 });
  }
}
