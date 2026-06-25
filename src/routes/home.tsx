import { createFileRoute, Link } from "@tanstack/react-router";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { useRef, useState } from "react";
import { Shield, Radar, Lock, Satellite } from "lucide-react";
import { SmoothScroll } from "@/components/SmoothScroll";


export const Route = createFileRoute("/home")({
  head: () => ({
    meta: [
      { title: "VISO — Fortifying Tomorrow | Physical Security Consultancy" },
      {
        name: "description",
        content:
          "VISO is a premier physical security consultancy headquartered in Riyadh. SRA, design, technology integration & compliance across the Kingdom.",
      },
      { property: "og:title", content: "VISO — Fortifying Tomorrow" },
      {
        property: "og:description",
        content:
          "Tailored physical security strategy, design and assurance for critical national infrastructure.",
      },
    ],
  }),
  component: Index,
});

/* ---------- helpers ---------- */

function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-80px" }}
      variants={{
        hidden: { opacity: 0, y: 28 },
        show: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1], delay },
        },
      }}
    >
      {children}
    </motion.div>
  );
}

function SectionLabel({ n, label }: { n: string; label: string }) {
  return (
    <div className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.25em] text-muted-foreground">
      <span className="text-gold">{n}</span>
      <span className="h-px w-8 bg-border" />
      <span>{label}</span>
    </div>
  );
}

/* ---------- page ---------- */
function Index() {
  return (
    <>
      <SmoothScroll />
      <Nav />
      <main className="relative overflow-hidden bg-background text-foreground">
        <Hero />
        <Marquee />
        <About />
        <VisionMission />
        <Need />
        <Approach />
        <Functions />
        <SRA />
        <Planning />
        <Technology />
        <Competencies />
        <Clients />
        <Portfolio />
        <Regional />
        <WhyUs />
        <Compliance />
        <Contact />
        <Footer />
      </main>
    </>
  );
}

/* ---------- Nav ---------- */
function Nav() {
  const links = [
    ["About", "#about"],
    ["Approach", "#approach"],
    ["Capabilities", "#competencies"],
    ["Portfolio", "#portfolio"],
    ["Contact", "#contact"],
  ] as const;
  return (
    <motion.header
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
      className="fixed inset-x-0 top-0 z-50"
    >
      <div className="mx-auto mt-4 flex max-w-7xl items-center justify-between rounded-full border border-border/60 bg-background/40 px-5 py-3 ">
        <a href="#top" className="flex items-center gap-2.5">
          <span className="grid h-7 w-7 place-items-center rounded-md bg-gold text-gold-foreground font-mono text-[11px] font-bold">
            V
          </span>
          <span className="font-display text-lg leading-none">VISO</span>
          <span className="hidden font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground sm:inline">
            Security Consultations
          </span>
        </a>
        <nav className="hidden items-center gap-7 md:flex">
          <Link to="/" className="text-[13px] text-gold font-medium transition-colors hover:text-gold/80">
            Story
          </Link>
          {links.map(([label, href]) => (
            <a
              key={href}
              href={href}
              className="text-[13px] text-muted-foreground transition-colors hover:text-foreground"
            >
              {label}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-4">
          <ThemeToggle />
          <a
            href="#contact"
            className="group inline-flex items-center gap-2 rounded-full bg-gold px-4 py-2 text-[12px] font-medium text-gold-foreground transition-transform hover:scale-[1.02]"
          >
            Engage
            <span className="transition-transform group-hover:translate-x-0.5">→</span>
          </a>
        </div>
      </div>
    </motion.header>
  );
}

/* ---------- Hero ---------- */
function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const prefersReduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [0, prefersReduced ? 0 : 200]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <section
      ref={ref}
      id="top"
      className="relative isolate grid min-h-[100svh] grid-bg place-items-center px-6 pt-32"
    >
      <div className="pointer-events-none absolute inset-0 radial-fade" />
      <motion.div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/3 -z-10 h-[60vh] w-[60vh] -translate-x-1/2 rounded-full"
        style={{
          background:
            "radial-gradient(circle, oklch(0.82 0.13 85 / 0.18), transparent 70%)",
        }}
        animate={{ scale: [1, 1.15, 1] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />

      <motion.div
        style={{ y, opacity }}
        className="relative z-10 mx-auto max-w-5xl text-center"
      >
        <Reveal>
          <div className="mx-auto mb-8 inline-flex items-center gap-2 rounded-full border border-border bg-surface shadow-sm px-3 py-1.5 font-mono text-[10.5px] uppercase tracking-[0.25em] text-muted-foreground ">
            <span className="h-1.5 w-1.5 rounded-full bg-gold" />
            Est. 2020 — Riyadh, KSA
          </div>
        </Reveal>

        <h1 className="font-display text-[clamp(3rem,9vw,8.5rem)] leading-[0.95] text-balance">
          {"Fortifying".split("").map((c, i) => (
            <motion.span
              key={i}
              initial={{ y: "110%", opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.9, delay: 0.05 * i, ease: [0.22, 1, 0.36, 1] }}
              className="inline-block"
            >
              {c}
            </motion.span>
          ))}
          <br />
          <span className="text-gradient-gold italic">tomorrow.</span>
        </h1>

        <Reveal delay={0.6}>
          <p className="mx-auto mt-8 max-w-xl text-balance text-[15px] leading-relaxed text-muted-foreground">
            A comprehensive approach to physical security — protecting people,
            property and information across the Kingdom&apos;s most critical assets.
          </p>
        </Reveal>

        <Reveal delay={0.75}>
          <div className="mt-12 flex flex-wrap items-center justify-center gap-2 font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
            {["Riyadh", "Khobar", "Jubail", "Jeddah", "Yanbu"].map((c, i) => (
              <span key={c} className="flex items-center gap-2">
                {i > 0 && <span className="h-1 w-1 rounded-full bg-gold/60" />}
                {c}
              </span>
            ))}
          </div>
        </Reveal>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6, duration: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground"
      >
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          scroll ↓
        </motion.div>
      </motion.div>
    </section>
  );
}

/* ---------- Marquee ---------- */
function Marquee() {
  const items = [
    "ISO 9001",
    "ISO 45001",
    "ISO 27001",
    "Aramco SACS-002",
    "HCIS / SAIS",
    "API 780",
    "ASIS RA",
    "52.53% Local Content",
  ];
  return (
    <section className="border-y border-border/60 bg-surface shadow-sm py-6 overflow-hidden">
      <motion.div
        className="flex gap-12 whitespace-nowrap"
        animate={{ x: ["0%", "-50%"] }}
        transition={{ duration: 35, repeat: Infinity, ease: "linear" }}
      >
        {[...items, ...items, ...items].map((it, i) => (
          <span
            key={i}
            className="font-mono text-[11px] uppercase tracking-[0.3em] text-muted-foreground"
          >
            ◆ {it}
          </span>
        ))}
      </motion.div>
    </section>
  );
}

/* ---------- About ---------- */
function About() {
  const stats = [
    ["2020", "Established"],
    ["5", "Regional Offices"],
    ["92+", "Projects Delivered"],
    ["52.53%", "Local Content"],
  ] as const;
  return (
    <section id="about" className="relative px-6 py-16 md:py-32">
      <div className="mx-auto grid max-w-7xl gap-16 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <Reveal>
            <SectionLabel n="01" label="About VISO" />
          </Reveal>
          <Reveal delay={0.1}>
            <h2 className="mt-6 font-display text-5xl leading-[1.05] text-balance md:text-6xl">
              Where security meets <em className="text-gradient-gold">peace of mind.</em>
            </h2>
          </Reveal>
        </div>
        <div className="lg:col-span-7 lg:col-start-6">
          <Reveal delay={0.15}>
            <p className="text-lg leading-relaxed text-muted-foreground">
              VISO is a premier physical security consultancy specializing in
              safeguarding our clients&apos; most valuable assets. Founded in January
              2020 and headquartered in Riyadh, we now operate from five offices
              across the Kingdom — delivering tailored solutions that align with
              national authorities and the highest international benchmarks.
            </p>
          </Reveal>
          <Reveal delay={0.25}>
            <p className="mt-6 text-base leading-relaxed text-muted-foreground/80">
              Our team brings decades of combined experience in security analysis,
              risk assessment and integrated protective measures across critical
              national infrastructure, energy, industrial, financial and government
              sectors.
            </p>
          </Reveal>

          <div className="mt-14 grid grid-cols-2 gap-px border border-border bg-border md:grid-cols-4">
            {stats.map(([n, l], i) => (
              <Reveal key={l} delay={0.3 + i * 0.08}>
                <div className="bg-background p-6">
                  <div className="font-display text-4xl text-gold">{n}</div>
                  <div className="mt-2 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                    {l}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- Vision & Mission ---------- */
function VisionMission() {
  const items = [
    {
      tag: "Our Vision",
      title: "Trusted leadership in physical security.",
      body: "To become the trusted leader in physical security consultancy — renowned for our expertise, innovation, and unwavering commitment to excellence. We aspire to continually push the boundaries of security solutions, shaping a safer world for generations to come.",
    },
    {
      tag: "Our Mission",
      title: "Protecting assets. Ensuring safety.",
      body: "To protect our clients' assets and ensure their safety through thorough analysis, creative solutions, and unwavering commitment to excellence — delivering customized strategies that empower clients to thrive in a secure environment.",
    },
  ];
  return (
    <section className="border-t border-border/60 px-6 py-16 md:py-32">
      <div className="mx-auto grid max-w-7xl gap-px overflow-hidden rounded-2xl border border-border bg-border md:grid-cols-2">
        {items.map((it, i) => (
          <Reveal key={it.tag} delay={i * 0.15}>
            <div className="group relative h-full bg-surface p-10 transition-colors hover:bg-surface-2 md:p-14">
              <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-gold">
                {it.tag}
              </div>
              <h3 className="mt-6 font-display text-4xl leading-tight text-balance md:text-5xl">
                {it.title}
              </h3>
              <p className="mt-6 text-[15px] leading-relaxed text-muted-foreground">
                {it.body}
              </p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/* ---------- The Need ---------- */
function Need() {
  const cards = [
    ["Theft & Vandalism", "Defending tangible and intangible assets against intentional damage and loss."],
    ["Personal Safety", "Creating a safe environment for staff, visitors and contractors at all times."],
    ["Business Continuity", "Minimizing disruption from incidents so operations stay reliable and resilient."],
    ["Regulatory Compliance", "Meeting HCIS/SAIS, ASIS and ISO requirements that govern critical facilities."],
    ["Data Security", "Protecting confidential and sensitive information from unauthorized exposure."],
  ] as const;
  return (
    <section className="border-t border-border/60 px-6 py-16 md:py-32">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <Reveal>
              <SectionLabel n="02" label="The Need" />
            </Reveal>
            <Reveal delay={0.1}>
              <h2 className="mt-6 font-display text-5xl leading-[1.05] text-balance md:text-6xl">
                Why structured security <em className="text-gradient-gold">is essential.</em>
              </h2>
            </Reveal>
          </div>
          <div className="lg:col-span-6 lg:col-start-7">
            <Reveal delay={0.2}>
              <div className="grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-border bg-border">
                <div className="bg-surface p-6">
                  <div className="font-display text-5xl text-gold">60%</div>
                  <p className="mt-2 text-sm text-muted-foreground">
                    of businesses have experienced a physical security breach in
                    the past 5 years.
                  </p>
                </div>
                <div className="bg-surface p-6">
                  <div className="font-display text-5xl text-gold">$100K</div>
                  <p className="mt-2 text-sm text-muted-foreground">
                    average cost to address a single physical security breach
                    incident.
                  </p>
                </div>
              </div>
            </Reveal>
          </div>
        </div>

        <div className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {cards.map(([t, b], i) => (
            <Reveal key={t} delay={i * 0.07}>
              <div className="group relative h-full rounded-xl border border-border bg-surface p-6 transition-all hover:-translate-y-1 hover:border-gold/40">
                <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-gold">
                  0{i + 1}
                </div>
                <h4 className="mt-4 font-display text-xl leading-snug">{t}</h4>
                <p className="mt-3 text-[13px] leading-relaxed text-muted-foreground">
                  {b}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- Approach ---------- */
function Approach() {
  const pillars = [
    {
      n: "01",
      t: "People",
      b: "Our foremost duty is the safety of every individual on site — staff, contractors, visitors and the wider community. Robust protocols, training and continuous review create a secure environment for all stakeholders.",
    },
    {
      n: "02",
      t: "Property",
      b: "Property protection extends well beyond physical barriers. We integrate technology-driven measures — advanced surveillance, access control and perimeter systems — that deter threats and reduce risk to infrastructure.",
    },
    {
      n: "03",
      t: "Information",
      b: "Information security is central. Strict procedural controls combined with modern technology safeguard sensitive data, ensure client confidentiality and prevent unauthorized access or breaches.",
    },
  ];
  return (
    <section id="approach" className="relative border-t border-border/60 px-6 py-16 md:py-32">
      <div className="mx-auto max-w-7xl">
        <Reveal>
          <SectionLabel n="03" label="Our Approach" />
        </Reveal>
        <Reveal delay={0.1}>
          <h2 className="mt-6 max-w-3xl font-display text-5xl leading-[1.05] text-balance md:text-6xl">
            Three pillars frame <em className="text-gradient-gold">every engagement.</em>
          </h2>
        </Reveal>

        <div className="mt-20 space-y-px overflow-hidden rounded-2xl border border-border bg-border">
          {pillars.map((p, i) => (
            <motion.div
              key={p.n}
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="group grid grid-cols-12 items-start gap-6 bg-surface p-8 transition-colors hover:bg-surface-2 md:p-12"
            >
              <div className="col-span-12 md:col-span-2">
                <div className="font-display text-6xl text-gold/80 md:text-7xl">
                  {p.n}
                </div>
              </div>
              <div className="col-span-12 md:col-span-3">
                <h3 className="font-display text-4xl uppercase tracking-tight md:text-5xl">
                  {p.t}
                </h3>
              </div>
              <div className="col-span-12 md:col-span-7">
                <p className="text-[15px] leading-relaxed text-muted-foreground md:text-base">
                  {p.b}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- Functions (5 D's) ---------- */
function Functions() {
  const steps = [
    { k: "Deter", v: "Discourage threats", phase: "Preventative" },
    { k: "Detect", v: "Identify intrusions", phase: "Preventative" },
    { k: "Delay", v: "Slow attacker progress", phase: "Preventative" },
    { k: "Respond", v: "Engage and neutralize", phase: "Reactive" },
    { k: "Recover", v: "Restore operations", phase: "Reactive" },
  ];
  return (
    <section className="border-t border-border/60 px-6 pt-24 pb-12 md:py-32">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <Reveal>
              <SectionLabel n="04" label="Security Functions" />
            </Reveal>
            <Reveal delay={0.1}>
              <h2 className="mt-6 max-w-2xl font-display text-5xl leading-[1.05] text-balance md:text-6xl">
                Defence <em className="text-gradient-gold">in depth.</em>
              </h2>
            </Reveal>
          </div>
          <Reveal delay={0.2}>
            <p className="max-w-md text-sm text-muted-foreground">
              A robust security architecture relies on a multi-layered 'Defense in Depth' strategy. By integrating physical, technical, and administrative controls, we create overlapping barriers that deter, detect, and delay threats—ensuring resilient protection for your critical assets.
            </p>
          </Reveal>
        </div>

        <div className="mt-8 md:mt-16 w-full flex justify-center">
          <img 
            src="https://res.cloudinary.com/dcefror3c/image/upload/v1781685830/ChatGPT_Image_Jun_17_2026_02_12_15_PM_awfljd.png" 
            alt="Defence in depth (Desktop)" 
            className="hidden md:block w-full h-auto rounded-xl border border-border/50 bg-surface shadow-sm object-cover"
          />
          <img 
            src="https://res.cloudinary.com/dcefror3c/image/upload/v1781690193/ChatGPT_Image_Jun_17_2026_03_26_15_PM_p1zb7z.png" 
            alt="Defence in depth (Mobile)" 
            className="block md:hidden w-full h-auto rounded-xl border border-border/50 bg-surface shadow-sm object-cover"
          />
        </div>
      </div>
    </section>
  );
}

/* ---------- SRA ---------- */
function SRA() {
  const steps = [
    "Identify the assets",
    "Determine the critical level of assets",
    "Identify the threats to each critical asset",
    "Identify existing countermeasures",
    "Determine the vulnerability level of each asset",
    "Determine the risk level of each critical asset",
    "Recommend security upgrades to reduce high risk",
    "Perform cost-benefit analysis to support upgrades",
  ];
  return (
    <section className="border-t border-border/60 px-6 pt-12 pb-24 md:py-32">
      <div className="mx-auto grid max-w-7xl gap-16 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <Reveal>
            <SectionLabel n="05" label="Security Risk Assessment" />
          </Reveal>
          <Reveal delay={0.1}>
            <h2 className="mt-6 font-display text-5xl leading-[1.05] text-balance md:text-6xl">
              Risk-based. <em className="text-gradient-gold">Evidence-driven.</em>
            </h2>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="mt-6 text-[15px] leading-relaxed text-muted-foreground">
              Every project begins with a structured SRA that identifies critical
              assets, evaluates credible threats, measures vulnerabilities and
              quantifies residual risk. Findings drive measurable, cost-justified
              mitigation recommendations.
            </p>
          </Reveal>
          <Reveal delay={0.3}>
            <div className="mt-8 flex flex-wrap gap-2">
              {["ISO 31000", "API 780", "ASIS RA", "HCIS"].map((s) => (
                <span
                  key={s}
                  className="rounded-full border border-gold/30 bg-gold/5 px-3 py-1 font-mono text-[11px] uppercase tracking-[0.15em] text-gold"
                >
                  {s}
                </span>
              ))}
            </div>
          </Reveal>
        </div>
        <div className="lg:col-span-6 lg:col-start-7">
          <ol className="relative space-y-px overflow-hidden rounded-xl border border-border bg-border">
            {steps.map((s, i) => (
              <motion.li
                key={s}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-30px" }}
                transition={{ duration: 0.5, delay: i * 0.05 }}
                className="group flex items-center gap-6 bg-surface px-6 py-4 transition-colors hover:bg-surface-2"
              >
                <span className="font-mono text-xs text-gold w-6">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="text-[14px] leading-snug">{s}</span>
                <span className="ml-auto text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100">
                  →
                </span>
              </motion.li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

/* ---------- Planning ---------- */
function Planning() {
  const stages = [
    ["Requirements & Brief", "Stakeholder workshops align mission, threats and constraints."],
    ["Concept Design", "Layered protection concept, system architecture and zoning."],
    ["Detailed Design", "Drawings, schedules, specifications and BOQ to tender-ready quality."],
    ["Procurement Support", "Vendor evaluation, technical assessment and contract advisory."],
    ["Construction Supervision", "Quality oversight, witness testing and progress assurance."],
    ["Implementation Planning", "Phasing, mobilization, commissioning and handover."],
  ];
  return (
    <section className="border-t border-border/60 bg-surface shadow-sm px-6 py-16 md:py-32">
      <div className="mx-auto max-w-7xl">
        <Reveal>
          <SectionLabel n="06" label="Planning & Design" />
        </Reveal>
        <Reveal delay={0.1}>
          <h2 className="mt-6 max-w-3xl font-display text-5xl leading-[1.05] text-balance md:text-6xl">
            From requirements to implementation —
            <em className="text-gradient-gold"> a systematic workflow.</em>
          </h2>
        </Reveal>

        <div className="mt-16 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {stages.map(([t, b], i) => (
            <Reveal key={t} delay={i * 0.07}>
              <div className="group relative h-full overflow-hidden rounded-xl border border-border bg-background p-7 transition-all hover:border-gold/40">
                <div className="flex items-baseline justify-between">
                  <span className="font-display text-4xl text-gold/70">
                    0{i + 1}
                  </span>
                  <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                    Stage
                  </span>
                </div>
                <h4 className="mt-6 font-display text-2xl leading-snug">{t}</h4>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  {b}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- Technology ---------- */
function Technology() {
  const items = [
    ["CCTV & Video Analytics", "AI-enabled surveillance with central command-room integration."],
    ["Access Control", "Multi-factor identity, biometrics and zoned permissions."],
    ["Perimeter Intrusion", "Fence detection, radar and microwave layers."],
    ["PSIM / Command Centre", "Unified situational awareness and incident response."],
    ["Communications", "Resilient radio, data networks and emergency dispatch."],
    ["Fire & Life Safety", "Detection, suppression and mass-notification integration."],
  ];
  return (
    <section className="border-t border-border/60 px-6 py-16 md:py-32">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div className="max-w-2xl">
            <Reveal>
              <SectionLabel n="07" label="Technology Integration" />
            </Reveal>
            <Reveal delay={0.1}>
              <h2 className="mt-6 font-display text-5xl leading-[1.05] text-balance md:text-6xl">
                One ecosystem. <em className="text-gradient-gold">Centrally managed.</em>
              </h2>
            </Reveal>
          </div>
          <Reveal delay={0.2}>
            <p className="max-w-sm text-sm text-muted-foreground">
              Proven technologies converged into a single security platform —
              interoperable with ICT, BMS, fire-safety and operational systems.
            </p>
          </Reveal>
        </div>

        <div className="mt-16 grid gap-px overflow-hidden rounded-2xl border border-border bg-border md:grid-cols-2 lg:grid-cols-3">
          {items.map(([t, b], i) => (
            <Reveal key={t} delay={i * 0.05}>
              <div className="group relative h-full bg-surface p-8 transition-colors hover:bg-surface-2">
                <div className="mb-6 grid h-10 w-10 place-items-center rounded-lg border border-gold/30 bg-gold/10 font-mono text-xs text-gold">
                  {String(i + 1).padStart(2, "0")}
                </div>
                <h4 className="font-display text-2xl">{t}</h4>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  {b}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- Competencies ---------- */
function Competencies() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const groups = [
    {
      icon: Shield,
      h: "Consultancy & Advisory",
      items: [
        "Security Risk Assessment",
        "Threat & Vulnerability Analysis",
        "Master Security Planning",
        "Crisis Management",
      ],
    },
    {
      icon: Radar,
      h: "Engineering & Design",
      items: [
        "Concept & Detailed Design",
        "CCTV, ACS, PIDS, PSIM",
        "Drawings, BOQ & Specs",
        "CADD & 3D Modelling",
      ],
    },
    {
      icon: Satellite,
      h: "Implementation Support",
      items: [
        "Tender & Procurement",
        "Construction Supervision",
        "Testing & Commissioning",
        "Data Networks & Radio Comms",
      ],
    },
  ];

  return (
    <section
      id="competencies"
      className="relative overflow-hidden border-t border-border/60 px-6 py-20 md:py-40"
      onMouseMove={(e) => {
        setMousePosition({
          x: e.clientX,
          y: e.clientY,
        });
      }}
    >
      {/* Spotlight */}
      <div
        className="pointer-events-none absolute inset-0 opacity-20"
        style={{
          background: `radial-gradient(
            500px circle at ${mousePosition.x}px ${mousePosition.y}px,
            rgba(212,175,55,0.18),
            transparent 70%
          )`,
        }}
      />

      {/* Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:60px_60px]" />

      {/* Sphere */}
      <motion.div
        animate={{
          rotate: 360,
        }}
        transition={{
          duration: 40,
          repeat: Infinity,
          ease: "linear",
        }}
        className="absolute left-1/2 top-1/2 h-[550px] w-[550px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-gold/20"
      >
        <div className="absolute inset-0 rounded-full border border-gold/10 scale-90" />
        <div className="absolute inset-0 rounded-full border border-gold/10 scale-75" />
        <div className="absolute inset-0 rounded-full border border-gold/10 scale-50" />
      </motion.div>

      {/* Floating Icons */}
      <motion.div
        animate={{ y: [-20, 20, -20] }}
        transition={{ duration: 8, repeat: Infinity }}
        className="absolute left-[15%] top-[25%]"
      >
        <Shield className="h-10 w-10 text-gold/50" />
      </motion.div>

      <motion.div
        animate={{ y: [20, -20, 20] }}
        transition={{ duration: 10, repeat: Infinity }}
        className="absolute right-[15%] top-[20%]"
      >
        <Radar className="h-10 w-10 text-gold/50" />
      </motion.div>

      <motion.div
        animate={{ y: [-15, 15, -15] }}
        transition={{ duration: 9, repeat: Infinity }}
        className="absolute left-[20%] bottom-[20%]"
      >
        <Lock className="h-10 w-10 text-gold/50" />
      </motion.div>

      <div className="relative z-10 mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 80 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <p className="font-mono text-xs uppercase tracking-[0.4em] text-gold">
            08 • Core Competencies
          </p>

          <h2 className="mt-6 max-w-4xl font-display text-5xl leading-tight md:text-7xl">
            The Full Physical Security{" "}
            <span className="bg-gradient-to-r from-yellow-300 via-yellow-500 to-yellow-200 bg-clip-text text-transparent">
              Lifecycle
            </span>
          </h2>

          <p className="mt-6 max-w-2xl text-lg text-muted-foreground">
            From strategic consulting and risk assessment to engineering,
            implementation, commissioning and operational support.
          </p>
        </motion.div>

        <div className="mt-24 grid gap-8 md:grid-cols-3">
          {groups.map((group, i) => {
            const Icon = group.icon;

            return (
              <motion.div
                key={group.h}
                initial={{
                  opacity: 0,
                  y: 100,
                  rotateX: 20,
                }}
                whileInView={{
                  opacity: 1,
                  y: 0,
                  rotateX: 0,
                }}
                transition={{
                  duration: 0.8,
                  delay: i * 0.15,
                }}
                whileHover={{
                  y: -15,
                  rotateX: 8,
                  rotateY: 8,
                  scale: 1.03,
                }}
                style={{
                  transformStyle: "preserve-3d",
                }}
                className="group relative overflow-hidden rounded-3xl border border-foreground/10 bg-surface shadow-md p-8 "
              >
                {/* Scan Line */}
                <div className="absolute inset-0 overflow-hidden">
                  <div className="absolute -top-32 left-0 h-32 w-full bg-gradient-to-b from-transparent via-gold/20 to-transparent opacity-0 transition-all duration-700 group-hover:translate-y-[500px] group-hover:opacity-100" />
                </div>

                {/* Glow */}
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-gold/5 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

                <div className="relative z-10">
                  <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl border border-gold/20 bg-gold/10">
                    <Icon className="h-8 w-8 text-gold" />
                  </div>

                  <h4 className="font-mono text-xs uppercase tracking-[0.25em] text-gold">
                    {group.h}
                  </h4>

                  <ul className="mt-8 space-y-5">
                    {group.items.map((item) => (
                      <li
                        key={item}
                        className="flex items-start gap-3 border-b border-foreground/5 pb-4 text-foreground/80"
                      >
                        <span className="mt-2 h-2 w-2 rounded-full bg-gold" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Radar Pulse */}
      <div className="pointer-events-none absolute left-1/2 top-1/2">
        <div className="absolute h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 animate-ping rounded-full border border-gold/10" />
      </div>
    </section>
  );
}

/* ---------- Clients ---------- */
function Clients() {
  const groups: Array<[string, string[]]> = [
    ["Energy & Petrochemicals", ["Saudi Aramco", "SATORP", "SABIC", "Ma'aden", "Yansab", "Tasnee"]],
    ["EPC & Engineering", ["Samsung Engineering", "Doosan", "L&T", "Tecnimont", "Worley"]],
    ["Government & Infrastructure", ["MoI", "RCJY", "Saudi Ports", "MODON"]],
    ["Private & Hospitality", ["The Ritz-Carlton", "Red Sea International", "Amazon"]],
  ];
  return (
    <section className="border-t border-border/60 bg-surface shadow-sm px-6 py-16 md:py-32">
      <div className="mx-auto max-w-7xl">
        <Reveal>
          <SectionLabel n="09" label="Our Esteemed Clients" />
        </Reveal>
        <Reveal delay={0.1}>
          <h2 className="mt-6 max-w-3xl font-display text-5xl leading-[1.05] text-balance md:text-6xl">
            Trusted by leaders <em className="text-gradient-gold">across the Kingdom.</em>
          </h2>
        </Reveal>

        <div className="mt-16 space-y-px overflow-hidden rounded-2xl border border-border bg-border">
          {groups.map((g, i) => (
            <Reveal key={g[0]} delay={i * 0.08}>
              <div className="grid grid-cols-12 items-center gap-6 bg-background px-6 py-8 md:px-10">
                <div className="col-span-12 md:col-span-3">
                  <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-gold">
                    Sector {String(i + 1).padStart(2, "0")}
                  </div>
                  <h4 className="mt-2 font-display text-xl leading-tight md:text-2xl">
                    {g[0]}
                  </h4>
                </div>
                <div className="col-span-12 flex flex-wrap items-center gap-x-8 gap-y-3 md:col-span-9">
                  {g[1].map((c) => (
                    <span
                      key={c}
                      className="font-display text-lg uppercase tracking-wide text-muted-foreground transition-colors hover:text-foreground md:text-xl"
                    >
                      {c}
                    </span>
                  ))}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- Portfolio ---------- */
function Portfolio() {
  const big = [
    ["92+", "Total Projects"],
    ["68%", "Completed"],
    ["32%", "Ongoing"],
    ["2021—26", "Active Period"],
  ] as const;
  const samples = [
    ["ROSTP Aramco Project — Jazan", "Aramco", "Stage 4", "Completed"],
    ["Jeddah Islamic & Jazan Port", "Western Coast", "Stage 1", "Completed"],
    ["WTCO — Khobar/Jubail WTS", "WTCO", "Supervision", "Ongoing"],
    ["Giga-Project Perimeter", "Confidential", "Stage 3", "Ongoing"],
    ["Critical Substation Programme", "Government", "Stage 2", "Completed"],
    ["Industrial City Security Plan", "MODON", "Master Plan", "Completed"],
  ];
  return (
    <section id="portfolio" className="border-t border-border/60 px-6 py-16 md:py-32">
      <div className="mx-auto max-w-7xl">
        <Reveal>
          <SectionLabel n="10" label="Project Portfolio" />
        </Reveal>
        <Reveal delay={0.1}>
          <h2 className="mt-6 max-w-3xl font-display text-5xl leading-[1.05] text-balance md:text-6xl">
            Delivered across the Kingdom — <em className="text-gradient-gold">2021 to 2026.</em>
          </h2>
        </Reveal>

        <div className="mt-16 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-border bg-border md:grid-cols-4">
          {big.map(([n, l]) => (
            <div key={l} className="bg-surface p-8">
              <div className="font-display text-5xl text-gold md:text-6xl">{n}</div>
              <div className="mt-3 font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
                {l}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 overflow-hidden rounded-2xl border border-border">
          <div className="grid grid-cols-12 gap-4 border-b border-border bg-surface-2 px-6 py-4 font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
            <span className="col-span-6">Project</span>
            <span className="col-span-3">End-User</span>
            <span className="col-span-2">Scope</span>
            <span className="col-span-1 text-right">Status</span>
          </div>
          {samples.map((row, i) => (
            <motion.div
              key={row[0]}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-30px" }}
              transition={{ duration: 0.5, delay: i * 0.05 }}
              className="grid grid-cols-12 items-center gap-4 border-b border-border bg-surface px-6 py-5 text-sm last:border-0 hover:bg-surface-2"
            >
              <span className="col-span-6 font-display text-lg">{row[0]}</span>
              <span className="col-span-3 text-muted-foreground">{row[1]}</span>
              <span className="col-span-2 font-mono text-[11px] uppercase tracking-[0.15em] text-muted-foreground">
                {row[2]}
              </span>
              <span className="col-span-1 text-right">
                <span
                  className={`inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.15em] ${
                    row[3] === "Completed" ? "text-gold" : "text-accent"
                  }`}
                >
                  <span
                    className={`h-1.5 w-1.5 rounded-full ${
                      row[3] === "Completed" ? "bg-gold" : "bg-accent"
                    }`}
                  />
                  {row[3]}
                </span>
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- Regional ---------- */
function Regional() {
  const cities = ["Riyadh", "Khobar", "Jubail", "Jeddah", "Yanbu"];
  const timeline = [
    ["2020", "Founded — Riyadh HQ"],
    ["2024", "Eastern Expansion — Khobar & Jubail"],
    ["2025", "Western Expansion — Jeddah & Yanbu"],
  ];
  return (
    <section className="border-t border-border/60 bg-surface shadow-sm px-6 py-16 md:py-32">
      <div className="mx-auto max-w-7xl">
        <Reveal>
          <SectionLabel n="11" label="Regional Presence" />
        </Reveal>
        <Reveal delay={0.1}>
          <h2 className="mt-6 max-w-3xl font-display text-5xl leading-[1.05] text-balance md:text-6xl">
            Five offices. <em className="text-gradient-gold">One Kingdom.</em>
          </h2>
        </Reveal>

        <div className="mt-16 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-border bg-border md:grid-cols-5">
          {cities.map((c, i) => (
            <motion.div
              key={c}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.08 }}
              className="group relative aspect-square bg-background p-6 transition-colors hover:bg-surface"
            >
              <div className="absolute right-4 top-4 h-2 w-2 rounded-full bg-gold animate-pulse" />
              <div className="flex h-full flex-col justify-end">
                <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
                  Office 0{i + 1}
                </div>
                <h4 className="mt-1 font-display text-2xl md:text-3xl">{c}</h4>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-12 grid gap-4 md:grid-cols-3">
          {timeline.map(([y, t], i) => (
            <Reveal key={y} delay={i * 0.1}>
              <div className="flex items-baseline gap-4 rounded-xl border border-border bg-background p-6">
                <span className="font-display text-3xl text-gold">{y}</span>
                <span className="text-sm text-muted-foreground">{t}</span>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- Why Us ---------- */
function WhyUs() {
  const reasons = [
    ["Specialist Focus", "Pure-play physical security consultancy — not a side practice."],
    ["KSA-First Pedigree", "Built around HCIS, SAIS and Aramco standards from day one."],
    ["Sector Depth", "Energy, petrochemicals, ports, giga-projects and sovereign assets."],
    ["Independent Counsel", "Vendor-neutral advisory founded on trust and accountability."],
  ];
  return (
    <section className="border-t border-border/60 px-6 py-16 md:py-32">
      <div className="mx-auto max-w-7xl">
        <Reveal>
          <SectionLabel n="12" label="Why Choose VISO" />
        </Reveal>
        <Reveal delay={0.1}>
          <h2 className="mt-6 max-w-3xl font-display text-5xl leading-[1.05] text-balance md:text-6xl">
            Built for the Kingdom&apos;s
            <em className="text-gradient-gold"> most demanding assets.</em>
          </h2>
        </Reveal>

        <div className="mt-16 grid gap-px overflow-hidden rounded-2xl border border-border bg-border md:grid-cols-2">
          {reasons.map(([t, b], i) => (
            <Reveal key={t} delay={i * 0.08}>
              <div className="group flex h-full items-start gap-6 bg-surface p-8 transition-colors hover:bg-surface-2 md:p-10">
                <div className="font-display text-5xl text-gold/70">
                  0{i + 1}
                </div>
                <div>
                  <h4 className="font-display text-2xl">{t}</h4>
                  <p className="mt-3 text-[15px] leading-relaxed text-muted-foreground">
                    {b}
                  </p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- Compliance ---------- */
function Compliance() {
  const badges = [
    ["ISO 9001", "Quality Management"],
    ["ISO 45001", "Occupational H&S"],
    ["ISO 27001", "Information Security"],
    ["Aramco SACS-002", "Cybersecurity Compliance"],
    ["SAIS Licensed", "Saudi Authority"],
    ["52.53% Local Content", "Verified by Audit Firm"],
    ["VAT Compliant", "Since Aug 2024"],
    ["CR 1010558646", "Vision of Solutions Co. Ltd"],
  ];
  return (
    <section className="border-t border-border/60 bg-surface shadow-sm px-6 py-16 md:py-32">
      <div className="mx-auto max-w-7xl">
        <Reveal>
          <SectionLabel n="13" label="Licenses & Standards" />
        </Reveal>
        <Reveal delay={0.1}>
          <h2 className="mt-6 max-w-3xl font-display text-5xl leading-[1.05] text-balance md:text-6xl">
            Independently audited.
            <em className="text-gradient-gold"> Fully authorized.</em>
          </h2>
        </Reveal>

        <div className="mt-16 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-border bg-border md:grid-cols-4">
          {badges.map(([t, b], i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.05 }}
              className="bg-background p-6 transition-colors hover:bg-surface"
            >
              <div className="font-display text-xl">{t}</div>
              <div className="mt-2 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                {b}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- Contact ---------- */
function Contact() {
  return (
    <section id="contact" className="relative border-t border-border/60 px-6 py-20 md:py-40">
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        animate={{
          background: [
            "radial-gradient(ellipse 60% 50% at 30% 30%, oklch(0.82 0.13 85 / 0.15), transparent 60%)",
            "radial-gradient(ellipse 60% 50% at 70% 60%, oklch(0.82 0.13 85 / 0.15), transparent 60%)",
            "radial-gradient(ellipse 60% 50% at 30% 30%, oklch(0.82 0.13 85 / 0.15), transparent 60%)",
          ],
        }}
        transition={{ duration: 14, repeat: Infinity }}
      />
      <div className="mx-auto max-w-5xl text-center">
        <Reveal>
          <SectionLabel n="14" label="Contact" />
        </Reveal>
        <Reveal delay={0.1}>
          <h2 className="mx-auto mt-8 max-w-4xl font-display text-[clamp(2.5rem,7vw,6.5rem)] leading-[1.02] text-balance">
            Let&apos;s build your
            <br />
            <em className="text-gradient-gold">security strategy</em> together.
          </h2>
        </Reveal>
        <Reveal delay={0.25}>
          <div className="mt-12 flex flex-wrap items-center justify-center gap-4">
            <a
              href="mailto:contact@viso.com.sa"
              className="group inline-flex items-center gap-3 rounded-full bg-gold px-7 py-3.5 text-sm font-medium text-gold-foreground transition-transform hover:scale-[1.02]"
            >
              contact@viso.com.sa
              <span className="transition-transform group-hover:translate-x-0.5">→</span>
            </a>
            <a
              href="tel:+966"
              className="inline-flex items-center gap-3 rounded-full border border-border bg-surface shadow-sm px-7 py-3.5 text-sm  hover:bg-surface-2"
            >
              +966 (HQ Riyadh)
            </a>
          </div>
        </Reveal>

        <Reveal delay={0.4}>
          <div className="mx-auto mt-20 grid max-w-3xl grid-cols-2 gap-px overflow-hidden rounded-2xl border border-border bg-border md:grid-cols-3">
            {[
              ["Headquarters", "Riyadh, KSA"],
              ["District", "Al Taawun"],
              ["Short Address", "RHTA7423"],
              ["CR", "1010558646"],
              ["VAT", "312415959200003"],
              ["Issued", "May 2026"],
            ].map(([k, v]) => (
              <div key={k} className="bg-background p-5 text-left">
                <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                  {k}
                </div>
                <div className="mt-1.5 text-sm">{v}</div>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ---------- Footer ---------- */
function Footer() {
  return (
    <footer className="border-t border-border/60 bg-surface px-6 py-12">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <span className="grid h-7 w-7 place-items-center rounded-md bg-gold text-gold-foreground font-mono text-[11px] font-bold">
            V
          </span>
          <span className="font-display text-lg">VISO</span>
          <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
            Security Consultations
          </span>
        </div>
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
          Riyadh • Khobar • Jubail • Jeddah • Yanbu
        </p>
        <p className="text-[11px] text-muted-foreground">
          © {new Date().getFullYear()} Vision of Solutions for Security
          Consultations Co. Ltd
        </p>
      </div>
    </footer>
  );
}
