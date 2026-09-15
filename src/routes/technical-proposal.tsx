import { createFileRoute, Link } from "@tanstack/react-router";
import { Printer, ArrowLeft } from "lucide-react";

const LOGO_URL =
  "https://res.cloudinary.com/dcefror3c/image/upload/v1786611747/Luxurious_black_and_gold_logo_design_kjv4np__1_-removebg-preview_jvmtcu.png";

const DOC_VERSION = "2.0";
const DOC_DATE = "September 2026";

export const Route = createFileRoute("/technical-proposal")({
  component: TechnicalProposalPage,
  head: () => ({
    meta: [
      { title: "Technical Proposal | VISO Group Corporate Platform" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
});

function TechnicalProposalPage() {
  const handlePrint = () => window.print();

  return (
    <div className="technical-proposal-doc min-h-screen bg-neutral-200 text-neutral-900 font-sans">
      {/* Screen-only toolbar — hidden when printing */}
      <div className="no-print sticky top-0 z-50 border-b border-neutral-300 bg-white/95 backdrop-blur px-4 py-3 flex flex-wrap items-center justify-between gap-3 shadow-sm">
        <p className="text-xs text-neutral-500 max-w-md">
          Confidential · Not listed in site navigation. Bookmark{" "}
          <code className="text-neutral-800 bg-neutral-100 px-1 rounded">/technical-proposal</code>
        </p>
        <div className="flex items-center gap-2">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-neutral-600 hover:text-neutral-900 px-3 py-2 rounded-md border border-neutral-200"
          >
            <ArrowLeft className="w-4 h-4" /> Site home
          </Link>
          <button
            type="button"
            onClick={handlePrint}
            className="inline-flex items-center gap-2 text-sm font-semibold bg-[#0B1329] text-white px-4 py-2 rounded-md hover:bg-[#1C2541] transition-colors"
          >
            <Printer className="w-4 h-4" /> Print / Save as PDF
          </button>
        </div>
      </div>

      <div className="print-root max-w-[210mm] mx-auto py-8 px-4 print:py-0 print:px-0 print:max-w-none">
        {/* Cover */}
        <article className="proposal-sheet bg-white shadow-lg print:shadow-none mb-8 print:mb-0 print:break-after-page">
          <div className="h-2 bg-[#D4AF37]" />
          <div className="p-10 md:p-14 min-h-[260mm] flex flex-col">
            <div className="flex justify-between items-start gap-6 border-b border-neutral-200 pb-8">
              <img src={LOGO_URL} alt="VISO Group" className="h-16 w-auto object-contain" />
              <div className="text-right text-xs text-neutral-500 leading-relaxed">
                <p className="font-semibold text-neutral-800 uppercase tracking-wider">Technical Proposal</p>
                <p>Document ref: VISO-TECH-{DOC_VERSION.replace(".", "")}</p>
                <p>Version {DOC_VERSION}</p>
                <p>{DOC_DATE}</p>
                <p className="mt-2 text-[10px] uppercase tracking-wide text-amber-800/80">Confidential</p>
              </div>
            </div>

            <div className="flex-1 flex flex-col justify-center py-12">
              <p className="text-xs font-bold tracking-[0.25em] text-[#D4AF37] uppercase mb-4">
                Vision of Solutions for Security Consultations Co. Ltd.
              </p>
              <h1 className="font-display text-4xl md:text-5xl font-bold text-[#0B1329] leading-tight mb-6">
                VISO Group
                <br />
                <span className="text-3xl md:text-4xl font-semibold text-neutral-600">
                  Corporate Portal &amp; Digital Operations Platform
                </span>
              </h1>
              <p className="text-lg text-neutral-600 max-w-xl leading-relaxed">
                A unified web platform combining premium corporate presence, Certipedia certificate verification,
                role-based administration, electronic document management (EDMS), and HR-facing workflows — engineered
                for bilingual operations across the Kingdom of Saudi Arabia.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-6 text-sm border-t border-neutral-200 pt-8">
              <div>
                <p className="text-[10px] uppercase tracking-wider text-neutral-400 mb-1">Prepared for</p>
                <p className="font-semibold text-neutral-800">VISO Group Stakeholders &amp; Technical Review</p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-wider text-neutral-400 mb-1">Platform type</p>
                <p className="font-semibold text-neutral-800">SPA · Supabase BaaS · Netlify deployment</p>
              </div>
            </div>
          </div>
        </article>

        {/* Body pages */}
        <article className="proposal-sheet bg-white shadow-lg print:shadow-none mb-8 print:mb-0 p-10 md:p-14 print:break-after-page">
          <SectionTitle number="1" title="Executive Summary" />
          <Body>
            The VISO Group platform is an enterprise-grade single-page application (SPA) that serves three strategic
            purposes: (1) a high-end public website for security consultancy, translation, and corporate services;
            (2) a <strong>Certipedia</strong> digital registry for verifying translation certificates; and (3) a secure{" "}
            <strong>Admin Portal</strong> for content management, user roles, careers, inquiries, certificate
            administration, and <strong>EDMS</strong> (Electronic Document Management System) for controlled project
            documentation.
          </Body>
          <Body>
            The solution is built with React and TypeScript for maintainability, Supabase for PostgreSQL data and file
            storage, and TanStack Router for type-safe navigation. English and Arabic are supported with full RTL layout
            switching. The architecture prioritizes modular boundaries so marketing, verification, and back-office
            capabilities can evolve independently while sharing a consistent design language and deployment pipeline.
          </Body>

          <SectionTitle number="2" title="Objectives & Scope" />
          <ul className="list-disc pl-5 space-y-2 text-sm text-neutral-700 leading-relaxed mb-6">
            <li>Present VISO as a premium security and translation consultancy with CMS-driven homepage content.</li>
            <li>Enable public verification of translation certificates with dual-factor lookup (Certificate ID + National ID).</li>
            <li>Provide staff with a centralized admin console for CMS, gallery, inquiries, and job applications.</li>
            <li>Implement EDMS with versioning, review workflow, audit trail, and role-based access.</li>
            <li>Support future HR employee self-service (ESS) and AI-assisted visitor engagement (chatbot).</li>
          </ul>
          <p className="text-xs text-neutral-500 italic">
            Out of scope for this document: native mobile apps, on-premise hosting, and full Supabase Auth migration
            (recommended for production hardening).
          </p>
        </article>

        <article className="proposal-sheet bg-white shadow-lg print:shadow-none mb-8 print:mb-0 p-10 md:p-14 print:break-after-page">
          <SectionTitle number="3" title="Technology Stack" />
          <SubTitle>3.1 Frontend</SubTitle>
          <DataTable
            headers={["Layer", "Technology", "Purpose"]}
            rows={[
              ["UI framework", "React 19", "Component-based interface"],
              ["Language", "TypeScript 5.8", "Type safety and developer experience"],
              ["Build", "Vite 8", "Fast dev server and optimized production bundles"],
              ["Routing", "TanStack Router", "File-based routes, code splitting, typed navigation"],
              ["Server state", "TanStack React Query", "Cached async data at application root"],
              ["Styling", "Tailwind CSS v4", "Responsive utility-first design system"],
              ["UI kit", "Radix UI + shadcn-style components", "Accessible primitives (dialogs, forms, tabs)"],
              ["Motion", "Framer Motion, GSAP", "Hero animations and scroll-driven effects"],
              ["3D / maps", "Three.js (R3F), pigeon-maps", "Interactive visuals and location maps"],
              ["i18n", "i18next + react-i18next", "English / Arabic with RTL document direction"],
              ["Forms", "React Hook Form, Zod", "Validated forms where required"],
              ["Notifications", "Sonner", "User feedback in admin and EDMS"],
              ["Icons", "Lucide React", "Consistent iconography"],
            ]}
          />

          <SubTitle>3.2 Backend & Infrastructure</SubTitle>
          <DataTable
            headers={["Layer", "Technology", "Purpose"]}
            rows={[
              ["BaaS", "Supabase", "PostgreSQL, Storage, client SDK"],
              ["Auth (current)", "portal_users table + session in localStorage", "Role-based admin login"],
              ["AI (optional)", "SambaNova API (OpenAI-compatible)", "VISO chatbot via proxied /api/sambanova"],
              ["CDN", "Cloudinary", "Brand assets and optimized imagery"],
              ["Hosting", "Netlify", "SPA deploy, _redirects for deep links and API proxy"],
            ]}
          />

          <SubTitle>3.3 Tooling</SubTitle>
          <Body>ESLint 9, Prettier, TypeScript strict checking, Git-based version control.</Body>
        </article>

        <article className="proposal-sheet bg-white shadow-lg print:shadow-none mb-8 print:mb-0 p-10 md:p-14 print:break-after-page">
          <SectionTitle number="4" title="System Architecture" />
          <Body>The platform follows a layered SPA architecture:</Body>
          <ol className="list-decimal pl-5 space-y-2 text-sm text-neutral-700 mb-6">
            <li>
              <strong>Presentation layer</strong> — Route-level pages (`/`, `/security`, `/translation`, `/admin`, etc.)
              composed of reusable components.
            </li>
            <li>
              <strong>API layer</strong> — Typed modules (`certsApi`, `edmsApi`, Supabase client) encapsulating data
              access.
            </li>
            <li>
              <strong>Data layer</strong> — Supabase PostgreSQL tables and Storage buckets defined in SQL migration
              scripts (`cms_content`, `portal_users`, `translation_certificates`, `edms_*`, etc.).
            </li>
            <li>
              <strong>Cross-cutting</strong> — i18n, theming (multiple CSS themes), lazy mounting for performance.
            </li>
          </ol>
          <div className="border border-neutral-200 rounded-lg p-4 bg-neutral-50 text-xs font-mono text-neutral-700 leading-relaxed">
            [ Public Visitor ] → React SPA → Supabase (read CMS, verify certs, submit forms)
            <br />
            [ Admin User ] → /admin → RBAC modules → Supabase (CRUD, storage uploads)
            <br />
            [ Document roles ] → EDMS dashboard → versions + audit logs → edms_files bucket
          </div>
        </article>

        <article className="proposal-sheet bg-white shadow-lg print:shadow-none mb-8 print:mb-0 p-10 md:p-14 print:break-after-page">
          <SectionTitle number="5" title="Public Website Modules" />
          <FeatureBlock
            title="5.1 Corporate showcase (Home & services)"
            items={[
              "Animated brand intro loader and premium hero with image carousel",
              "CMS-driven sections: about, security lifecycle, core values, service areas, framework, showcase, statistics",
              "Lazy-loaded sections (LazyMount + Suspense) for performance",
              "Routes: /, /about, /security, /others, /clients, /gallery, /contact",
            ]}
          />
          <FeatureBlock
            title="5.2 Multilingual experience"
            items={[
              "English and Arabic locale files (en.json, ar.json)",
              "RTL layout when Arabic is selected (html dir, mirrored UI patterns)",
              "Language persistence in localStorage",
            ]}
          />
          <FeatureBlock
            title="5.3 Careers & contact"
            items={[
              "/career — job listings and applications with resume upload to Supabase Storage",
              "/contact — inquiries stored for admin review (read/unread status)",
            ]}
          />
        </article>

        <article className="proposal-sheet bg-white shadow-lg print:shadow-none mb-8 print:mb-0 p-10 md:p-14 print:break-after-page">
          <SectionTitle number="6" title="Certipedia — Certificate Verification" />
          <Body>
            Certipedia is VISO&apos;s translation certificate registry integrated into the public site and admin console.
          </Body>
          <FeatureBlock
            title="6.1 Public verification (/translation)"
            items={[
              "Dual-factor lookup: Certificate ID + National ID to reduce unauthorized enumeration",
              "Live status: VALID, EXPIRED, REVOKED with visual badges",
              "Deep-link auto-verify via query parameters (?verify=…&nationalId=…)",
            ]}
          />
          <FeatureBlock
            title="6.2 Digital certificate viewer (/certificate/:id)"
            items={[
              "Standalone A4-style printable certificate layout (no main site chrome)",
              "QR code linking back to verification flow on the live domain",
              "Suitable for print and PDF export from the browser",
            ]}
          />
          <FeatureBlock
            title="6.3 Admin certificate management"
            items={[
              "Certificates dashboard: create, edit, search, filter by status",
              "Backed by Supabase translation_certificates table (certs_setup.sql)",
            ]}
          />
        </article>

        <article className="proposal-sheet bg-white shadow-lg print:shadow-none mb-8 print:mb-0 p-10 md:p-14 print:break-after-page">
          <SectionTitle number="7" title="Admin Portal (/admin)" />
          <Body>Single sign-on shell with sidebar modules gated by role.</Body>
          <DataTable
            headers={["Module", "Typical roles", "Capabilities"]}
            rows={[
              ["Homepage CMS", "super_admin, admin", "Edit hero, about, values, areas, services, lifecycle, framework, showcase"],
              ["CMS History", "super_admin, admin", "Audit log of content changes with diff tracking"],
              ["Gallery", "super_admin, admin", "Image upload and URL management"],
              ["Inquiries", "super_admin, admin", "Contact form queue"],
              ["Job applications", "super_admin, admin, hr", "Applications, status, resume access"],
              ["Certificates", "super_admin, admin", "Certipedia registry CRUD"],
              ["DMS / EDMS", "See §8", "Document register and workflow"],
              ["HR / ESS", "super_admin, hr, employee", "Employee workspace prototype"],
              ["Users & Roles", "super_admin", "Create portal users and assign roles"],
            ]}
          />
          <SubTitle>7.1 Role model (portal_users)</SubTitle>
          <Body>
            Roles include: super_admin, admin, hr, employee, document_controller, manager, reviewer, viewer. Each role
            sees only permitted navigation items. Super admin has full access including user management.
          </Body>
        </article>

        <article className="proposal-sheet bg-white shadow-lg print:shadow-none mb-8 print:mb-0 p-10 md:p-14 print:break-after-page">
          <SectionTitle number="8" title="EDMS — Electronic Document Management" />
          <Body>
            EDMS provides controlled document registration, versioning, review, approval, and archival for project
            deliverables (reports, drawings, specifications, contracts, etc.).
          </Body>
          <SubTitle>8.1 Data model</SubTitle>
          <ul className="list-disc pl-5 space-y-1 text-sm text-neutral-700 mb-4">
            <li><code className="text-xs bg-neutral-100 px-1">edms_documents</code> — metadata, status, owner, reviewer assignment</li>
            <li><code className="text-xs bg-neutral-100 px-1">edms_document_versions</code> — revision number, storage path, change description</li>
            <li><code className="text-xs bg-neutral-100 px-1">edms_audit_logs</code> — immutable activity trail per document</li>
            <li><code className="text-xs bg-neutral-100 px-1">edms_files</code> — Supabase Storage bucket for binaries</li>
          </ul>
          <SubTitle>8.2 Document lifecycle</SubTitle>
          <p className="text-sm text-neutral-700 mb-4">
            Draft → Submitted → Under Review (assigned reviewer) → Pending Approval / Approved → Rejected or Changes
            Requested → resubmit → Archived (document controller). Super admin may restore archived records.
          </p>
          <SubTitle>8.3 Application features</SubTitle>
          <FeatureBlock
            title="DMS Platform UI"
            items={[
              "Overview KPIs, document register, filters (project, type, status), search",
              "My documents view for employees and reviewers",
              "Upload with metadata, auto document number, file type/size validation",
              "Version history with signed download URLs",
              "Workflow actions with comment capture; toast notifications",
              "Permission layer (edmsPermissions) for view/upload/approve/archive by role",
            ]}
          />
        </article>

        <article className="proposal-sheet bg-white shadow-lg print:shadow-none mb-8 print:mb-0 p-10 md:p-14 print:break-after-page">
          <SectionTitle number="9" title="AI Assistant (Optional)" />
          <Body>
            An embeddable chatbot (Chatbot component) uses an OpenAI-compatible client pointed at SambaNova via a dev
            proxy and Netlify redirect rule. The system prompt encodes VISO services, locations, and HCIS/SAIS/Aramco
            positioning. API keys are supplied through environment variables (not committed to source control).
          </Body>

          <SectionTitle number="10" title="Security, Privacy & Performance" />
          <ul className="list-disc pl-5 space-y-2 text-sm text-neutral-700 mb-4">
            <li>React default XSS mitigations; parameterized Supabase queries from typed clients.</li>
            <li>Certificate verification should use rate limiting in production to protect National ID fields.</li>
            <li>Current admin passwords are stored in plain text in portal_users — production should migrate to Supabase Auth and hashed credentials.</li>
            <li>EDMS RLS policies in SQL scripts should be tightened per role before go-live; use signed URLs for file download.</li>
            <li>Code splitting via TanStack Router; lazy sections on homepage; CDN-hosted media.</li>
          </ul>

          <SectionTitle number="11" title="Deployment & Operations" />
          <DataTable
            headers={["Item", "Detail"]}
            rows={[
              ["Build", "npm run build → Vite production bundle"],
              ["Host", "Netlify (or equivalent static host)"],
              ["SPA routing", "public/_redirects → index.html for all routes"],
              ["API proxy", "/api/sambanova/* → SambaNova for chatbot"],
              ["Configuration", "VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY, optional VITE_SAMBANOVA_API_KEY"],
              ["Database setup", "Run SQL scripts: portal_users, cms_*, certs_setup, job_applications, edms_setup"],
            ]}
          />
        </article>

        <article className="proposal-sheet bg-white shadow-lg print:shadow-none p-10 md:p-14">
          <SectionTitle number="12" title="Roadmap Recommendations" />
          <ol className="list-decimal pl-5 space-y-2 text-sm text-neutral-700 mb-8">
            <li>Supabase Auth + password hashing and session hardening.</li>
            <li>Row-level security aligned to EDMS roles and confidentiality levels.</li>
            <li>Email notifications for EDMS workflow events and new inquiries.</li>
            <li>In-browser PDF preview for EDMS; transmittal packages for clients.</li>
            <li>Arabic localization for admin and EDMS screens.</li>
          </ol>

          <div className="border-t border-neutral-200 pt-8 flex justify-between items-end gap-6">
            <div>
              <img src={LOGO_URL} alt="VISO" className="h-10 w-auto mb-2 opacity-90" />
              <p className="text-xs text-neutral-500">© {new Date().getFullYear()} VISO Group. All rights reserved.</p>
            </div>
            <p className="text-[10px] text-neutral-400 text-right max-w-xs">
              This document is confidential and intended for authorized review only. Generated from the VISO platform
              technical specification v{DOC_VERSION}.
            </p>
          </div>
        </article>
      </div>

      <style>{`
        @media print {
          @page {
            size: A4;
            margin: 12mm 14mm;
          }
          body {
            background: white !important;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          .no-print {
            display: none !important;
          }
          .technical-proposal-doc {
            background: white !important;
          }
          .print-root {
            max-width: none !important;
            padding: 0 !important;
          }
          .proposal-sheet {
            box-shadow: none !important;
            margin-bottom: 0 !important;
            break-inside: avoid;
          }
          .print\\:break-after-page {
            break-after: page;
          }
        }
      `}</style>
    </div>
  );
}

function SectionTitle({ number, title }: { number: string; title: string }) {
  return (
    <h2 className="font-display text-xl font-bold text-[#0B1329] border-b-2 border-[#D4AF37] pb-2 mb-4 mt-2">
      <span className="text-[#D4AF37] mr-2">{number}.</span>
      {title}
    </h2>
  );
}

function SubTitle({ children }: { children: React.ReactNode }) {
  return <h3 className="text-sm font-bold text-neutral-800 mt-6 mb-3 uppercase tracking-wide">{children}</h3>;
}

function Body({ children }: { children: React.ReactNode }) {
  return <p className="text-sm text-neutral-700 leading-relaxed mb-4 text-justify">{children}</p>;
}

function DataTable({ headers, rows }: { headers: string[]; rows: string[][] }) {
  return (
    <div className="overflow-x-auto mb-6">
      <table className="w-full text-left text-xs border border-neutral-200">
        <thead className="bg-[#0B1329] text-white">
          <tr>
            {headers.map((h) => (
              <th key={h} className="px-3 py-2 font-semibold">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-neutral-200">
          {rows.map((row, i) => (
            <tr key={i} className="even:bg-neutral-50">
              {row.map((cell, j) => (
                <td key={j} className="px-3 py-2 text-neutral-700 align-top">{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function FeatureBlock({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="mb-5">
      <h4 className="text-sm font-semibold text-neutral-800 mb-2">{title}</h4>
      <ul className="list-disc pl-5 space-y-1 text-sm text-neutral-700">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  );
}
