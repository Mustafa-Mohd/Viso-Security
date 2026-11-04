export type ParentRelation = "none" | "son" | "daughter";

export function formatCertificateClientName(
  clientName: string,
  relation: ParentRelation,
  parentName: string
): string {
  const name = clientName.trim();
  if (!name) return "";
  const parent = parentName.trim();
  if (relation === "none" || !parent) return name;
  const label = relation === "son" ? "Son of" : "Daughter of";
  return `${name}, ${label} ${parent}`;
}

export function parseCertificateClientName(projectName: string): {
  clientName: string;
  relation: ParentRelation;
  parentName: string;
} {
  const raw = projectName.trim();
  if (!raw) {
    return { clientName: "", relation: "none", parentName: "" };
  }

  const sonPatterns = [
    /^(.+?),\s*Son of\s+(.+)$/i,
    /^(.+?),\s*son of\s+(.+)$/i,
  ];
  for (const re of sonPatterns) {
    const m = raw.match(re);
    if (m) {
      return { clientName: m[1].trim(), relation: "son", parentName: m[2].trim() };
    }
  }

  const daughterPatterns = [
    /^(.+?),\s*Daughter of\s+(.+)$/i,
    /^(.+?),\s*daughter of\s+(.+)$/i,
  ];
  for (const re of daughterPatterns) {
    const m = raw.match(re);
    if (m) {
      return { clientName: m[1].trim(), relation: "daughter", parentName: m[2].trim() };
    }
  }

  return { clientName: raw, relation: "none", parentName: "" };
}
