import fs from "fs";
import path from "path";
import https from "https";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..", "public", "images");

/** Verified Unsplash photo IDs (200 OK with ixlib=rb-4.0.3) */
const PHOTOS = [
  "photo-1486406146926-c627a92ad1ab",
  "photo-1497366216548-37526070297c",
  "photo-1557804506-669a67965ba0",
  "photo-1504384308090-c894fdcc538d",
  "photo-1431576901776-e539bd916ba2",
  "photo-1473186578172-c141e6798cf4",
  "photo-1503387762-592deb58ef4e",
  "photo-1552664730-d307ca884978",
  "photo-1542744173-8e7e53415bb0",
  "photo-1522071820081-009f0129c71c",
];

function unsplash(id, w = 1400) {
  return `https://images.unsplash.com/${id}?ixlib=rb-4.0.3&auto=format&fit=crop&w=${w}&q=80`;
}

const exploreSlugs = [
  "risk-assessment",
  "preliminary-design",
  "detailed-design",
  "operational-readiness",
  "sais-compliance",
  "physical-security",
  "project-management",
  "security-philosophy",
  "owners-engineer",
  "construction-monitoring",
  "concept-of-design",
  "threat-analysis",
  "system-architecture",
  "access-control",
  "cctv-coverage",
  "fat-sat",
  "regulatory-coordination",
  "technical-oversight",
  "site-supervision",
  "handover-support",
];

const galleryFiles = [
  "gallery-assessment-1",
  "gallery-assessment-2",
  "gallery-design-1",
  "gallery-design-2",
  "gallery-delivery-1",
  "gallery-delivery-2",
  "gallery-compliance-1",
  "gallery-compliance-2",
  "gallery-systems-1",
  "gallery-systems-2",
];

const regulatoryFiles = [
  ["regulatory/hub-banner.jpg", 1600],
  ["regulatory/moi-card.jpg", 900],
  ["regulatory/moi-hero.jpg", 1600],
  ["regulatory/moi-secondary.jpg", 1200],
  ["regulatory/sais-card.jpg", 900],
  ["regulatory/sais-hero.jpg", 1600],
  ["regulatory/sais-secondary.jpg", 1200],
  ["regulatory/hcis-card.jpg", 900],
  ["regulatory/hcis-hero.jpg", 1600],
  ["regulatory/hcis-secondary.jpg", 1200],
];

const downloads = [];
let i = 0;
for (const slug of exploreSlugs) {
  downloads.push([`explore/${slug}-hero.jpg`, unsplash(PHOTOS[i % PHOTOS.length], 1400)]);
  i++;
}
for (const name of galleryFiles) {
  downloads.push([`explore/${name}.jpg`, unsplash(PHOTOS[i % PHOTOS.length], 900)]);
  i++;
}
for (const [rel, w] of regulatoryFiles) {
  downloads.push([rel, unsplash(PHOTOS[i % PHOTOS.length], w)]);
  i++;
}
downloads.push(["about/about-feature.jpg", unsplash(PHOTOS[2], 1200)]);

function download(url, dest) {
  return new Promise((resolve, reject) => {
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    const file = fs.createWriteStream(dest);
    const req = https.get(url, (res) => {
      if (res.statusCode && res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        file.close();
        try {
          fs.unlinkSync(dest);
        } catch {
          /* empty */
        }
        download(res.headers.location, dest).then(resolve).catch(reject);
        return;
      }
      if (res.statusCode !== 200) {
        reject(new Error(`${url} => ${res.statusCode}`));
        return;
      }
      res.pipe(file);
      file.on("finish", () => {
        file.close();
        resolve();
      });
    });
    req.on("error", reject);
  });
}

async function main() {
  let ok = 0;
  let fail = 0;
  for (const [rel, url] of downloads) {
    const dest = path.join(ROOT, rel);
    process.stdout.write(`${rel}... `);
    try {
      await download(url, dest);
      console.log("ok");
      ok++;
    } catch (e) {
      console.log("FAILED", e.message);
      fail++;
    }
  }
  console.log(`Done: ${ok} ok, ${fail} failed`);
}

main();
