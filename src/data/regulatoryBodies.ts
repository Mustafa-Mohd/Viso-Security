export type RegulatorySlug = "moi" | "sais" | "hcis" | "neom" | "api780";

export type RegulatoryBody = {
  slug: RegulatorySlug;
  shortName: string;
  fullName: string;
  arabicName?: string;
  tagline: string;
  accent: string;
  overview: string;
  keyPoints: { title: string; description: string }[];
  visoSupport: string[];
  lifecycleStages?: { step: string; title: string; description: string }[];
  relatedSlugs: RegulatorySlug[];
  /** Card thumbnail on /regulatory hub — leave unset for placeholder */
  cardImageUrl?: string;
  /** Hero banner on detail page */
  heroImageUrl?: string;
  /** Optional secondary visual (e.g. lifecycle diagram) */
  secondaryImageUrl?: string;
};

export const REGULATORY_HUB_BANNER = "/images/regulatory/hub-banner.jpg";

const REGULATORY_BODIES_BASE: RegulatoryBody[] = [
  {
    slug: "moi",
    shortName: "MOI",
    fullName: "Ministry of Interior",
    arabicName: "وزارة الداخلية",
    tagline: "Kingdom-wide security governance and policy leadership",
    accent: "#1B3A5C",
    overview:
      "The Ministry of Interior (MOI) is the central government authority responsible for internal security, public safety, and the strategic oversight of security sectors in the Kingdom of Saudi Arabia. Industrial and critical-infrastructure protection is coordinated through specialized bodies under MOI leadership—including the Supreme Authority for Industrial Security (SAIS) and its predecessor framework, the High Commission for Industrial Security (HCIS).",
    keyPoints: [
      {
        title: "Strategic oversight",
        description:
          "MOI sets national direction for security policy and coordinates major security institutions, including industrial security regulation for vital sectors.",
      },
      {
        title: "Industrial security linkage",
        description:
          "The industrial security regulator (SAIS, formerly HCIS) reports within the MOI ecosystem and issues Security Directives (SEC) for facilities under its jurisdiction.",
      },
      {
        title: "Licensed security ecosystem",
        description:
          "Private security activities, training pathways, and related MOI-regulated services operate alongside—but are distinct from—the SAIS/HCIS engineering approval process for industrial ISS.",
      },
      {
        title: "National resilience",
        description:
          "MOI’s mandate connects border security, public security forces, civil defense coordination, and protection of critical assets that underpin Vision 2030 programs.",
      },
    ],
    visoSupport: [
      "Align client security programs with MOI-directed industrial security policy through SAIS-stage submissions.",
      "Coordinate authority engagement, documentation discipline, and proof-of-compliance packages.",
      "Support owners operating across multiple MOI-regulated and sector-specific requirements.",
    ],
    relatedSlugs: ["sais", "hcis"],
  },
  {
    slug: "sais",
    shortName: "SAIS",
    fullName: "Supreme Authority for Industrial Security",
    arabicName: "الهيئة العليا للأمن الصناعي",
    tagline: "Regulator for industrial security, safety & fire protection",
    accent: "#0E6B5C",
    overview:
      "The Supreme Authority for Industrial Security (SAIS) is the national regulator responsible for industrial security, industrial safety, and fire protection requirements at petroleum, petrochemical, energy, utilities, and other designated critical facilities across Saudi Arabia. SAIS continues the mission formerly carried out under the High Commission for Industrial Security (HCIS), including the Security Directives (SEC) series that define minimum requirements for fencing, lighting, integrated security systems (SEC-05), cyber security (SEC-12), project management (SEC-14), and more.",
    keyPoints: [
      {
        title: "SEC directives",
        description:
          "Facilities under SAIS jurisdiction must implement applicable SEC requirements—covering physical protection, integrated security systems (IDAS, ACS, VSS/VASS), power, communications, and operational procedures.",
      },
      {
        title: "Approved service providers",
        description:
          "Security consultants and contractors working on SAIS-regulated designs and implementations must be approved/qualified in line with directive requirements (e.g., SEC-14 project management provisions).",
      },
      {
        title: "Evidence-based design",
        description:
          "Submissions are built on Security Risk Assessment (SRA), facility classification, business criteria analysis, and staged design packages with proof of compliance (PoC).",
      },
      {
        title: "Gated approvals",
        description:
          "Authority approval is required at defined stages before procurement, installation, or commissioning of security infrastructure—preventing non-compliant spend.",
      },
    ],
    lifecycleStages: [
      {
        step: "01",
        title: "Security Risk Assessment & Concept Design",
        description:
          "SRA, facility classification, protection philosophy, and concept design (CoD) aligned with SEC-01 and related directives.",
      },
      {
        step: "02",
        title: "Preliminary Design",
        description:
          "Preliminary engineering layouts, system concepts, and submission packages for authority review.",
      },
      {
        step: "03",
        title: "Detailed Design",
        description:
          "Construction-ready drawings, specifications, BOQs, and interface definitions for integrated security systems.",
      },
      {
        step: "04",
        title: "Testing, Commissioning & Handover",
        description:
          "FAT/SAT, operational readiness, procedures, training artefacts, and final completion reporting.",
      },
    ],
    visoSupport: [
      "End-to-end SAIS consultancy from SRA through operational readiness.",
      "Preparation and coordination of authority submissions and PoC documentation.",
      "Owner’s engineer and construction monitoring for SEC-compliant delivery.",
    ],
    relatedSlugs: ["moi", "hcis"],
  },
  {
    slug: "hcis",
    shortName: "HCIS",
    fullName: "High Commission for Industrial Security",
    arabicName: "الهيئة العليا للأمن الصناعي (الاسم السابق)",
    tagline: "Legacy framework — now continued as SAIS",
    accent: "#B8860B",
    overview:
      "The High Commission for Industrial Security (HCIS) was the established national body for regulating security, safety, and fire protection at industrial and critical facilities in Saudi Arabia. Royal decrees and Council of Ministers regulations positioned HCIS under the Ministry of Interior to protect petroleum, industrial, and service sectors. Today, the same regulatory mission is carried forward by the Supreme Authority for Industrial Security (SAIS). Project teams still frequently reference “HCIS directives,” “HCIS-approved consultants,” and SEC document sets issued under this framework.",
    keyPoints: [
      {
        title: "HCIS → SAIS continuity",
        description:
          "SAIS is the current naming for the industrial security authority; HCIS documents and approval stages remain the practical reference on many active projects.",
      },
      {
        title: "SEC directive library",
        description:
          "SEC-01 (general requirements) through sector-specific SECs define fencing, gates, lighting, integrated systems, devices, power, communications, cyber, and operations.",
      },
      {
        title: "Twelve-plus strategic sectors",
        description:
          "HCIS/SAIS oversight spans oil & gas, petrochemicals, power, water, mining, ports, industrial cities, and other nationally significant infrastructure.",
      },
      {
        title: "Naming note (HAIS / HCIS)",
        description:
          "If you encounter “HAIS” in conversation or legacy notes, it usually refers to HCIS/SAIS industrial security—not a separate industrial regulator. For training institutes under MOI (e.g., HISS at King Fahd Security College), those are distinct education bodies.",
      },
    ],
    visoSupport: [
      "Translate legacy HCIS terminology into current SAIS submission pathways.",
      "Maintain SEC traceability from SRA through FAT/SAT on HCIS-era and SAIS-era projects.",
      "Support operators upgrading facilities originally approved under HCIS nomenclature.",
    ],
    relatedSlugs: ["sais", "moi"],
  },
  {
    slug: "neom",
    shortName: "NEOM",
    fullName: "NEOM Public Safety",
    tagline: "Security Consultancy & Compliance Services",
    accent: "#6B5B95",
    overview:
      "At Vision of Solutions for Security Consultations Company Ltd. (VISO), we recognize the importance of establishing robust, intelligent and integrated security infrastructure to support NEOM's vision of developing safe, secure, sustainable and technologically advanced communities.\n\nAs a Saudi-based, SAIS-approved security consultancy, VISO provides specialized security engineering and consultancy services to support projects in meeting applicable NEOM Public Safety requirements, relevant Saudi Arabian regulations and recognized international security standards.",
    keyPoints: [
      {
        title: "Integrated Physical Security Systems",
        description:
          "Providing technical consultancy and design reviews covering CCTV and video management systems, access control, perimeter protection, intrusion detection, security communications and associated security infrastructure. Our reviews consider system interoperability, monitoring requirements and integration with the relevant NEOM Public Safety operational infrastructure.",
      },
      {
        title: "Security Systems Compliance and Coordination",
        description:
          "Supporting coordination among project stakeholders, engineering consultants, security contractors and relevant authorities to identify applicable security requirements, manage technical interfaces and address compliance observations.",
      },
      {
        title: "Operational Readiness and Security Verification",
        description:
          "Providing independent technical reviews of installed security systems, commissioning documentation, integrated system testing and operational readiness to support the handover of security infrastructure.",
      },
      {
        title: "Security Engineering and Design Compliance",
        description:
          "Reviewing security engineering concepts, preliminary designs and detailed security system designs against applicable project-specific NEOM Public Safety requirements, relevant Saudi regulations and recognized international standards.",
      },
    ],
    lifecycleStages: [
      {
        step: "01",
        title: "Security Threat & Risk Assessment",
        description:
          "Conducting comprehensive Security Threat & Risk Assessments (STRA) to identify potential threats, evaluate vulnerabilities and recommend proportionate security measures.",
      },
      {
        step: "02",
        title: "Security Strategy",
        description:
          "Developing security strategies to protect critical assets, infrastructure, personnel and operations in alignment with NEOM Public Safety requirements.",
      },
    ],
    visoSupport: [
      "Follows Security Standard Procedure NEOM-NSE-PRC-001 & Stage Deliverables Procedure NEOM-NEN-PRC-005.",
      "Integrating security considerations throughout the project lifecycle, from initial assessments to design reviews.",
      "Compliance verification and operational readiness assessments for NEOM projects.",
    ],
    relatedSlugs: ["moi", "sais"],
  },
  {
    slug: "api780",
    shortName: "API 780",
    fullName: "API Standard 780 Methodology",
    tagline: "Security Risk Assessment (SRA) for the Petroleum & Petrochemical Industries",
    accent: "#0055A4",
    overview:
      "Protecting Critical Energy Infrastructure Through Comprehensive Security Risk Assessment.\n\nAt Vision of Solutions for Security Consultations Company Ltd. (VISO), we specialize in providing comprehensive Security Risk Assessment (SRA) consultancy services to the petroleum, petrochemical, oil and gas, energy and critical infrastructure sectors.\n\nAs a Saudi Arabian SAIS-approved security consultancy, VISO applies a systematic, risk-based approach to identifying security threats, evaluating vulnerabilities, assessing potential consequences and developing effective security risk mitigation strategies.\n\nOur methodology is based on internationally recognized principles, including API Standard 780 – Security Risk Assessment Methodology for the Petroleum and Petrochemical Industries, while considering applicable Saudi Arabian security regulations, SAIS requirements and project-specific security standards.\n\nAPI Standard 780 provides an industry-specific methodology for evaluating security risks associated with petroleum and petrochemical facilities, including threats ranging from theft and sabotage to terrorism.",
    keyPoints: [
      {
        title: "Asset Identification and Characterization",
        description:
          "Identification and evaluation of critical assets, infrastructure, operational processes and personnel to determine their importance, criticality and potential consequences arising from security incidents.",
      },
      {
        title: "Threat Assessment",
        description:
          "Systematic identification and evaluation of potential internal and external security threats, including unauthorized access, theft, sabotage, insider threats, deliberate attacks and emerging security challenges.",
      },
      {
        title: "Vulnerability Assessment",
        description:
          "Evaluation of existing physical security infrastructure, security systems, operational procedures and protective measures to identify weaknesses that could be exploited by potential threats.",
      },
      {
        title: "Security Risk Analysis and Evaluation",
        description:
          "Analysis of identified threat scenarios, vulnerabilities and potential consequences to establish security risk levels, prioritize critical risks and support informed management decisions.",
      },
    ],
    lifecycleStages: [
      {
        step: "05",
        title: "Risk Mitigation and Security Recommendations",
        description:
          "Development of practical, proportionate and cost-effective security recommendations, including physical protection measures, electronic security systems, procedural improvements and operational security enhancements.",
      },
      {
        step: "06",
        title: "Residual Risk Assessment and Security Strategy",
        description:
          "Evaluation of the remaining risks following proposed security improvements, supporting the development of an integrated security strategy and management decisions regarding risk treatment and acceptance.",
      },
    ],
    visoSupport: [
      "Oil refineries, petrochemical complexes, and oil and gas processing plants.",
      "Bulk petroleum storage terminals and tank farms.",
      "Pipeline networks, pumping stations, export terminals, ports and marine facilities.",
      "Power generation, critical utility infrastructure, greenfield and brownfield developments.",
    ],
    relatedSlugs: ["sais", "moi"],
  },
];

function withRegulatoryMedia(body: RegulatoryBody): RegulatoryBody {
  return {
    ...body,
    cardImageUrl: `/images/regulatory/${body.slug}-card.jpg`,
    heroImageUrl: `/images/regulatory/${body.slug}-hero.jpg`,
    secondaryImageUrl: `/images/regulatory/${body.slug}-secondary.jpg`,
  };
}

export const REGULATORY_BODIES: RegulatoryBody[] =
  REGULATORY_BODIES_BASE.map(withRegulatoryMedia);

export function normalizeRegulatorySlug(raw: string): RegulatorySlug | undefined {
  const s = raw.toLowerCase();
  if (s === "hais") return "hcis";
  if (s === "moi" || s === "sais" || s === "hcis" || s === "neom" || s === "api780") return s;
  return undefined;
}

export function getRegulatoryBody(slug: string): RegulatoryBody | undefined {
  const normalized = normalizeRegulatorySlug(slug);
  if (!normalized) return undefined;
  return REGULATORY_BODIES.find((b) => b.slug === normalized);
}
