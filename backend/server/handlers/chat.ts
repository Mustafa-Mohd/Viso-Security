/**
 * POST /api/chat — proxies chat completions to Google Gemini (server-side API key).
 */

const GEMINI_MODELS = ["gemini-3.5-flash", "gemini-3.8-flash", "gemini-3.5-flash-lite"];

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
  "Content-Type": "application/json",
};

export async function handler(req: Request): Promise<Response> {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method Not Allowed" }), {
      status: 405,
      headers: corsHeaders,
    });
  }

  const apiKey = process.env.GEMINI_API_KEY || "";

  if (!apiKey) {
    return new Response(JSON.stringify({ error: "Gemini API key is not configured on the server." }), {
      status: 500,
      headers: corsHeaders,
    });
  }

  try {
    const bodyData = await req.json();
    const { messages, systemPrompt } = (bodyData || {}) as {
      messages: { role: string; content: string }[];
      systemPrompt: string;
    };

    const sendRes = (status: number, data: unknown) =>
      new Response(JSON.stringify(data), { status, headers: corsHeaders });

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return sendRes(400, { error: "No messages payload provided." });
    }

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

    while (contents.length > 0 && contents[0].role === "model") {
      contents.shift();
    }

    if (contents.length === 0) {
      return sendRes(400, { error: "No user message found in conversation." });
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
            return sendRes(200, { success: true, answer: text.trim(), model });
          }
        } else {
          const errData = await geminiRes.json().catch(() => ({}));
          lastError = errData?.error?.message || `HTTP ${geminiRes.status}`;
        }
      } catch (err: unknown) {
        lastError = err instanceof Error ? err.message : String(err);
      }
    }

    return sendRes(502, { error: `All Gemini models failed. Last error: ${lastError}` });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal server error";
    return new Response(JSON.stringify({ error: message }), { status: 500, headers: corsHeaders });
  }
}
