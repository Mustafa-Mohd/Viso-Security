/**
 * VISO Services & Engineering Lifecycle Knowledge File
 */
export const SERVICES_KNOWLEDGE = {
  the4Stages: [
    {
      stage: "Stage 01",
      nameEn: "Security Risk Assessment (SRA)",
      nameAr: "تقييم المخاطر الأمنية (SRA)",
      summary:
        "Comprehensive site surveys, asset characterization, threat profiling (Design Basis Threat - DBT), vulnerability analysis, and risk ranking (SEC 1 to 4) compliant with HCIS SEC-01 directives.",
      deliverables: [
        "Asset Criticality Rating (SEC Level 1-4)",
        "Design Basis Threat (DBT) Report",
        "Vulnerability & Scenario Matrix",
        "Formal HCIS Stage 1 Submittal Dossier",
      ],
    },
    {
      stage: "Stage 02",
      nameEn: "Concept & Detailed Security Design (CDS / DDS)",
      nameAr: "التصميم المفاهيمي والتفصيلي (CDS / DDS)",
      summary:
        "Developing the master security plan, conceptual layout (CDS), and detailed engineering drawings (DDS) at 30%, 60%, 90%, and 100% completion milestones.",
      deliverables: [
        "Security Master Plan & Concept Design Stage (CDS)",
        "Detailed Design Stage (DDS) Schematics & CAD Layouts",
        "Cable Schedules, Riser Diagrams & Conduit Routing",
        "Comprehensive Bill of Quantities (BOQ) & Tender Packages",
      ],
    },
    {
      stage: "Stage 03",
      nameEn: "Security Design Review & Authority Approval",
      nameAr: "مراجعة واعتماد التصاميم وموافقة الهيئة",
      summary:
        "Independent technical review of contractor shop drawings, vendor qualifications, compliance verification, and liaison for HCIS Stage 3 approval.",
      deliverables: [
        "Independent Review of EPC Shop Drawings",
        "Vendor & Equipment Pre-qualification",
        "Regulatory Gap Remediation",
        "Official HCIS Stage 3 Approval Documentation",
      ],
    },
    {
      stage: "Stage 04",
      nameEn: "Validation, Testing & Operational Handover",
      nameAr: "الاختبارات، التحقق، والجاهزية التشغيلية",
      summary:
        "On-site verification, Factory Acceptance Testing (FAT), Site Acceptance Testing (SAT), System Integration Testing (SIT), and securing HCIS Stage 4 operational permits.",
      deliverables: [
        "Site Acceptance Testing (SAT) Verification",
        "System Integration Testing (SIT)",
        "Snag List Verification & As-Built Approvals",
        "Final HCIS Stage 4 Operational Licensing",
      ],
    },
  ],

  technicalSystems: [
    {
      name: "Video Surveillance Systems (VSS / CCTV)",
      description:
        "High-definition IP cameras, thermal perimeter sensors, AI video analytics (tripwire, loitering, crowd tracking), and HCIS-compliant storage retention (120+ days).",
    },
    {
      name: "Access Control Systems (ACS) & Biometrics",
      description:
        "Biometric facial/fingerprint verification, smart cards, speed gates, turnstiles, anti-passback controls, and visitor management.",
    },
    {
      name: "Perimeter Intrusion Detection Systems (PIDS)",
      description:
        "Fiber-optic fence disturbance sensors, microwave barriers, taut-wire sensors, and ground surveillance radar.",
    },
    {
      name: "Vehicle Inspection Systems (ANPR & UVIS)",
      description:
        "Automatic Number Plate Recognition (ANPR), under-vehicle inspection scanners (UVIS), driver facial capture, and automated roadblock integration.",
    },
    {
      name: "Security Operations Centers (SOC) / C2",
      description:
        "Ergonomic command consoles, video walls, redundant UPS power, and Physical Security Information Management (PSIM) integration.",
    },
    {
      name: "Hostile Vehicle Mitigation (HVM) & Anti-Ram Barriers",
      description:
        "PAS 68 and ASTM F2656 crash-rated hydraulic bollards, wedge barriers, drop-arm beams, and blast walls.",
    },
  ],

  sectorsServed: [
    {
      sector: "Oil & Gas / Petrochemicals",
      description:
        "Refineries, processing plants, chemical hubs, and pipelines compliant with HCIS SEC and Saudi Aramco SACS-002 standards.",
    },
    {
      sector: "Water Transmission & Desalination",
      description:
        "Desalination plants, water pipelines, and reservoirs (e.g. Saudi Water Authority / WTCO projects).",
    },
    {
      sector: "Power & Energy Generation",
      description: "Power substations, transmission grids, and renewable energy assets.",
    },
    {
      sector: "Giga Projects & Urban Developments",
      description:
        "Vision 2030 smart cities and giga developments including NEOM and Red Sea Global.",
    },
    {
      sector: "Defense & Government Facilities",
      description: "Secure government headquarters, defense complexes, and judicial centers.",
    },
    {
      sector: "Ports & Maritime Infrastructure",
      description: "Commercial seaports, dry ports, and coastal installations.",
    },
    {
      sector: "Hospitality & Commercial Infrastructure",
      description:
        "Luxury hotels, diplomatic missions, and corporate headquarters (e.g., The Ritz-Carlton Riyadh).",
    },
    {
      sector: "Mining & Industrial Cities",
      description:
        "Industrial technology zones under SAIS and MODON regulations across the Kingdom.",
    },
  ],
};
