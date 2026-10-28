import http from "node:http";
import { handler as chatHandler } from "../server/handlers/chat";
import { handler as emailHandler } from "../server/handlers/send-email";

const PORT = Number(process.env.BACKEND_DEV_PORT || 8787);

function readBody(req: http.IncomingMessage): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    req.on("data", (chunk) => chunks.push(Buffer.from(chunk)));
    req.on("end", () => resolve(Buffer.concat(chunks)));
    req.on("error", reject);
  });
}

function toWebRequest(req: http.IncomingMessage, body: Buffer, port: number): Request {
  const path = req.url?.split("?")[0] ?? "/";
  const url = `http://127.0.0.1:${port}${path}`;
  const hasBody = req.method !== "GET" && req.method !== "HEAD" && body.length > 0;
  return new Request(url, {
    method: req.method,
    headers: req.headers as HeadersInit,
    body: hasBody ? new Uint8Array(body) : undefined,
  });
}

async function writeWebResponse(res: http.ServerResponse, response: Response) {
  const headers: Record<string, string> = {};
  response.headers.forEach((value, key) => {
    headers[key] = value;
  });
  res.writeHead(response.status, headers);
  res.end(Buffer.from(await response.arrayBuffer()));
}

const server = http.createServer(async (req, res) => {
  const path = req.url?.split("?")[0] ?? "";

  if (path !== "/api/chat" && path !== "/api/send-email") {
    res.writeHead(404, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "Not found. Try POST /api/chat or /api/send-email" }));
    return;
  }

  try {
    const body = await readBody(req);
    const webReq = toWebRequest(req, body, PORT);
    const response =
      path === "/api/chat"
        ? await chatHandler(webReq)
        : await emailHandler(webReq);
    await writeWebResponse(res, response);
  } catch (err) {
    console.error(err);
    res.writeHead(500, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "Internal server error" }));
  }
});

server.listen(PORT, () => {
  console.log(`@viso/backend dev API listening on http://localhost:${PORT}`);
  console.log("  POST /api/chat");
  console.log("  POST /api/send-email");
  console.log("(Loads env from backend/.env — see backend/package.json)");
});
