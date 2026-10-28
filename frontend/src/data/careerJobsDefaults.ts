import { CAREER_JOB_LONG_DESCRIPTIONS } from "./careerJobLongDescriptions";

export type CareerJob = {
  id: string;
  title: string;
  department: string;
  type: string;
  location: string;
  /** Short summary shown in the role list. */
  description: string;
  /** Full posting (paragraphs separated by blank lines). */
  longDescription?: string;
  badges?: string[];
};

export type CareerJobRecord = {
  id: string;
  title: string;
  department: string;
  location: string;
  type: string;
  description: string;
  longDescription?: string;
  badges: string[];
  published: boolean;
};

export type CareerPageCmsContent = {
  rolesEyebrow: string;
  rolesTitle: string;
  rolesDescription: string;
  processTitle: string;
  processDescription: string;
  jobs: CareerJobRecord[];
};

export const DEFAULT_CAREER_PAGE_CMS: CareerPageCmsContent = {
  rolesEyebrow: "Open Positions",
  rolesTitle: "Roles that shape security",
  rolesDescription: "Select a role to apply. Our HR team reviews every submission carefully.",
  processTitle: "How to apply",
  processDescription:
    "A straightforward process — browse open roles, submit your application, and our HR team will follow up.",
  jobs: [],
};

// Filled after DEFAULT_CAREER_JOBS is defined
export function buildDefaultCareerPageCms(): CareerPageCmsContent {
  return {
    ...DEFAULT_CAREER_PAGE_CMS,
    jobs: DEFAULT_CAREER_JOBS.map((j) => ({ ...j })),
  };
}

export const DEFAULT_CAREER_JOBS: CareerJobRecord[] = [
  {
    id: "civil",
    title: "Civil Engineer",
    department: "Engineering & Infrastructure",
    location: "Riyadh / Site Operations, KSA",
    type: "Full-Time",
    description:
      "Lead structural security engineering, perimeter blast-mitigation design, anti-ram barrier specifications, and civil infrastructure compliance aligned with HCIS SEC directives across mission-critical facilities.",
    badges: ["HCIS SEC", "Blast Resistance", "Perimeter Infrastructure"],
    published: true,
  },
  {
    id: "planning",
    title: "Planning Engineer",
    department: "Project Controls & Scheduling",
    location: "Riyadh, KSA",
    type: "Full-Time",
    description:
      "Develop and maintain master project schedules using Primavera P6, analyze EPC milestones and critical paths, and coordinate interdisciplinary engineering deliverables for high-security infrastructure programs.",
    badges: ["Primavera P6", "EPC Milestones", "Critical Path Scheduling"],
    published: true,
  },
  {
    id: "electrical",
    title: "Electrical Engineer",
    department: "Security Systems Engineering",
    location: "Dammam / Eastern Province, KSA",
    type: "Full-Time",
    description:
      "Design and supervise low-current electrical security architecture, video surveillance systems (VSS/CCTV), perimeter intrusion detection (PIDS), and dual-redundant backup power systems adhering to HCIS SEC-03 and SEC-04.",
    badges: ["Low-Current Systems", "CCTV / VSS Matrix", "PIDS Security"],
    published: true,
  },
  {
    id: "doc",
    title: "Document Controller",
    department: "Projects / Document Control",
    location: "Riyadh, KSA",
    type: "Full-Time",
    description:
      "Manage project documentation, track revisions, and oversee the correspondence flow between internal teams and clients using our proprietary DMS platform.",
    badges: ["DMS Platform", "Revision Tracking", "ISO Standards"],
    published: true,
  },
  {
    id: "security",
    title: "Senior Security Officer",
    department: "Operations",
    location: "Jeddah, KSA",
    type: "Full-Time",
    description:
      "Ensure the highest level of physical security for premium assets. Manage field operations and oversee junior officers across critical sites.",
    badges: ["Physical Security", "Site Defense", "Asset Protection"],
    published: true,
  },
  {
    id: "hr",
    title: "HR Specialist",
    department: "Human Resources",
    location: "Riyadh, KSA",
    type: "Full-Time",
    description:
      "Drive employee engagement, handle onboarding, and manage records in our internal ESS platform while supporting growth across the Kingdom.",
    badges: ["Talent Acquisition", "ESS Platform", "People Operations"],
    published: true,
  },
  {
    id: "security_engineer",
    title: "Security Engineer",
    department: "Security Systems Engineering",
    location: "Riyadh / Eastern Province, KSA",
    type: "Full-Time",
    description:
      "Design and supervise integrated physical security architectures, HCIS compliance directives, threat risk assessments (SRA), CCTV/VSS, access control, and perimeter protection for mission-critical facilities.",
    badges: ["HCIS Directives", "SRA Assessment", "Systems Architecture"],
    published: true,
  },
].map((job) => ({
  ...job,
  longDescription: CAREER_JOB_LONG_DESCRIPTIONS[job.id] ?? job.description,
}));
