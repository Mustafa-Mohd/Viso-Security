/**
 * ============================================================================
 *                    🧠 VISO CHATBOT KNOWLEDGE BRAIN INDEX
 * ============================================================================
 * Central hub importing modular brain files:
 * - company.ts (Identity, values, timeline, leadership)
 * - services.ts (4-Stage framework, technical engineering disciplines, sectors)
 * - supervision.ts (Project Management & Engineering Supervision lifecycle, SWA/WTCO)
 * - licenses.ts (CR, SAIS, CCC, Balady, ISO 9001/45001/27001, Aramco SACS-002, HCIS, MOI)
 * - translation.ts (Accredited translation office vs AI conversational translation)
 * - locations.ts (HQ, regional offices, clients, contact channels)
 * - faqs.ts (Verified Q&As in English and Arabic)
 * ============================================================================
 */

import { COMPANY_KNOWLEDGE } from "./company";
import { SERVICES_KNOWLEDGE } from "./services";
import { SUPERVISION_KNOWLEDGE } from "./supervision";
import { LICENSES_KNOWLEDGE } from "./licenses";
import { TRANSLATION_KNOWLEDGE } from "./translation";
import { LOCATIONS_AND_CLIENTS_KNOWLEDGE } from "./locations";
import { FAQS_KNOWLEDGE } from "./faqs";

export * from "./company";
export * from "./services";
export * from "./supervision";
export * from "./licenses";
export * from "./translation";
export * from "./locations";
export * from "./faqs";

/**
 * Compiles all modular brain files into one comprehensive master knowledge string
 * injected into the AI system prompt.
 */
export function getCompiledBrainKnowledge(): string {
  const comp = COMPANY_KNOWLEDGE;
  const srv = SERVICES_KNOWLEDGE;
  const sup = SUPERVISION_KNOWLEDGE;
  const lic = LICENSES_KNOWLEDGE;
  const trans = TRANSLATION_KNOWLEDGE;
  const loc = LOCATIONS_AND_CLIENTS_KNOWLEDGE;

  return `
=== VISO VERIFIED MASTER KNOWLEDGE BRAIN ===
Company: ${comp.nameEn} (${comp.nameAr})
Established: ${comp.established}
Core Persona: High-End Physical Security Architecture & Sovereign Consulting
Headquarters: ${loc.headquarters.address}
Regional Offices: ${loc.regionalOffices.map((o) => `${o.city} (${o.region})`).join(", ")}
Nationwide Execution: Full coverage across all 13 provinces of Saudi Arabia.

COMPANY PURPOSE & VALUES:
- Tagline: ${comp.tagline}
- Mission: ${comp.mission}
- Vision: ${comp.vision}
- Track Record: ${comp.trackRecord}
- Core Values:
${comp.coreValues.map((v) => `  * ${v}`).join("\n")}

REGULATORY AUTHORITIES & GOVERNANCE:
${lic.regulatoryBodies
  .map(
    (r) => `- ${r.shortName} (${r.fullName}):
    Role & Authority: ${r.role}`,
  )
  .join("\n")}

OFFICIAL LICENSES & ACCREDITATIONS:
${lic.credentials.map((c) => `- ${c.title} [${c.validity}]: ${c.details}`).join("\n")}

THE 4-STAGE PHYSICAL SECURITY ENGINEERING LIFECYCLE:
${srv.the4Stages
  .map(
    (s) => `[${s.stage}] ${s.nameEn} (${s.nameAr}):
  * Summary: ${s.summary}
  * Key Deliverables: ${s.deliverables.join("; ")}`,
  )
  .join("\n\n")}

TECHNICAL ENGINEERING SYSTEMS:
${srv.technicalSystems.map((sys) => `- ${sys.name}: ${sys.description}`).join("\n")}

PROJECT MANAGEMENT & TECHNICAL SUPERVISION:
${sup.overview}
6-Step Supervision Framework:
${sup.lifecycleSteps.map((step) => `  [Step ${step.num}] ${step.title}: ${step.description}`).join("\n")}
Featured Supervision Projects:
${sup.featuredProjects.map((p) => `  - ${p.title} (${p.client}, ${p.location}): ${p.scope} [${p.status}]`).join("\n")}

KEY SECTORS SERVED:
${srv.sectorsServed.map((s) => `- ${s.sector}: ${s.description}`).join("\n")}

KEY CLIENTS:
${loc.keyClients.map((k) => `- ${k}`).join("\n")}

CERTIFIED TRANSLATION SERVICES (OFFICIAL OFFICE):
- Accreditation: ${trans.accreditation}
- Overview: ${trans.overview}
- Document Categories: ${trans.servicesOffered.join("; ")}
- Languages: ${trans.languages.join(", ")}
- Digital Registry & Seal: ${trans.digitalVerification}
- Notice on AI vs Official Translation: ${trans.aiChatbotTranslationNotice}

OFFICIAL CONTACT CHANNELS:
- Direct Inquiries / Proposal Requests: info@visogroup.com
- Phone / WhatsApp: +966 11 450 3289
- Website: visogroup.com (Contact Form at /contact)

VERIFIED FREQUENTLY ASKED QUESTIONS (FAQS):
${FAQS_KNOWLEDGE.map((faq) => `Q (EN): ${faq.questionEn}\nA (EN): ${faq.answerEn}\nQ (AR): ${faq.questionAr}\nA (AR): ${faq.answerAr}`).join("\n\n")}
============================================
`.trim();
}

/**
 * Fast-track Instant Answer Resolver
 *
 * Strict Intent Guardrails:
 * 1. MUST NOT trigger on multi-part questions (e.g. queries asking 2+ things like "Aur kya kya hai VISO mein? HCIS ka full form?").
 * 2. MUST NOT trigger on translation requests (e.g. "translate ...", "ترجم ...").
 * 3. MUST NOT trigger on conversational follow-ups (e.g. "explain it in simple words", "explain in Arabic").
 * 4. MUST NOT trigger on low-confidence single-word keyword overlaps.
 * Only triggers when the user's unambiguous intent matches a verified FAQ.
 */
export function getFastTrackAnswer(userQuery: string, currentLang: string): string | null {
  if (!userQuery) return null;
  const rawQuery = userQuery.trim();
  const query = rawQuery.toLowerCase();
  const isArabic = currentLang === "ar" || /[\u0600-\u06FF]/.test(query);

  // 1. Guard against translation requests: Let AI handle full translation
  if (
    /^(translate|ترجم|ترجمة|convert\s+to|what\s+is\s+the\s+translation)/i.test(query) ||
    /\b(into\s+(arabic|urdu|hindi|english|french)|ko\s+(arabic|urdu|hindi|english)\s+mein\s+translate)\b/i.test(
      query,
    )
  ) {
    return null;
  }

  // 2. Guard against multi-part questions (conjunctions, multiple question marks, etc.)
  const questionMarkCount = (rawQuery.match(/\?/g) || []).length;
  if (questionMarkCount > 1) return null;

  if (
    /\b(and\b|aur\b|wa\b|also\b|as well as\b|plus\b|bhi\b|saath mein)\b/i.test(query) &&
    query.length > 25
  ) {
    return null;
  }

  // 3. Guard against follow-up or refinement requests
  if (
    /\b(in simple words|more details|explain it|explain that|casually|batao aur|kya matlab|bataiye)\b/i.test(
      query,
    ) &&
    query.split(" ").length > 3
  ) {
    return null;
  }

  // 4. Exact / High-Confidence Intent Match against Verified FAQs
  for (const faq of FAQS_KNOWLEDGE) {
    const qEn = faq.questionEn.toLowerCase();
    const qAr = faq.questionAr.toLowerCase();

    // Exact question match
    if (query === qEn || query === qAr) {
      return isArabic ? faq.answerAr : faq.answerEn;
    }

    // Normalized punctuation comparison
    const normUser = query.replace(/[?؟.,!]/g, "").trim();
    const normEn = qEn.replace(/[?.,!]/g, "").trim();
    const normAr = qAr.replace(/[؟.,!]/g, "").trim();

    if (normUser === normEn || normUser === normAr) {
      return isArabic ? faq.answerAr : faq.answerEn;
    }
  }

  // 5. Targeted High-Confidence Single-Intent Matches
  // HCIS full form / definition (single-topic only)
  if (
    /^(what is hcis\??|hcis ka full form kya hai\??|what does hcis stand for\??|ما هو hcis\??|ما هي الهيئة العليا للأمن الصناعي\??)$/i.test(
      query.trim(),
    )
  ) {
    const faq = FAQS_KNOWLEDGE.find((f) => f.id === "what-is-hcis");
    if (faq) return isArabic ? faq.answerAr : faq.answerEn;
  }

  // What is VISO?
  if (
    /^(what is viso\??|who is viso\??|viso kya hai\??|ما هي فيسو\??|من هي شركة فيسو\??)$/i.test(
      query.trim(),
    )
  ) {
    const faq = FAQS_KNOWLEDGE.find((f) => f.id === "what-is-viso");
    if (faq) return isArabic ? faq.answerAr : faq.answerEn;
  }

  // Where are VISO's offices?
  if (
    /^(where is viso located\??|where are your offices\??|viso office locations\??|أين تقع مكاتب فيسو\??|أين فروع فيسو\??)$/i.test(
      query.trim(),
    )
  ) {
    const faq = FAQS_KNOWLEDGE.find((f) => f.id === "office-locations");
    if (faq) return isArabic ? faq.answerAr : faq.answerEn;
  }

  // Return null to allow Gemini AI engine to provide nuanced, contextual multi-lingual answers
  return null;
}
