/**
 * VISO Project Management & Supervision Knowledge File
 * Derived from the official /supervision route on the VISO website.
 */
export const SUPERVISION_KNOWLEDGE = {
  overview: `
VISO delivers end-to-end Project Management and Technical Supervision services across Saudi Arabia.
Our senior engineering teams oversee complex water transmission networks, industrial facilities,
and critical national infrastructure—ensuring rigorous compliance with SAIS (Supreme Authority for Industrial Security),
HCIS, and Saudi Water Authority (SWA) engineering standards from mobilization to final operational handover.
  `.trim(),

  lifecycleSteps: [
    {
      num: "01",
      title: "Planning & Mobilization",
      description:
        "Project planning, baseline scheduling, mobilization audits, and stakeholder alignment.",
    },
    {
      num: "02",
      title: "Progress & Cost Monitoring",
      description:
        "Continuous progress tracking, earned value monitoring, and cost baseline control.",
    },
    {
      num: "03",
      title: "Contractor Management",
      description:
        "Technical and commercial coordination, interface management, and issue resolution.",
    },
    {
      num: "04",
      title: "Quality & HSE Oversight",
      description:
        "Rigorous site supervision, safety audits, specification enforcement, and SAIS requirements.",
    },
    {
      num: "05",
      title: "Risk & Interface Control",
      description:
        "Proactive bottleneck identification, mitigation strategy execution, and interface resolution.",
    },
    {
      num: "06",
      title: "Testing, Commissioning & Closeout",
      description:
        "Testing, commissioning validation, SAIS compliance sign-off, and final handover.",
    },
  ],

  featuredProjects: [
    {
      title: "Khobar Water Transmission System (WTS)",
      client: "Saudi Water Authority (SWA)",
      location: "Al Khobar, Eastern Province",
      scope:
        "End-to-end technical supervision, contractor interface management, quality assurance, progress monitoring, and SAIS directive compliance for the Khobar WTS network.",
      status: "Ongoing",
    },
    {
      title: "Jubail Desalination Plant",
      client: "Saudi Water Authority (SWA)",
      location: "Jubail Industrial City",
      scope:
        "Comprehensive engineering oversight, progress and cost monitoring, contractor management, risk mitigation, quality & HSE control, and commissioning supervision for Jubail Desalination operations.",
      status: "Ongoing",
    },
    {
      title: "Jubail Water Transmission Line – AB, Q & C",
      client: "WTCO",
      location: "Jubail Region",
      scope:
        "Specialized construction supervision across sections AB, Q & C, managing interfaces, technical reviews, commercial coordination, and ensuring compliance with SAIS and SWA specifications.",
      status: "Ongoing",
    },
    {
      title: "Upgradation of CCTV System",
      client: "The Ritz-Carlton",
      location: "Riyadh",
      scope:
        "Engineering design and full on-site supervision for luxury hospitality security infrastructure.",
      status: "Completed",
    },
  ],
};
