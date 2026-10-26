/**
 * Netlify Serverless Function: /api/chat or /.netlify/functions/chat
 * Securely proxies chat completions to Google Gemini without exposing API keys to the browser.
 */

const GEMINI_MODELS = ["gemini-3.5-flash", "gemini-3.8-flash", "gemini-3.5-flash-lite"];

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
  "Content-Type": "application/json",
};

export async function handler(reqOrEvent: any, context?: any) {
  const isWebReq = reqOrEvent && typeof reqOrEvent.json === "function";
  const httpMethod = isWebReq ? reqOrEvent.method : reqOrEvent?.httpMethod;

  if (httpMethod === "OPTIONS") {
    if (isWebReq) {
      return new Response(null, { status: 204, headers: corsHeaders });
    }
    return { statusCode: 204, headers: corsHeaders, body: "" };
  }

  if (httpMethod !== "POST") {
    const errorBody = JSON.stringify({ error: "Method Not Allowed" });
    if (isWebReq) {
      return new Response(errorBody, { status: 405, headers: corsHeaders });
    }
    return { statusCode: 405, headers: corsHeaders, body: errorBody };
  }

  const apiKey = process.env.GEMINI_API_KEY || "";

  if (!apiKey) {
    const errorBody = JSON.stringify({ error: "Gemini API key is not configured on the server." });
    if (isWebReq) {
      return new Response(errorBody, { status: 500, headers: corsHeaders });
    }
    return { statusCode: 500, headers: corsHeaders, body: errorBody };
  }

  try {
    let bodyData: any;
    if (isWebReq) {
      bodyData = await reqOrEvent.json();
    } else {
      bodyData = typeof reqOrEvent?.body === "string" ? JSON.parse(reqOrEvent.body || "{}") : reqOrEvent?.body;
    }

    const { messages, systemPrompt } = (bodyData || {}) as {
      messages: { role: string; content: string }[];
      systemPrompt: string;
    };

    const sendRes = (status: number, data: any) => {
      const bodyStr = JSON.stringify(data);
      if (isWebReq) {
        return new Response(bodyStr, { status, headers: corsHeaders });
      }
      return { statusCode: status, headers: corsHeaders, body: bodyStr };
    };

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return sendRes(400, { error: "No messages payload provided." });
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
      } catch (err: any) {
        lastError = err?.message || String(err);
      }
    }

    return sendRes(502, { error: `All Gemini models failed. Last error: ${lastError}` });
  } catch (err: any) {
    const errorBody = { error: err?.message || "Internal server error" };
    if (isWebReq) {
      return new Response(JSON.stringify(errorBody), { status: 500, headers: corsHeaders });
    }
    return { statusCode: 500, headers: corsHeaders, body: JSON.stringify(errorBody) };
  }
}

export default handler;

