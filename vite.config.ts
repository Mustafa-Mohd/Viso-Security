import { defineConfig, loadEnv, Plugin } from "vite";
import react from "@vitejs/plugin-react";
import { TanStackRouterVite } from "@tanstack/router-plugin/vite";
import tailwindcss from "@tailwindcss/vite";
import tsconfigPaths from "vite-tsconfig-paths";
import { handleEmailDispatch } from "./server/emailService";

const GEMINI_MODELS = ["gemini-3.5-flash", "gemini-3.8-flash", "gemini-3.5-flash-lite"];

/**
 * Vite Dev Server plugin providing local /api/chat endpoint
 * Securely proxies chat completions to Google Gemini during local development
 */
function visoChatDevPlugin(apiKey: string): Plugin {
  return {
    name: "viso-chat-dev-api",
    configureServer(server) {
      server.middlewares.use("/api/chat", async (req, res, next) => {
        if (req.method !== "POST") {
          return next();
        }

        const handlePayload = async (parsed: any) => {
          res.setHeader("Content-Type", "application/json");

          if (!apiKey) {
            res.statusCode = 500;
            res.end(JSON.stringify({ error: "Gemini API key is not configured on the server." }));
            return;
          }

          try {
            const { messages, systemPrompt } = parsed || {};

            if (!messages || !Array.isArray(messages) || messages.length === 0) {
              res.statusCode = 400;
              res.end(JSON.stringify({ error: "Invalid messages payload." }));
              return;
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
              res.statusCode = 400;
              res.end(JSON.stringify({ error: "No user message in conversation." }));
              return;
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
                  const data = (await geminiRes.json()) as any;
                  const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
                  if (text && text.trim().length > 0) {
                    res.statusCode = 200;
                    res.end(JSON.stringify({ success: true, answer: text.trim(), model }));
                    return;
                  }
                } else {
                  const errJson = (await geminiRes.json().catch(() => ({}))) as any;
                  lastError = errJson?.error?.message || `HTTP ${geminiRes.status}`;
                }
              } catch (err: any) {
                lastError = err?.message || String(err);
              }
            }

            res.statusCode = 502;
            res.end(JSON.stringify({ error: `All Gemini models failed: ${lastError}` }));
          } catch (err: any) {
            res.statusCode = 500;
            res.end(JSON.stringify({ error: err?.message || "Server parse error" }));
          }
        };

        if ((req as any).body && typeof (req as any).body === "object") {
          handlePayload((req as any).body);
          return;
        }

        let rawBody = "";
        req.on("data", (chunk) => {
          rawBody += chunk;
        });

        req.on("end", () => {
          try {
            const parsed = JSON.parse(rawBody || "{}");
            handlePayload(parsed);
          } catch {
            res.statusCode = 400;
            res.end(JSON.stringify({ error: "Malformed JSON body." }));
          }
        });

        req.on("error", (err) => {
          if (!res.writableEnded) {
            res.statusCode = 500;
            res.end(JSON.stringify({ error: err.message }));
          }
        });
      });
    },
  };
}

function visoEmailDevPlugin(emailConfig: {
  apiKey?: string;
  fromEmail?: string;
  adminEmail?: string;
  hrEmail?: string;
}): Plugin {
  return {
    name: "viso-email-dev-api",
    configureServer(server) {
      server.middlewares.use("/api/send-email", async (req, res, next) => {
        if (req.method !== "POST") {
          return next();
        }

        const handlePayload = async (payload: any) => {
          res.setHeader("Content-Type", "application/json");

          try {
            const result = await handleEmailDispatch(payload, emailConfig);
            res.statusCode = result.success ? 200 : result.error?.includes("RESEND_API_KEY") ? 503 : 500;
            res.end(JSON.stringify(result));
          } catch (err: any) {
            res.statusCode = 500;
            res.end(JSON.stringify({ success: false, error: err?.message || "Internal error dispatching email" }));
          }
        };

        if ((req as any).body && typeof (req as any).body === "object") {
          handlePayload((req as any).body);
          return;
        }

        let rawBody = "";
        req.on("data", (chunk) => {
          rawBody += chunk;
        });

        req.on("end", () => {
          try {
            const parsed = JSON.parse(rawBody || "{}");
            handlePayload(parsed);
          } catch {
            res.statusCode = 400;
            res.end(JSON.stringify({ error: "Malformed JSON body." }));
          }
        });

        req.on("error", (err) => {
          if (!res.writableEnded) {
            res.statusCode = 500;
            res.end(JSON.stringify({ error: err.message }));
          }
        });
      });
    },
  };
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const apiKey = env.GEMINI_API_KEY || env.VITE_GEMINI_API_KEY || "";
  const resendApiKey = env.RESEND_API_KEY || env.VITE_RESEND_API_KEY || "";
  const resendFromEmail = env.RESEND_FROM_EMAIL || env.VITE_RESEND_FROM_EMAIL || "";
  const adminEmail = env.ADMIN_NOTIFICATION_EMAIL || env.ADMIN_EMAIL || env.VITE_ADMIN_EMAIL || "";
  const hrEmail = env.HR_NOTIFICATION_EMAIL || env.HR_EMAIL || env.VITE_HR_EMAIL || "";

  return {
    plugins: [
      TanStackRouterVite({ autoCodeSplitting: true }),
      react(),
      tailwindcss(),
      tsconfigPaths(),
      visoChatDevPlugin(apiKey),
      visoEmailDevPlugin({
        apiKey: resendApiKey,
        fromEmail: resendFromEmail,
        adminEmail,
        hrEmail,
      }),
    ],
    resolve: {
      alias: {
        "@": "/src",
      },
    },
    server: {
      proxy: {
        "/api/sambanova": {
          target: "https://api.sambanova.ai",
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api\/sambanova/, ""),
        },
        "/api/gemini": {
          target: "https://generativelanguage.googleapis.com",
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api\/gemini/, ""),
        },
      },
    },
  };
});
