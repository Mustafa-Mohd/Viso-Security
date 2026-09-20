export type CapabilityTopic = {
  slug: string;
  label: string;
  category: "Assessment" | "Design" | "Delivery" | "Compliance" | "Systems";
  headline: string;
  summary: string;
  body: string[];
  relatedRoute:
    | "/security"
    | "/translation"
    | "/certificates"
    | "/about"
    | "/clients"
    | "/contact"
    | "/regulatory/sais"
    | "/regulatory/moi"
    | "/regulatory/hcis";
  relatedLabel: string;
  /** Hero image URL — leave unset for placeholder UI */
  heroImageUrl?: string;
  /** Optional inline images (up to 2) below body copy */
  galleryImageUrls?: string[];
};

const accentByCategory: Record<CapabilityTopic["category"], string> = {
  Assessment: "#1B4F72",
  Design: "#0E7C66",
  Delivery: "#B8860B",
  Compliance: "#8B3A2A",
  Systems: "#5B4B8A",
};

export function getTopicAccent(category: CapabilityTopic["category"]) {
  return accentByCategory[category];
}

const GALLERY_BY_CATEGORY: Record<
  CapabilityTopic["category"],
  [string, string]
> = {
  Assessment: [
    "/images/explore/gallery-assessment-1.jpg",
    "/images/explore/gallery-assessment-2.jpg",
  ],
  Design: [
    "/images/explore/gallery-design-1.jpg",
    "/images/explore/gallery-design-2.jpg",
  ],
  Delivery: [
    "/images/explore/gallery-delivery-1.jpg",
    "/images/explore/gallery-delivery-2.jpg",
  ],
  Compliance: [
    "/images/explore/gallery-compliance-1.jpg",
    "/images/explore/gallery-compliance-2.jpg",
  ],
  Systems: [
    "/images/explore/gallery-systems-1.jpg",
    "/images/explore/gallery-systems-2.jpg",
  ],
};

function withExploreMedia(topic: CapabilityTopic): CapabilityTopic {
  return {
    ...topic,
    heroImageUrl: `/images/explore/${topic.slug}-hero.jpg`,
    galleryImageUrls: GALLERY_BY_CATEGORY[topic.category],
  };
}

const CAPABILITY_TOPICS_BASE: CapabilityTopic[] = [
  {
    slug: "risk-assessment",
    label: "Risk Assessment",
    category: "Assessment",
    headline: "Structured security risk assessment",
    summary: "Identify threats, vulnerabilities and operational impacts before design commitments are made.",
    body: [
      "VISO leads structured risk workshops, site reviews and threat modelling aligned with national expectations and client governance.",
      "Findings are translated into clear risk registers, mitigation priorities and design inputs for the next project stage.",
    ],
    relatedRoute: "/security",
    relatedLabel: "View security framework",
  },
  {
    slug: "preliminary-design",
    label: "Preliminary Design",
    category: "Design",
    headline: "From risk to protection philosophy",
    summary: "Concept layouts, zoning logic and technology direction that shape the security story of your asset.",
    body: [
      "We develop preliminary CCTV coverage, access zoning, control-room concepts and integration assumptions.",
      "Outputs support stakeholder alignment and authority engagement early in the project lifecycle.",
    ],
    relatedRoute: "/security",
    relatedLabel: "Explore design stages",
  },
  {
    slug: "detailed-design",
    label: "Detailed Design",
    category: "Design",
    headline: "Engineering-grade security design packages",
    summary: "Specifications, drawings and BOQs ready for procurement and construction.",
    body: [
      "Detailed design covers equipment schedules, cable routes, interface definitions and compliance checkpoints.",
      "Our packages are built for contractor execution and independent review.",
    ],
    relatedRoute: "/security",
    relatedLabel: "See delivery model",
  },
  {
    slug: "operational-readiness",
    label: "Operational Readiness",
    category: "Delivery",
    headline: "Systems that work on day one",
    summary: "Testing, training and handover planning so security operations start with confidence.",
    body: [
      "We support FAT/SAT planning, procedure development and operational acceptance criteria.",
      "Handover documentation connects engineering deliverables to the client's operating model.",
    ],
    relatedRoute: "/security",
    relatedLabel: "Operational readiness",
  },
  {
    slug: "sais-compliance",
    label: "SAIS Compliance",
    category: "Compliance",
    headline: "Alignment with Saudi security requirements",
    summary: "Navigate SAIS and regulatory pathways with documented compliance evidence.",
    body: [
      "VISO coordinates design submissions, technical clarifications and authority feedback loops.",
      "We help owners maintain traceability from risk assessment through approval.",
    ],
    relatedRoute: "/regulatory/sais",
    relatedLabel: "SAIS authority overview",
  },
  {
    slug: "hcis-compliance",
    label: "HCIS Directives & MOI",
    category: "Compliance",
    headline: "High Commission for Industrial Security (HCIS) & MOI Governance",
    summary: "Comprehensive engineering alignment with Saudi HCIS Directives SEC-01 through SEC-07 and Ministry of Interior high-security statutory standards.",
    body: [
      "VISO leads end-to-end regulatory engineering across HCIS Directives SEC-01 (General Requirements), SEC-02 (Barriers), SEC-03 (Access Control), SEC-04 (CCTV), SEC-05 (IDS), SEC-06 (Control Centers), and SEC-07 (Cyber-Physical).",
      "We assemble rigorous authority submission packs, coordinate technical workshops with regulatory officers, and defend security architecture submittals to secure statutory Class-1 approvals without delay.",
    ],
    relatedRoute: "/regulatory/hcis",
    relatedLabel: "Explore HCIS Directives",
  },
  {
    slug: "physical-security",
    label: "Physical Security",
    category: "Design",
    headline: "Integrated physical protection",
    summary: "Perimeter, facade, lighting and hostile-vehicle considerations in one coherent plan.",
    body: [
      "Physical measures are integrated with electronic systems rather than treated as standalone items.",
      "Design choices balance aesthetics, operations and maintainability.",
    ],
    relatedRoute: "/security",
    relatedLabel: "Physical security consulting",
  },
  {
    slug: "project-management",
    label: "Project Management",
    category: "Delivery",
    headline: "Security workstreams under control",
    summary: "Planning, reporting and coordination across consultants, contractors and authorities.",
    body: [
      "We run security work packages with clear milestones, RAID logs and interface management.",
      "Owners gain visibility without absorbing day-to-day technical load.",
    ],
    relatedRoute: "/about",
    relatedLabel: "About VISO delivery",
  },
  {
    slug: "security-philosophy",
    label: "Security Philosophy",
    category: "Design",
    headline: "The strategic narrative of protection",
    summary: "A concise philosophy that guides every design decision and investment trade-off.",
    body: [
      "Philosophy documents explain deterrence, detection, delay and response across the site.",
      "They align executives, designers and operators on what “secure” means for the project.",
    ],
    relatedRoute: "/security",
    relatedLabel: "Security methodology",
  },
  {
    slug: "owners-engineer",
    label: "Owner's Engineer",
    category: "Delivery",
    headline: "Independent technical advocacy",
    summary: "Represent the owner's interests through design review and contractor oversight.",
    body: [
      "We challenge designs, witness testing and verify that installed systems match intent.",
      "This role is critical on complex campuses and national infrastructure.",
    ],
    relatedRoute: "/clients",
    relatedLabel: "Who we serve",
  },
  {
    slug: "construction-monitoring",
    label: "Construction Monitoring",
    category: "Delivery",
    headline: "Security integrity during build",
    summary: "Site inspections and RFIs so installations match approved designs.",
    body: [
      "Our engineers attend key milestones, review submittals and flag deviations early.",
      "Monitoring reduces costly rework before commissioning.",
    ],
    relatedRoute: "/security",
    relatedLabel: "Construction phase",
  },
  {
    slug: "concept-of-design",
    label: "Concept of Design",
    category: "Design",
    headline: "Early design narrative",
    summary: "High-level system concepts that frame scope, budget and schedule conversations.",
    body: [
      "Concept packages illustrate coverage strategies, technology stacks and integration points.",
      "They are the bridge between risk assessment and preliminary engineering.",
    ],
    relatedRoute: "/security",
    relatedLabel: "Concept stage",
  },
  {
    slug: "threat-analysis",
    label: "Threat Analysis",
    category: "Assessment",
    headline: "Evidence-based threat scenarios",
    summary: "Scenario development grounded in site context, sector intelligence and client appetite.",
    body: [
      "Threat analysis informs asset criticality, layering strategies and performance requirements.",
      "We document assumptions so designs remain defensible under audit.",
    ],
    relatedRoute: "/security",
    relatedLabel: "Assessment services",
  },
  {
    slug: "system-architecture",
    label: "System Architecture",
    category: "Systems",
    headline: "Integrated security technology stack",
    summary: "Platforms, networks and interfaces designed as one ecosystem.",
    body: [
      "Architecture covers VMS, ACS, IDS, PSIM and cybersecurity interfaces at a high level.",
      "We prevent siloed systems that fail under operational stress.",
    ],
    relatedRoute: "/security",
    relatedLabel: "Systems consulting",
  },
  {
    slug: "access-control",
    label: "Access Control",
    category: "Systems",
    headline: "Identity and movement across the site",
    summary: "Zoning, credentials and workflow design for people, vehicles and materials.",
    body: [
      "Access control design spans turnstiles, barriers, visitor management and integration with HR systems.",
      "We align logical access rules with physical layout.",
    ],
    relatedRoute: "/security",
    relatedLabel: "Access & perimeter",
  },
  {
    slug: "cctv-coverage",
    label: "CCTV Coverage",
    category: "Systems",
    headline: "Surveillance that meets intent",
    summary: "Camera placement, lens selection and storage design for real investigations.",
    body: [
      "Coverage studies use scene-specific performance targets—not generic dot maps.",
      "We account for lighting, privacy zones and control-room ergonomics.",
    ],
    relatedRoute: "/security",
    relatedLabel: "CCTV design",
  },
  {
    slug: "fat-sat",
    label: "FAT & SAT",
    category: "Delivery",
    headline: "Factory and site acceptance testing",
    summary: "Structured test scripts that prove systems perform before handover.",
    body: [
      "We prepare test plans, witness execution and document punch lists.",
      "SAT closes the loop between design intent and installed reality.",
    ],
    relatedRoute: "/security",
    relatedLabel: "Testing & commissioning",
  },
  {
    slug: "regulatory-coordination",
    label: "Regulatory Coordination",
    category: "Compliance",
    headline: "Authority engagement done properly",
    summary: "Submission packs, meeting support and response tracking with regulators.",
    body: [
      "VISO helps translate technical designs into authority-friendly documentation.",
      "Coordination reduces approval cycle time and rework.",
    ],
    relatedRoute: "/regulatory/moi",
    relatedLabel: "MOI & governance",
  },
  {
    slug: "technical-oversight",
    label: "Technical Oversight",
    category: "Delivery",
    headline: "Senior engineering judgement on tap",
    summary: "Peer review, design audits and escalation support for critical decisions.",
    body: [
      "Oversight brings independent eyes to contractor proposals and value engineering.",
      "We protect the owner when schedules pressure quality.",
    ],
    relatedRoute: "/about",
    relatedLabel: "Our expertise",
  },
  {
    slug: "site-supervision",
    label: "Site Supervision",
    category: "Delivery",
    headline: "On-site security engineering presence",
    summary: "Dedicated supervision during installation and commissioning peaks.",
    body: [
      "Supervisors verify workmanship, cable management and as-built conditions.",
      "They are the owner's voice on the construction floor.",
    ],
    relatedRoute: "/security",
    relatedLabel: "Site services",
  },
  {
    slug: "handover-support",
    label: "Handover Support",
    category: "Delivery",
    headline: "Clean transition to operations",
    summary: "O&M manuals, training and warranty documentation packaged for the client.",
    body: [
      "Handover includes asset registers, spare parts lists and operator quick guides.",
      "We ensure security teams inherit systems they can actually run.",
    ],
    relatedRoute: "/contact",
    relatedLabel: "Discuss your project",
  },
];

export const CAPABILITY_TOPICS: CapabilityTopic[] =
  CAPABILITY_TOPICS_BASE.map(withExploreMedia);

export function getTopicBySlug(slug: string): CapabilityTopic | undefined {
  return CAPABILITY_TOPICS.find((t) => t.slug === slug);
}

export const CAPABILITY_TOPIC_LABELS = CAPABILITY_TOPICS.map((t) => t.label);
