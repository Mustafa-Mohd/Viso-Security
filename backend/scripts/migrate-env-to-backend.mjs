import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const rootEnvPath = path.join(repoRoot, ".env");
const backendEnvPath = path.join(repoRoot, "backend", ".env");

if (!fs.existsSync(rootEnvPath)) {
  console.log("No root .env to migrate.");
  process.exit(0);
}

const lines = fs.readFileSync(rootEnvPath, "utf8").split(/\r?\n/);

function get(name) {
  const re = new RegExp(`^${name}=(.*)$`);
  for (const line of lines) {
    const m = line.match(re);
    if (m) return m[1].replace(/^["']|["']$/g, "").trim();
  }
  return "";
}

const gemini = get("GEMINI_API_KEY") || get("VITE_GEMINI_API_KEY");
const backend = [
  "# Local server secrets — do not commit",
  `GEMINI_API_KEY=${JSON.stringify(gemini)}`,
  `GEMINI_MODEL=${JSON.stringify(get("GEMINI_MODEL") || "gemini-1.5-flash")}`,
  `RESEND_API_KEY=${JSON.stringify(get("RESEND_API_KEY"))}`,
  `RESEND_FROM_EMAIL=${JSON.stringify(get("RESEND_FROM_EMAIL"))}`,
  `ADMIN_NOTIFICATION_EMAIL=${JSON.stringify(get("ADMIN_NOTIFICATION_EMAIL"))}`,
  `HR_NOTIFICATION_EMAIL=${JSON.stringify(get("HR_NOTIFICATION_EMAIL"))}`,
  `OPENAI_API_KEY=${JSON.stringify(get("OPENAI_API_KEY") || get("VITE_OPENAI_API_KEY"))}`,
  `SAMBANOVA_API_KEY=${JSON.stringify(get("SAMBANOVA_API_KEY") || get("VITE_SAMBANOVA_API_KEY"))}`,
  `GOOGLE_MAPS_API_KEY=${JSON.stringify(get("GOOGLE_MAPS_API_KEY") || get("VITE_GOOGLE_MAPS_API_KEY"))}`,
].join("\n");

fs.writeFileSync(backendEnvPath, `${backend}\n`);

const keep = new Set([
  "VITE_SUPABASE_URL",
  "VITE_SUPABASE_ANON_KEY",
  "VITE_CLOUDINARY_CLOUD_NAME",
  "VITE_CLOUDINARY_UPLOAD_PRESET",
  "VITE_ADMIN_APP_URL",
]);
const out = [];
for (const line of lines) {
  if (!line.trim() || line.trim().startsWith("#")) continue;
  const key = line.split("=")[0];
  if (keep.has(key)) out.push(line);
}
fs.writeFileSync(rootEnvPath, `${out.join("\n")}\n`);
console.log("Wrote backend/.env and trimmed root .env to VITE_* only.");
