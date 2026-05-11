export async function onRequest(context) {
  const url = new URL(context.request.url);
  const text = url.searchParams.get("text") ?? "";
  const lang = url.searchParams.get("lang") ?? "en";
  const slow = url.searchParams.get("slow") === "true" ? "true" : "false";

  if (!text.trim()) {
    return new Response("Missing text", { status: 400 });
  }

  const ttsUrl =
    `https://translate.google.com/translate_tts` +
    `?ie=UTF-8&q=${encodeURIComponent(text)}&tl=${lang}&client=tw-ob&slow=${slow}`;

  try {
    const upstream = await fetch(ttsUrl, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0 Safari/537.36",
        Referer: "https://translate.google.com/",
        Accept: "audio/mpeg,audio/*;q=0.9,*/*;q=0.5",
      },
    });

    if (!upstream.ok) {
      return new Response("TTS upstream error", { status: upstream.status });
    }

    const audio = await upstream.arrayBuffer();

    return new Response(audio, {
      headers: {
        "Content-Type": "audio/mpeg",
        "Access-Control-Allow-Origin": "*",
        "Cache-Control": "public, max-age=3600",
      },
    });
  } catch {
    return new Response("TTS proxy error", { status: 500 });
  }
}
