-- Careers page CMS (`section_key = career_jobs`)
--
-- Recommended: Admin → CMS → Careers Page → "Seed defaults" → "Save Careers Page"
-- (writes full JSON: section titles/descriptions + job roles)
--
-- Prerequisite: run cms_content.sql once if the table does not exist.

-- Remove this row only if you want to re-seed from the admin UI:
-- DELETE FROM cms_content WHERE section_key = 'career_jobs';
