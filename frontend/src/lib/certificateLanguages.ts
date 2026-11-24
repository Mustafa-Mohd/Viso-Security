/**
 * Languages offered when issuing translation certificates (source/target).
 * Must match names used in certificate legal copy and third-language templates.
 */
export const CERTIFICATE_LANGUAGE_OPTIONS: readonly string[] = [
  "Arabic",
  "English",
  "French",
  "German",
  "Spanish",
  "Portuguese",
  "Italian",
  "Hindi",
  "Urdu",
  "Bengali",
  "Punjabi",
  "Telugu",
  "Tamil",
  "Malayalam",
  "Kannada",
  "Marathi",
  "Chinese",
  "Japanese",
  "Korean",
  "Russian",
  "Turkish",
  "Dutch",
  "Polish",
  "Indonesian",
] as const;

/** Target language — original admin short list (certificates often translate into these). */
export const CERTIFICATE_TARGET_LANGUAGE_OPTIONS: readonly string[] = [
  "English",
  "Arabic",
  "French",
  "German",
  "Spanish",
] as const;

/** Ensure persisted values (custom / legacy) still appear in admin dropdowns. */
export function certificateLanguageSelectOptions(
  currentValue: string,
  options: readonly string[] = CERTIFICATE_LANGUAGE_OPTIONS
): string[] {
  const v = currentValue.trim();
  if (!v) return [...options];
  if (options.some((x) => x.toLowerCase() === v.toLowerCase())) {
    return [...options];
  }
  return [v, ...options];
}