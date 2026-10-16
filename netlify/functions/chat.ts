/**
 * Netlify Serverless Function: /api/chat or /.netlify/functions/chat
 * Securely proxies chat completions to Google Gemini without exposing API keys to the browser.
 */

const GEMINI_MODELS = ["gemini-3.5-flash", "gemini-3.8-flash", "gemini-3.5-flash-lite"];

export default async function handler(req: Request): Promise<Response> {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      },
    });
  }

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method Not Allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json" },
    });
  }

  const apiKey =
    process.env.GEMINI_API_KEY ||
    process.env.VITE_GEMINI_API_KEY ||
    "";

  if (!apiKey) {
    return new Response(
      JSON.stringify({ error: "Gemini API key is not configured on the server." }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }

  try {
    const { messages, systemPrompt } = (await req.json()) as {
      messages: { role: string; content: string }[];
      systemPrompt: string;
    };

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return new Response(
        JSON.stringify({ error: "Invalid messages payload." }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Prepare contents in Gemini format
    const contents: { role: "user" | "model"; parts: { text: string }[] }[] = [];
    for (const msg of messages) {
      if (msg.role !== "user" && msg.role !== "assistant") continue;
      const role = msg.role === "assistant" ? "model" : "user";
      const text = (msg.content || "").trim();
      if (!text) continue;

      if (contents.length > 0 && contents[contents.length - 1].role === role) {
        contents[contents.length - 1].parts[0].text += `\n\n${text}`;
      } else {
        contents.push({ role, parts: [{ text }] });
      }
    }

    // Ensure first message has role: user
    while (contents.length > 0 && contents[0].role === "model") {
      contents.shift();
    }

    if (contents.length === 0) {
      return new Response(
        JSON.stringify({ error: "No user message found in conversation." }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    let lastError = "";
    for (const model of GEMINI_MODELS) {
      try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
        const geminiRes = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            systemInstruction: systemPrompt ? { parts: [{ text: systemPrompt }] } : undefined,
            contents,
            generationConfig: {
              temperature: 0.6,
              maxOutputTokens: 1500,
            },
          }),
        });

        if (geminiRes.ok) {
          const data = await geminiRes.json();
          const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
          if (text && text.trim().length > 0) {
            return new Response(
              JSON.stringify({ success: true, answer: text.trim(), model }),
              {
                status: 200,
                headers: {
                  "Content-Type": "application/json",
                  "Access-Control-Allow-Origin": "*",
                },
              }
            );
          }
        } else {
          const errData = await geminiRes.json().catch(() => ({}));
          lastError = errData?.error?.message || `HTTP ${geminiRes.status}`;
        }
      } catch (err: any) {
        lastError = err?.message || String(err);
      }
    }

    return new Response(
      JSON.stringify({ error: `All Gemini models failed. Last error: ${lastError}` }),
      { status: 502, headers: { "Content-Type": "application/json" } }
    );
  } catch (err: any) {
    return new Response(
      JSON.stringify({ error: err?.message || "Internal server error" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
