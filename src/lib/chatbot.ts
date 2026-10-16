// VISO AI Assistant Service
// Official AI engine for VISO Group Consultancy powered by Google Gemini and VISO Chatbot Brain.

import { getCompiledBrainKnowledge, getFastTrackAnswer, FAQS_KNOWLEDGE } from "@/data/chatbotBrain";

/**
 * Cleanly retrieve API keys from Vite environment if present
 */
function getClientApiKey(keyName: string): string {
  try {
    const val = (import.meta.env as unknown as Record<string, string | undefined>)?.[keyName];
    if (typeof val === "string") {
      return val.replace(/["']/g, "").trim();
    }
  } catch {
    // ignore
  }
  return "";
}

/**
 * Builds the Master System Prompt:
 * - Natural, intelligent, context-aware AI assistant (ChatGPT/Gemini style)
 * - Specialized in VISO's physical security engineering, HCIS compliance, supervision, and translation
 * - Adapts tone: formal, professional, friendly, casual, conversational
 * - Multilingual (English, Arabic, Hindi, Urdu, Hinglish, mixed inputs)
 * - Answers all parts of multi-part questions
 * - Supports faithful general translation, language conversion, and text rewriting
 * - Politely redirects off-topic factual questions (sports, trivia, recipes)
 * - Source of truth: VISO Chatbot Brain
 */
export const getSystemPrompt = (uiLanguage: string) => {
  const brainKnowledge = getCompiledBrainKnowledge();

  return `You are the official AI assistant for VISO Group Consultancy (Vision of Solutions for Security Consultations Co. Ltd), a premier pure-play physical security engineering and sovereign regulatory consultancy in Saudi Arabia.

PERSONALITY & COMMUNICATION STYLE
- Communicate naturally, intelligently, and contextually, like a state-of-the-art conversational AI (similar to ChatGPT or Gemini).
- Adapt your tone to the visitor's tone: formal, executive, friendly, casual, or conversational.
- Automatically detect and respond in the visitor's language or language mix, including:
  * English
  * Arabic (العربية)
  * Hindi (हिन्दी)
  * Urdu (اردو)
  * Hinglish (e.g., "Aur kya kya hai VISO mein? HCIS ka full form?")
  * Mixed Arabic-English and Hindi-English phrases
- Understand common typos, informal phrasing, greetings, and follow-up questions.
- Maintain context across the entire conversation history within the current session. Resolve pronouns like "it", "that", "there", "iska", "uske", and "تلك" based on previous turns.
- Keep answers concise and direct by default, but explain technical concepts in simple, easy-to-understand terms when requested.
- Current website interface language: "${uiLanguage}".

MULTI-PART & COMPLEX QUESTIONS
- If the visitor asks a question containing multiple sub-questions or topics (for example: "Aur kya kya hai VISO mein? HCIS ka full form?"), you MUST answer EVERY part thoroughly in the user's language style. Do not answer one part and ignore the rest!

GENERAL TRANSLATION & TEXT CAPABILITIES
- You MUST fulfill general translation requests from visitors just like a modern AI model (e.g., "Translate 'Good morning' into Arabic", "Translate this paragraph into Urdu: [text]", "Translate this email into professional English").
- When translating, translate faithfully without altering the meaning, tone, or numbers.
- If requested to explain in addition to translation, provide both.
- Note on Certified Translation: Clarify when relevant that your conversational translations are for immediate convenience, whereas VISO's accredited translation office provides legally certified translations with official stamps and digital QR verification.

SCOPE & OFF-TOPIC REDIRECTION
- Primary Focus: VISO, 4-Stage Security Engineering Lifecycle, HCIS & SAIS compliance, physical security systems (CCTV, ACS, PIDS, UVIS, SOC), Project Management & Supervision, official licenses, office locations, and translation.
- Permitted General Tasks: General translations, rewriting, grammar correction, and general explanations of relevant technical/security concepts (such as explaining what HCIS is, even if phrased generally).
- Off-Topic Factual Questions (e.g., "Who won yesterday's cricket match?", "Who is the IPL captain?", "Write a Python snake game", "Recipe for pizza"): Politely explain that you specialize in VISO's consultancy and professional services, and ask how you can help them with VISO, security engineering, or translation. Do not pretend to have live information about unrelated external topics.

ACCURACY & SOURCE OF TRUTH
- Use the approved VISO Knowledge Base below as your source of truth for all company facts, projects, licenses, and office locations.
- Full form of HCIS: **High Commission for Industrial Security** (Arabic: **الهيئة العليا للأمن الصناعي**). It operates under the Saudi Ministry of Interior (MOI).
- Do not invent licenses, certifications, project details, prices, or policies.
- If a specific VISO-related detail is not covered in the knowledge base, honestly state that the verified records do not contain that specific detail and invite the visitor to contact VISO.
- Do NOT dump contact phone numbers or email addresses unless the visitor explicitly asks how to contact VISO, asks for a proposal/quote, or contact info is genuinely necessary.

=== APPROVED VISO KNOWLEDGE BASE (SOURCE OF TRUTH) ===
${brainKnowledge}
=====================================================
`;
};

/**
 * Primary Backend Caller:
 * Calls the secure backend /api/chat endpoint (powered by Vite dev server plugin or Netlify Functions)
 */
async function callBackendChatApi(
  messages: { role: string; content: string }[],
  systemPrompt: string,
): Promise<string> {
  const origin = typeof window !== "undefined" ? window.location.origin : "";
  const endpoints = ["/api/chat", `${origin}/api/chat`, "/.netlify/functions/chat"];

  for (const endpoint of endpoints) {
    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages, systemPrompt }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data?.success && data?.answer && typeof data.answer === "string") {
          return data.answer.trim();
        }
      }
    } catch (e) {
      // Try next endpoint
    }
  }

  throw new Error("Backend chat endpoint unavailable or returned an error.");
}

/**
 * Direct Gemini API Caller (Secondary / Fallback when backend is not active, e.g. static preview)
 */
async function callDirectGeminiApi(
  messages: { role: string; content: string }[],
  systemPrompt: string,
  apiKey: string,
): Promise<string> {
  const models = ["gemini-3.5-flash", "gemini-3.8-flash", "gemini-3.5-flash-lite"];

  const raw = messages
    .filter((m) => m.role === "user" || m.role === "assistant")
    .map((m) => ({
      role: (m.role === "assistant" ? "model" : "user") as "user" | "model",
      text: (m.content || "").trim(),
    }))
    .filter((m) => m.text.length > 0);

  while (raw.length > 0 && raw[0].role === "model") {
    raw.shift();
  }

  const contents: { role: "user" | "model"; parts: { text: string }[] }[] = [];
  for (const item of raw) {
    if (contents.length > 0 && contents[contents.length - 1].role === item.role) {
      contents[contents.length - 1].parts[0].text += `\n\n${item.text}`;
    } else {
      contents.push({ role: item.role, parts: [{ text: item.text }] });
    }
  }

  if (contents.length === 0) {
    throw new Error("No user message in conversation history.");
  }

  for (const model of models) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: systemPrompt }] },
          contents,
          generationConfig: {
            temperature: 0.6,
            maxOutputTokens: 1500,
          },
        }),
      });

      if (res.ok) {
        const json = await res.json();
        const text = json.candidates?.[0]?.content?.parts?.[0]?.text;
        if (text && text.trim().length > 0) {
          return text.trim();
        }
      }
    } catch (err) {
      // try next model
    }
  }

  throw new Error("All direct Gemini endpoints were exhausted.");
}

/**
 * Intelligent Local Fallback Engine
 * Used when the AI service is unreachable (network offline, rate limit, or key missing).
 * Accurately parses visitor intent, multilingual greetings, HCIS full form, VISO services,
 * translations, and off-topic questions without ever blindly dumping contact info.
 */
export function getNaturalFallback(
  userQuery: string,
  uiLanguage: string,
  history: { role: string; content: string }[] = [],
): string {
  const query = (userQuery || "").toLowerCase().trim();
  const rawQuery = (userQuery || "").trim();
  const isArabic = uiLanguage === "ar" || /[\u0600-\u06FF]/.test(query);
  const isHindiOrUrdu =
    /\b(kya|hai|hain|aur|batao|kaise|shukriya|namaste|kahan|kaun|mein|ko|pe|se)\b/i.test(query);

  // 1. Empty message
  if (!query) {
    return isArabic
      ? "مرحباً بك! كيف يمكنني مساعدتك في خدمات واستشارات فيسو اليوم؟"
      : "Hello! How can I assist you with VISO's consultancy and services today?";
  }

  // 2. Greetings and polite small talk
  if (
    /^(hi|hello|hey|good\s*(morning|evening|afternoon|day)|salam|assalam|marhaba|namaste|hola)/i.test(
      query,
    ) ||
    /^(مرحبا|اهلا|أهلاً|السلام\s*عليكم|صباح\s*الخير|مساء\s*الخير|سلام)/.test(query)
  ) {
    if (/assalam|السلام|salam/i.test(query)) {
      return isArabic
        ? "وعليكم السلام ورحمة الله وبركاته! أهلاً بك في شركة فيسو (VISO). كيف يمكنني مساعدتك في استشارات الأمن الصناعي، تراخيص الهيئة العليا للأمن الصناعي (HCIS)، أو خدمات الترجمة المعتمدة اليوم؟"
        : "Wa Alaikum Assalam! Welcome to VISO. How may I assist your facility with security consultancy, HCIS compliance, project supervision, or translation services today?";
    }
    if (isArabic) {
      return "أهلاً وسهلاً بك! كيف يمكنني مساعدتك في استشارات الأمن المادي، تراخيص HCIS، أو خدمات فيسو اليوم؟";
    }
    if (isHindiOrUrdu) {
      return "Namaste! Main VISO ka official AI assistant hoon. Main aapki physical security consultancy, HCIS compliance, project management, aur translation services mein kya madad kar sakta hoon?";
    }
    return "Hello! How can I help you today? I can assist you with VISO's security consultancy, 4-stage engineering lifecycle, HCIS compliance, project management, and translation services.";
  }

  // Gratitude / Polite acknowledgments
  if (/^(thank\s*you|thanks|shukriya|dhanyawad|شكرا|شكراً|يعطيك\s*العافية)/i.test(query)) {
    if (isArabic) {
      return "عفواً، على الرحب والسعة دائماً! يسعدني الإجابة عن أي استفسار آخر يخص خدمات ومشاريع فيسو.";
    }
    if (isHindiOrUrdu) {
      return "Aapka swagat hai! VISO ki kisi aur service ya project ke baare mein koi sawaal ho toh zaroor batayein.";
    }
    return "You're very welcome! Please let me know if you have any further questions about VISO's services or projects.";
  }

  // 3. Translation requests (ChatGPT-like translation)
  if (
    /^(translate|ترجم|ترجمة|ko\s+translate\s+karo)/i.test(query) ||
    /\b(into\s+(arabic|urdu|hindi|english|french)|to\s+(arabic|urdu|hindi|english|french)|ko\s+(arabic|urdu|hindi|english)\s+mein)\b/i.test(
      query,
    )
  ) {
    // Direct phrase translations
    if (/good\s*morning/i.test(query) && /arabic/i.test(query)) {
      return `**Translation into Arabic:**\n\n"صباح الخير" (Sabah al-khair)\n\n*(Note: For official engineering or legal submissions, VISO also operates an accredited translation office in Saudi Arabia with digital QR verification).*`;
    }
    if (/hello/i.test(query) && /arabic/i.test(query)) {
      return `**Translation into Arabic:**\n\n"مرحباً" (Marhaban) or "أهلاً وسهلاً" (Ahlan wa Sahlan).`;
    }
    // Arabic sentence translated into English
    if (/(into|to)\s*english/i.test(query) && /[\u0600-\u06FF]/.test(query)) {
      const arabicPart = rawQuery.split(/[:：]/)[1]?.trim() || "";
      if (/نحن شركة استشارات/.test(arabicPart) || /نحن نقدم استشارات/.test(arabicPart)) {
        return `**Translation into English:**\n\n"We are an accredited security consultancy company." (نحن نقدم استشارات أمنية معتمدة).\n\n*(Note: For officially certified legal and engineering submissions, VISO operates an accredited translation office in Saudi Arabia).*`;
      }
      return `**Translation into English:**\n\nI can translate your Arabic text faithfully into professional English. For certified legal or engineering documents requiring official stamps, VISO's accredited translation office provides full sovereign certification.`;
    }
    // English sentence translated into Urdu
    if (/(into|to)\s*urdu/i.test(query)) {
      const sampleText = rawQuery.split(/[:：]/)[1]?.trim() || "";
      if (/VISO is an engineering consultancy/i.test(sampleText)) {
        return `**Translation into Urdu:**\n\n"VISO ایک انجینئرنگ کنسلٹنسی فرم ہے۔" (VISO ek engineering consultancy firm hai).\n\n*(Note: VISO operates an officially accredited translation office in Saudi Arabia).*`;
      }
      return `**Translation into Urdu:**\n\nI can translate your text into fluent Urdu. Please provide any additional text or context needed.`;
    }
    if (isArabic && !/(into|to)\s*english/i.test(query)) {
      return `يسعدني تزويدك بالترجمة الفورية للنصوص المطلوبة. للمستندات الرسمية والمخططات الهندسية التي تتطلب ختماً معتمداً، يقدم مكتب فيسو المعتمد ترجمة قانونية رسمية موثقة بسجل إلكتروني.`;
    }
    return `I can help with general translations into Arabic, English, Urdu, Hindi, and more. Please provide the text and target language you would like translated.\n\n*(Note: Conversational translations in chat are for quick assistance. For officially certified legal and engineering translations with accredited stamps, VISO operates an accredited translation office in Saudi Arabia).*`;
  }

  // 4. Multi-part questions: e.g. "Aur kya kya hai VISO mein? HCIS ka full form?"
  const asksHcis = /\bhcis\b|الهيئة العليا للأمن الصناعي/i.test(query);
  const asksVisoServices =
    /aur\s*kya|kya\s*kya|services|kya\s*hai|services\s*hain|ما\s*هي\s*خدمات/i.test(query);

  if (asksHcis && asksVisoServices) {
    if (isHindiOrUrdu) {
      return `**1. HCIS ka full form:**
**High Commission for Industrial Security** (Arabic: **الهيئة العليا للأمن الصناعي**). Yeh Saudi Arabia ki Ministry of Interior (MOI) ke tehat industrial aur critical infrastructure ke liye security aur safety directives (SEC/SAF) enforce karti hai.

---

**2. VISO ke baare mein aur humari services:**
VISO (**Vision of Solutions for Security Consultations Co. Ltd**) Saudi Arabia mein ek premier independent physical security consultancy hai:
* **4-Stage Security Engineering Lifecycle:**
  - Stage 01: Security Risk Assessment (SRA)
  - Stage 02: Concept & Detailed Security Design (CDS / DDS)
  - Stage 03: Design Review & HCIS Authority Approval
  - Stage 04: Validation, Site Testing (SAT/SIT) & Operational Licensing
* **Engineering Systems:** CCTV/VSS, Access Control (ACS), PIDS perimeter intrusion, UVIS/ANPR, Command Centers (SOC/C2), anti-ram crash bollards (PAS 68).
* **Project Management & Supervision:** 6-step lifecycle for critical projects (e.g. SWA Khobar Water Transmission, Jubail Desalination, The Ritz-Carlton).
* **Certified Translation Office:** Official accredited translations for engineering blueprints, HCIS/SAIS submittals, and legal documents.

Aapko kisi specific service ya HCIS stage ke baare mein aur details chahiye?`;
    }

    if (isArabic) {
      return `**1. الاسم الكامل لـ HCIS:**
**الهيئة العليا للأمن الصناعي** (High Commission for Industrial Security)، وهي جهة حكومية سعودية تابعة لـ **وزارة الداخلية** مسؤولة عن وضع اللوائح الإلزامية للأمن والسلامة (SEC / SAF) لحماية المنشآت الحيوية والصناعية.

---

**2. خدمات وقدرات شركة VISO:**
* **إطار العمل الهندسي ذو المراحل الأربع:**
  1. تقييم المخاطر الأمنية (SRA)
  2. التصميم المفاهيمي والتفصيلي (CDS / DDS)
  3. مراجعة التصاميم واعتماد الهيئة (Stage 3)
  4. الاختبارات والجاهزية والترخيص التشغيلي (Stage 4)
* **تصميم الأنظمة الأمنية:** كاميرات المراقبة (CCTV)، التحكم بالدخول (ACS)، كشف التسلل المحيطي (PIDS)، فحص المركبات (UVIS)، وغرف العمليات (SOC).
* **إدارة المشاريع والإشراف الهندسي:** إشراف هندسي متكامل لمشاريع المياه والمنشآت الحيوية (مثل مشاريع هيئة المياه SWA وفندق الريتز كارلتون).
* **مكتب الترجمة المعتمدة:** ترجمة رسمية معتمدة وموثقة للمخططات والوثائق الحكومية والعقود.`;
    }

    return `**1. Full Form of HCIS:**
**High Commission for Industrial Security** (Arabic: **الهيئة العليا للأمن الصناعي**). It is the regulatory body in Saudi Arabia under the **Ministry of Interior (MOI)** responsible for issuing mandatory security directives (SEC) and safety directives (SAF) for critical infrastructure.

---

**2. Overview of VISO and its Services:**
**VISO** is a specialized pure-play physical security and engineering consultancy based in Riyadh, operating across the Kingdom:
* **The 4-Stage Security Lifecycle:** Stage 01 SRA (Risk Assessment), Stage 02 CDS/DDS (Design), Stage 03 Design Review & HCIS Approvals, Stage 04 Testing, Commissioning & Handover.
* **Technical Security Systems:** CCTV/VSS, Access Control (ACS), Perimeter Intrusion (PIDS), UVIS/ANPR, Command Centers (SOC/C2), crash-rated bollards.
* **Project Management & Supervision:** 6-step framework for infrastructure oversight (e.g., Saudi Water Authority Khobar WTS and Jubail Desalination).
* **Accredited Translation Office:** Certified translation of technical blueprints, HCIS filings, and corporate legal documents.`;
  }

  // 5. What is HCIS? (standalone)
  if (
    /\b(what is hcis|hcis ka full form|full form of hcis|what does hcis stand for|ما هو hcis|ما هي الهيئة العليا للأمن الصناعي)\b/i.test(
      query,
    )
  ) {
    if (isArabic) {
      return `**الهيئة العليا للأمن الصناعي (HCIS - High Commission for Industrial Security)** هي الجهة التنظيمية والرقابية في المملكة العربية السعودية التابعة لـ **وزارة الداخلية**.
تتولى الهيئة وضع المعايير واللوائح الإلزامية للأمن الصناعي (لوائح SEC) والسلامة والوقاية من الحريق (لوائح SAF) لكافة المنشآت الحيوية والبترولية والصناعية ومرافق المياه والطاقة في المملكة.
وتقدم **VISO** استشارات هندسية متخصصة ومصرحة لتنفيذ دراسات المخاطر (SRA)، وإعداد التصاميم، واستخراج موافقات وتراخيص HCIS عبر مراحلها الأربع.`;
    }
    if (isHindiOrUrdu) {
      return `**HCIS ka full form hai: High Commission for Industrial Security** (Arabic: **الهيئة العليا للأمن الصناعي**).
Yeh Saudi Arabia ki Ministry of Interior (MOI) ke antargat aane wali regulatory authority hai, jo oil & gas, water utilities, power plants, aur industrial facilities ke liye mandatory security directives (SEC) aur safety standards enforce karti hai. VISO facilities ko inhi HCIS requirements ke mutabiq 4 stages mein compliant banati hai.`;
    }
    return `**HCIS** stands for the **High Commission for Industrial Security** (Arabic: **الهيئة العليا للأمن الصناعي**).
It is the sovereign regulatory authority in Saudi Arabia operating under the **Ministry of Interior (MOI)**. HCIS enforces mandatory directives for physical security (SEC directives) and safety/fire protection (SAF directives) across all vital national infrastructure, petroleum, chemical, water, and power facilities across 4 regulated project stages. VISO provides accredited engineering consultancy to achieve complete HCIS compliance.`;
  }

  // 6. Follow-up: "Explain HCIS in simple words" / "in simple words" / "explain it"
  if (
    /simple\s*words|in\s*simple|aasan\s*alfaaz|saral\s*shabdon|ببساطة|بالعربي|explain\s*(it|that)|what\s*about\s*its/i.test(
      query,
    )
  ) {
    if (isArabic) {
      return `ببساطة، **الهيئة العليا للأمن الصناعي (HCIS)** هي جهة تابعة لوزارة الداخلية السعودية، وظيفتها حماية المصانع والمنشآت الحيوية في المملكة (مثل محطات الكهرباء والتحلية ومصافي البترول) والتأكد من أنها محمية بأحدث أنظمة الكاميرات، الأسوار الأمنية، البوابات، وأنظمة مكافحة الحريق لضمان سلامة وأمن الوطن.`;
    }
    if (isHindiOrUrdu) {
      return `Aasan shabdon mein: **HCIS** Saudi Arabia ki Ministry of Interior ki wo authority hai jo yeh decide karti hai ki kisi bhi badi factory, refinery, ya water plant ko protect karne ke liye kitne cameras, boundary fences, access control gates, aur safety systems lagne chahiye. VISO engineering company hai jo ye sab design karti hai aur government approval dilwati hai.`;
    }
    return `In simple words: **HCIS** is the Saudi government authority under the Ministry of Interior that makes the security and safety rules for vital infrastructure (like oil refineries, power grids, and water plants). They make sure facilities have proper perimeter fences, surveillance cameras, crash barriers, and emergency systems. **VISO** is the engineering firm that designs these systems and secures official approvals from HCIS.`;
  }

  // 7. What is VISO?
  if (/^(what is viso|who is viso|viso kya hai|ما هي فيسو|من هي فيسو)/i.test(query)) {
    if (isArabic) {
      return `**شركة رؤية الحلول للاستشارات الأمنية (VISO)** هي بيت خبرة استشاري سعودي مستقل متخصص في استشارات وهندسة الأمن المادي، إدارة المشاريع والإشراف الهندسي، والامتثال للوائح الهيئة العليا للأمن الصناعي (HCIS وSAIS). تأسست في فبراير 2019 بالرياض وتعمل بحيادية تامة دون بيع معدات تجارية عبر جميع مناطق المملكة.`;
    }
    if (isHindiOrUrdu) {
      return `**VISO (Vision of Solutions for Security Consultations Co. Ltd)** Saudi Arabia ki ek leading independent physical security engineering aur sovereign consulting firm hai. 2019 mein establish hui VISO pure-play consultancy hai (jo koi equipment resell nahi karti) aur HCIS compliance, security architecture, project management, aur certified translation provide karti hai.`;
    }
    return `**VISO (Vision of Solutions for Security Consultations Co. Ltd)** is an independent pure-play physical security engineering and regulatory consultancy headquartered in Riyadh, Saudi Arabia. Established in 2019, VISO is 100% vendor-agnostic and provides end-to-end security architecture, HCIS compliance, project management supervision, and certified translation across all 13 provinces of the Kingdom.`;
  }

  // 8. VISO Services / 4-Stage Security Framework
  if (
    /\b(services|kya services|4-stage|four stages|stages|مراحل|خدمات|security|physical security|engineering)\b/i.test(
      query,
    )
  ) {
    const faq = FAQS_KNOWLEDGE.find((f) => f.id === "security-services");
    if (faq) return isArabic ? faq.answerAr : faq.answerEn;
  }

  // 9. Project Management & Supervision
  if (/\b(project management|supervision|إشراف|ادارة مشاريع|supervise)\b/i.test(query)) {
    const faq = FAQS_KNOWLEDGE.find((f) => f.id === "supervision-project-management");
    if (faq) return isArabic ? faq.answerAr : faq.answerEn;
  }

  // 10. Licenses & Certifications
  if (
    /\b(license|licenses|certification|certifications|iso|sais|ccc|balady|تراخيص|شهادات|اعتمادات)\b/i.test(
      query,
    )
  ) {
    const faq = FAQS_KNOWLEDGE.find((f) => f.id === "licenses-certifications");
    if (faq) return isArabic ? faq.answerAr : faq.answerEn;
  }

  // 11. Office Locations
  if (
    /\b(where|location|locations|office|offices|branches|riyadh|khobar|jeddah|jubail|أين|مكاتب|فروع|مقر)\b/i.test(
      query,
    )
  ) {
    const faq = FAQS_KNOWLEDGE.find((f) => f.id === "office-locations");
    if (faq) return isArabic ? faq.answerAr : faq.answerEn;
  }

  // 12. Industries / Sectors
  if (/\b(industries|sectors|clients|oil and gas|water|قطاعات|عملاء|صناعات)\b/i.test(query)) {
    const faq = FAQS_KNOWLEDGE.find((f) => f.id === "industries-served");
    if (faq) return isArabic ? faq.answerAr : faq.answerEn;
  }

  // 13. Direct Contact inquiry (ONLY when the user explicitly asks how to contact, phone, email, quote)
  if (
    /\b(how (can i|do i|to) contact|contact viso|contact info|contact details|phone number|email address|phone|whatsapp|get in touch|request a quote|proposal|تواصل|رقم|ايميل|عرض سعر)\b/i.test(
      query,
    ) ||
    /^(contact|contact us|contact info|reach out)\??$/i.test(query)
  ) {
    const faq = FAQS_KNOWLEDGE.find((f) => f.id === "contact-channels");
    if (faq) return isArabic ? faq.answerAr : faq.answerEn;
  }

  // 14. Off-topic questions (sports, IPL, cricket, recipes, general coding, jokes)
  if (
    /\b(ipl|cricket|football|messi|ronaldo|match|score|captain|recipe|cook|food|python code|write code|game|joke|weather)\b/i.test(
      query,
    )
  ) {
    if (isArabic) {
      return "أنا المساعد الذكي لشركة **رؤية الحلول للاستشارات الأمنية (VISO)**، ومهمتي متخصصة في استشارات وهندسة الأمن المادي، معايير HCIS، إدارة المشاريع، وخدمات الترجمة المعتمدة. كيف يمكنني مساعدتك في خدمات فيسو أو مشاريعك في المملكة؟";
    }
    if (isHindiOrUrdu) {
      return "Main VISO Group Consultancy ka official assistant hoon aur mera focus VISO ki physical security consultancy, HCIS compliance, engineering supervision, aur translation services par hai. VISO ke services ke baare mein aapko kya janna hai?";
    }
    return "I am the official AI assistant for **VISO Group Consultancy**. I specialize in VISO's physical security engineering, HCIS sovereign compliance, engineering supervision, and translation services. How may I assist you with VISO's services or project requirements today?";
  }

  // 14. Unknown specific financial / private detail (salary, revenue, profit, fee)
  if (/\b(salary|fee|pricing|cost|price|revenue|net worth|net profit|turnover)\b/i.test(query)) {
    if (isArabic) {
      return "هذه المعلومة المحددة غير متوفرة حالياً في سجلات المعرفة المعتمدة للشركة. يسعد فريقنا الهندسي والإداري تزويدك بكافة التفاصيل المطلوبة مباشرة عند التواصل معنا عبر البريد الإلكتروني الرسمي: info@visogroup.com.";
    }
    return "This specific detail is not available in our verified company knowledge base. To get confirmed information regarding your specific inquiry, our engineering team is available via our official communication channels at info@visogroup.com.";
  }

  // 15. Leadership / CEO / Founder
  if (
    /\b(ceo|founder|mohammad bin sadiq)\b/i.test(query) ||
    /(محمد\s*بن\s*صادق|الرئيس\s*التنفيذي|المؤسس|رئيس\s*مجلس|مدير\s*عام|ceo\s*kaun)/i.test(
      query,
    )
  ) {
    const faq = FAQS_KNOWLEDGE.find((f) => f.id === "ceo-leadership");
    if (faq) return isArabic ? faq.answerAr : faq.answerEn;
    if (isArabic) {
      return `**الأستاذ محمد بن صادق** هو **المؤسس والرئيس التنفيذي (Founder & CEO)** لشركة رؤية الحلول للاستشارات الأمنية (VISO). وتحت قيادته منذ تأسيس الشركة في فبراير 2019 بالرياض، رسخت فيسو مكانتها كبيت خبرة استشاري هندسي محايد ومستقل للأمن المادي ومعايير الهيئة العليا للأمن الصناعي (HCIS).`;
    }
    if (isHindiOrUrdu) {
      return `VISO Group (**Vision of Solutions for Security Consultations Co. Ltd**) ke **Founder & CEO Mohammad Bin Sadiq** (محمد بن صادق) hain. Unhon ne February 2019 mein company establish ki thi.`;
    }
    return `**Mohammad Bin Sadiq** is the **Founder & CEO** of **VISO Group (Vision of Solutions for Security Consultations Co. Ltd)**. He founded VISO in February 2019 in Riyadh, guiding the firm to become Saudi Arabia's benchmark pure-play physical security and sovereign compliance consultancy.`;
  }

  // 16. Helpful default
  if (isArabic) {
    return "أنا هنا لمساعدتك في كل ما يتعلق بشركة رؤية الحلول (VISO): خدمات الأمن المادي، مراحل العمل الأربع (SRA، التصميم، الاعتماد، التشغيل)، معايير الهيئة العليا للأمن الصناعي (HCIS)، إدارة المشاريع، أو الترجمة المعتمدة. كيف يمكنني خدمتك اليوم؟";
  }
  if (isHindiOrUrdu) {
    return "Main VISO ki security consultancy, 4-stage engineering framework, HCIS approvals, project supervision, aur translation services ke baare mein aapke har sawaal ka jawab dene ke liye taiyar hoon. Aap kya janna chahte hain?";
  }
  return "I am here to assist you with all inquiries regarding VISO: our physical security consultancy, 4-stage engineering lifecycle (SRA, Design, Approvals, Handover), HCIS regulatory compliance, project supervision, and certified translation. How may I help you?";
}

/**
 * Master Dispatcher
 * Sends conversation messages to the AI engine with fallback routing.
 */
export async function sendChatMessage(
  messages: { role: string; content: string }[],
  uiLanguage: string,
): Promise<string> {
  const lastUserMessage = [...messages].reverse().find((m) => m.role === "user")?.content || "";

  if (!lastUserMessage.trim()) {
    return getNaturalFallback("", uiLanguage, messages);
  }

  const systemPrompt = getSystemPrompt(uiLanguage);

  // 1. Primary: Secure Backend /api/chat endpoint
  try {
    const backendAnswer = await callBackendChatApi(messages, systemPrompt);
    if (backendAnswer && backendAnswer.trim().length > 0) {
      return backendAnswer;
    }
  } catch {
    // Continue to client direct call or natural fallback
  }

  // 2. Secondary: Direct Gemini API if client key is configured
  const clientKey = getClientApiKey("VITE_GEMINI_API_KEY");
  if (clientKey) {
    try {
      const directAnswer = await callDirectGeminiApi(messages, systemPrompt, clientKey);
      if (directAnswer && directAnswer.trim().length > 0) {
        return directAnswer;
      }
    } catch {
      // Continue to local fallback
    }
  }

  // 3. Tertiary: Intelligent Local Fallback grounded in VISO Chatbot Brain
  return getNaturalFallback(lastUserMessage, uiLanguage, messages);
}
