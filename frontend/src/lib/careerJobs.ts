import type { TFunction } from "i18next";
import { CAREER_JOB_LONG_DESCRIPTIONS } from "../data/careerJobLongDescriptions";
import {
  buildDefaultCareerPageCms,
  type CareerJob,
  type CareerJobRecord,
  type CareerPageCmsContent,
} from "../data/careerJobsDefaults";

const LEGACY_JOB_IDS = [
  "doc",
  "security",
  "hr",
  "security_engineer",
  "civil",
  "planning",
  "electrical",
] as const;

export function parseCareerPageCms(content: unknown): CareerPageCmsContent | null {
  if (!content) return null;
  if (Array.isArray(content)) {
    return {
      ...buildDefaultCareerPageCms(),
      jobs: (content as CareerJobRecord[]).map((job) => ({
        ...job,
        longDescription:
          job.longDescription?.trim() ||
          CAREER_JOB_LONG_DESCRIPTIONS[job.id] ||
          undefined,
      })),
    };
  }
  if (typeof content === "object" && content !== null && "jobs" in content) {
    const raw = content as Partial<CareerPageCmsContent>;
    const defaults = buildDefaultCareerPageCms();
    return {
      rolesEyebrow: raw.rolesEyebrow ?? defaults.rolesEyebrow,
      rolesTitle: raw.rolesTitle ?? defaults.rolesTitle,
      rolesDescription: raw.rolesDescription ?? defaults.rolesDescription,
      processTitle: raw.processTitle ?? defaults.processTitle,
      processDescription: raw.processDescription ?? defaults.processDescription,
      jobs: Array.isArray(raw.jobs)
        ? raw.jobs.map((job) => ({
            ...job,
            longDescription:
              job.longDescription?.trim() ||
              CAREER_JOB_LONG_DESCRIPTIONS[job.id] ||
              undefined,
          }))
        : defaults.jobs,
    };
  }
  return null;
}

export function resolveCareerPageCopy(cms: CareerPageCmsContent | null, t: TFunction) {
  return {
    rolesEyebrow: cms?.rolesEyebrow?.trim() || t("career.roles_eyebrow"),
    rolesTitle: cms?.rolesTitle?.trim() || t("career.roles_title"),
    rolesDescription: cms?.rolesDescription?.trim() || t("career.roles_desc"),
    processTitle: cms?.processTitle?.trim() || t("career.process.title"),
    processDescription: cms?.processDescription?.trim() || t("career.process.desc"),
  };
}

export function resolveCareerJobs(cmsJobs: CareerJobRecord[] | null | undefined, t: TFunction): CareerJob[] {
  // Explicit CMS list (including empty []) — do not fall back to legacy defaults.
  if (Array.isArray(cmsJobs)) {
    return cmsJobs
      .filter((j) => j.published !== false && j.title?.trim())
      .map((j) => ({
        id: j.id,
        title: j.title,
        department: j.department,
        location: j.location,
        type: j.type || t("career.full_time"),
        description: j.description,
        longDescription: j.longDescription?.trim() || undefined,
        badges: j.badges || [],
      }));
  }

  return LEGACY_JOB_IDS.map((id) => ({
    id,
    title: t(`career.jobs.${id}.title`),
    department: t(`career.jobs.${id}.department`),
    location: t(`career.jobs.${id}.location`),
    type: t("career.full_time"),
    description: t(`career.jobs.${id}.description`),
    longDescription: t(`career.jobs.${id}.long_description`, {
      defaultValue: CAREER_JOB_LONG_DESCRIPTIONS[id] ?? t(`career.jobs.${id}.description`),
    }),
    badges: [],
  }));
}

export function getCareerJobFullDescription(job: CareerJob): string {
  return job.longDescription?.trim() || job.description?.trim() || "";
}

export function getCareerJobListSummary(job: CareerJob): string {
  const summary = job.description?.trim();
  if (summary) return summary;
  const full = getCareerJobFullDescription(job);
  if (full.length <= 260) return full;
  return `${full.slice(0, 257).trimEnd()}…`;
}

export function careerJobDescriptionIsExpandable(job: CareerJob): boolean {
  const full = getCareerJobFullDescription(job);
  const summary = job.description?.trim();
  if (job.longDescription?.trim()) return true;
  if (!summary || !full) return false;
  return full.length > summary.length + 40;
}

export { buildDefaultCareerPageCms };
