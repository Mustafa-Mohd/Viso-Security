import { useEffect, useMemo, useRef, useState, type MouseEvent } from "react";
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";
import { Link } from "@tanstack/react-router";

type Service = { title: string; desc: string };
type ProfileItem = { num: string; title: string; desc: string };

const ease = [0.16, 1, 0.3, 1] as const;

const TAG_POINTS = [
  "Risk Assessment",
  "Preliminary Design",
  "Detailed Design",
  "Operational Readiness",
  "SAIS Compliance",
  "Physical Security",
  "Project Management",
  "Security Philosophy",
  "Owner's Engineer",
  "Construction Monitoring",
  "Concept of Design",
  "Threat Analysis",
  "System Architecture",
  "Access Control",
  "CCTV Coverage",
  "FAT & SAT",
  "Regulatory Coordination",
  "Technical Oversight",
  "Site Supervision",
  "Handover Support",
];

type Vec3 = { x: number; y: number; z: number };

function fibonacciSphere(count: number, radius: number): Vec3[] {
  const pts: Vec3[] = [];
  const golden = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < count; i++) {
    const y = 1 - (i / (count - 1)) * 2;
    const r = Math.sqrt(1 - y * y);
    const theta = golden * i;
    pts.push({
      x: Math.cos(theta) * r * radius,
      y: y * radius,
      z: Math.sin(theta) * r * radius,
    });
  }
  return pts;
}

function rotateY(p: Vec3, a: number): Vec3 {
  const c = Math.cos(a);
  const s = Math.sin(a);
  return { x: p.x * c - p.z * s, y: p.y, z: p.x * s + p.z * c };
}

function rotateX(p: Vec3, a: number): Vec3 {
  const c = Math.cos(a);
  const s = Math.sin(a);
  return { x: p.x, y: p.y * c - p.z * s, z: p.y * s + p.z * c };
}

/** Continuously rotating 3D word sphere — main VISO security points */
function TagCloudSphere({ tags = TAG_POINTS }: { tags?: string[] }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState(420);
  const [nodes, setNodes] = useState<
    { text: string; x: number; y: number; scale: number; opacity: number; z: number }[]
  >([]);

  const base = useMemo(() => fibonacciSphere(tags.length, 1), [tags.length]);
  const angle = useRef({ x: 0.18, y: 0 });
  const drift = useRef({ x: 0.0012, y: 0.0042 });
  const drag = useRef({ active: false, lx: 0, ly: 0 });

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      const w = entry.contentRect.width;
      const h = entry.contentRect.height;
      setSize(Math.min(w, h) * 0.42);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    let raf = 0;
    const tick = () => {
      if (!drag.current.active) {
        angle.current.y += drift.current.y;
        angle.current.x += drift.current.x;
      }

      const next = tags.map((text, i) => {
        let p = base[i];
        p = rotateY(p, angle.current.y);
        p = rotateX(p, angle.current.x);
        const depth = (p.z + 1) / 2;
        const scale = 0.55 + depth * 0.85;
        const opacity = 0.22 + depth * 0.78;
        return {
          text,
          x: p.x * size,
          y: p.y * size,
          z: p.z,
          scale,
          opacity,
        };
      });

      next.sort((a, b) => a.z - b.z);
      setNodes(next);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [base, size, tags]);

  const onPointerDown = (e: React.PointerEvent) => {
    drag.current = { active: true, lx: e.clientX, ly: e.clientY };
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!drag.current.active) return;
    const dx = e.clientX - drag.current.lx;
    const dy = e.clientY - drag.current.ly;
    drag.current.lx = e.clientX;
    drag.current.ly = e.clientY;
    angle.current.y += dx * 0.005;
    angle.current.x -= dy * 0.005;
  };

  const onPointerUp = () => {
    drag.current.active = false;
  };

  return (
    <div
      ref={wrapRef}
      className="relative h-full w-full select-none touch-none overflow-hidden rounded-sm bg-transparent"
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      role="img"
      aria-label="VISO security topics rotating sphere"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(212,175,55,0.08)_0%,transparent_58%)]" />
      <div className="pointer-events-none absolute inset-6 rounded-full border border-foreground/[0.06]" />

      <div className="absolute left-1/2 top-1/2 h-0 w-0">
        {nodes.map((n) => (
          <span
            key={n.text}
            className="absolute whitespace-nowrap font-display tracking-tight will-change-transform"
            style={{
              transform: `translate(-50%, -50%) translate(${n.x}px, ${n.y}px) scale(${n.scale})`,
              opacity: n.opacity,
              fontSize: "clamp(11px, 1.55vw, 17px)",
              fontWeight: n.opacity > 0.7 ? 600 : 400,
              textShadow:
                n.opacity > 0.65
                  ? "0 0 16px rgba(212,175,55,0.22)"
                  : "none",
              color:
                n.opacity > 0.72
                  ? "#1a1917"
                  : `rgba(26, 25, 23, ${0.28 + n.opacity * 0.55})`,
            }}
          >
            {n.text}
          </span>
        ))}
      </div>

      <p className="pointer-events-none absolute bottom-4 left-0 right-0 text-center font-mono text-[9px] tracking-[0.28em] uppercase text-foreground/30">
        Drag to explore · Continuous motion
      </p>
    </div>
  );
}

const serviceVisuals = [
  {
    glyph: "◈",
    accent: "#1B4F72",
    soft: "rgba(27, 79, 114, 0.14)",
    glow: "rgba(27, 79, 114, 0.35)",
    image: "/images/security_consulting_panel.png",
  },
  {
    glyph: "◇",
    accent: "#0E7C66",
    soft: "rgba(14, 124, 102, 0.14)",
    glow: "rgba(14, 124, 102, 0.35)",
    image: "/images/translation_services_panel.png",
  },
  {
    glyph: "⬡",
    accent: "#B8860B",
    soft: "rgba(184, 134, 11, 0.16)",
    glow: "rgba(212, 175, 55, 0.4)",
    image: "/images/digital_access_portal_panel.png",
  },
  {
    glyph: "◎",
    accent: "#8B3A2A",
    soft: "rgba(139, 58, 42, 0.14)",
    glow: "rgba(139, 58, 42, 0.35)",
    image: "/images/sais_alignment_panel.png",
  },
];

function ServiceCard({
  service,
  index,
  active,
  onActivate,
}: {
  service: Service;
  index: number;
  active: boolean;
  onActivate: () => void;
}) {
  const ref = useRef<HTMLButtonElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const mx = useSpring(x, { stiffness: 220, damping: 22 });
  const my = useSpring(y, { stiffness: 220, damping: 22 });
  const rotateX = useTransform(my, [-0.5, 0.5], [6, -6]);
  const rotateY = useTransform(mx, [-0.5, 0.5], [-8, 8]);
  const visual = serviceVisuals[index % serviceVisuals.length];

  const onMove = (e: MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    x.set((e.clientX - r.left) / r.width - 0.5);
    y.set((e.clientY - r.top) / r.height - 0.5);
  };

  const onLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.button
      ref={ref}
      type="button"
      onMouseEnter={onActivate}
      onFocus={onActivate}
      onClick={onActivate}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
        borderColor: active ? "var(--primary)" : "rgba(0,0,0,0.08)",
        boxShadow: active ? `0 20px 40px rgba(212, 175, 55, 0.1)` : "none",
      }}
      animate={{
        scale: active ? 1.02 : 1,
      }}
      transition={{ duration: 0.45, ease }}
      className="relative text-left overflow-hidden rounded-xl border bg-surface flex flex-col transition-all duration-300 h-full w-full cursor-pointer group"
    >
      {/* Top Part: HD Colorful Image */}
      <div className="w-full h-44 overflow-hidden relative border-b border-foreground/5">
        <img
          src={visual.image}
          alt={service.title}
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />
        {/* Soft elegant gradient overlay at the top left showing glyph */}
        <div className="absolute top-3 left-3 bg-background/80 backdrop-blur-md w-10 h-10 rounded-full flex items-center justify-center border border-foreground/5 shadow-sm">
          <span
            className="font-display text-lg"
            style={{ color: "var(--primary)" }}
          >
            {visual.glyph}
          </span>
        </div>
      </div>

      {/* Bottom Part: Content */}
      <div className="p-6 flex-1 flex flex-col justify-between">
        <div>
          <h4 className="font-display text-xl tracking-tight mb-2 text-foreground group-hover:text-primary transition-colors duration-300">
            {service.title}
          </h4>
          <p className="text-sm font-light leading-relaxed text-foreground/60 text-justify">
            {service.desc}
          </p>
        </div>
      </div>
    </motion.button>
  );
}

function ProfileJourney({ items }: { items: ProfileItem[] }) {
  return (
    <div className="relative">
      <div className="flex items-end justify-between gap-6 mb-10">
        <div>
          <p className="font-mono text-[10px] tracking-[0.3em] text-foreground/40 uppercase mb-2">
            Profile path
          </p>
          <h3 className="font-display text-2xl md:text-3xl tracking-tight">
            From identity to delivery
          </h3>
        </div>
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        {items.map((item, i) => (
          <motion.div
            key={item.num + item.title}
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55, delay: i * 0.08, ease }}
            className="border border-foreground/10 bg-surface/70 p-5 md:p-6 rounded-sm"
          >
            <div className="font-mono text-xs tracking-[0.25em] text-primary mb-3">
              {item.num}
            </div>
            <h4 className="font-display text-lg tracking-tight mb-2">{item.title}</h4>
            <p className="text-sm text-foreground/50 font-light leading-relaxed">
              {item.desc}
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

/* ---------- Main export ---------- */
export function AboutInteractive({
  title,
  subtitle,
  whoWeAreTitle,
  whoWeAreDesc,
  services,
  profileContents,
}: {
  title: string;
  subtitle: string;
  whoWeAreTitle: string;
  whoWeAreDesc: string;
  services: Service[];
  profileContents: ProfileItem[];
}) {
  const [mounted, setMounted] = useState(false);
  const [activeService, setActiveService] = useState(0);
  const sectionRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);

  useEffect(() => setMounted(true), []);

  const onSectionMove = (e: MouseEvent) => {
    const el = sectionRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    mouseX.set((e.clientX - r.left) / r.width);
    mouseY.set((e.clientY - r.top) / r.height);
  };

  const spotX = useTransform(mouseX, (v) => `${v * 100}%`);
  const spotY = useTransform(mouseY, (v) => `${v * 100}%`);
  const spotlight = useMotionTemplate`radial-gradient(650px circle at ${spotX} ${spotY}, rgba(212,175,55,0.09), transparent 50%)`;

  const autoAdvance = services.length;

  useEffect(() => {
    const id = setInterval(() => {
      setActiveService((prev) => (prev + 1) % Math.max(autoAdvance, 1));
    }, 4200);
    return () => clearInterval(id);
  }, [autoAdvance]);

  return (
    <div
      ref={sectionRef}
      onMouseMove={onSectionMove}
      className="relative"
      style={{ perspective: 1400 }}
    >
      <motion.div
        style={{ backgroundImage: spotlight }}
        className="pointer-events-none absolute -inset-8 rounded-3xl"
      />

      <div className="grid lg:grid-cols-12 gap-10 lg:gap-6 items-center mb-16 md:mb-24">
        <div className="lg:col-span-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease }}
            className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.25em] text-muted-foreground mb-6"
          >
            <span className="text-gold">01</span>
            <span className="h-px w-8 bg-border" />
            <span>About VISO</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, delay: 0.08, ease }}
            className="font-display text-3xl md:text-5xl lg:text-[3.4rem] leading-[1.05] tracking-tight text-foreground max-w-xl"
          >
            {title}
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.16, ease }}
            className="mt-5 text-sm md:text-base text-foreground/50 leading-relaxed font-light max-w-md"
          >
            {subtitle}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.24, ease }}
            className="mt-8 p-5 md:p-6 border border-foreground/10 bg-surface/60 backdrop-blur-sm rounded-sm max-w-lg"
          >
            <p className="font-mono text-[10px] tracking-[0.28em] text-primary uppercase mb-2">
              Who We Are
            </p>
            <h3 className="font-display text-xl tracking-tight mb-2">{whoWeAreTitle}</h3>
            <p className="text-sm text-foreground/55 font-light leading-relaxed text-justify">
              {whoWeAreDesc}
            </p>
          </motion.div>

          <Link
            to="/about"
            className="mt-8 inline-flex items-center gap-3 font-sans text-xs font-bold tracking-[0.2em] text-primary group"
          >
            ENTER FULL PROFILE
            <span className="inline-block transition-transform duration-500 group-hover:translate-x-2">
              →
            </span>
          </Link>
        </div>

        <div className="lg:col-span-6 relative h-[320px] md:h-[420px] lg:h-[480px]">
          <div className="absolute inset-0 rounded-sm overflow-hidden">
            {mounted ? (
              <TagCloudSphere />
            ) : (
              <div className="h-full w-full bg-transparent" />
            )}
          </div>
        </div>
      </div>

      <div className="mb-20 md:mb-28" style={{ perspective: 1200 }}>
        <div className="flex items-end justify-between gap-6 mb-8">
          <div className="max-w-2xl">
            <p className="font-mono text-[10px] tracking-[0.3em] text-foreground/40 uppercase mb-2">
              Capabilities
            </p>
            <h3 className="font-display text-2xl md:text-3xl tracking-tight">
              Interactive service map
            </h3>
            <p className="mt-3 text-sm md:text-base text-foreground/55 font-light leading-relaxed">
              Four core VISO offerings — hover any panel to explore how consulting,
              translation, digital access, and SAIS alignment work together.
            </p>
          </div>
          <p className="hidden md:block text-xs text-foreground/35 font-light max-w-[180px] text-right">
            Hover to explore — panels respond in 3D space
          </p>
        </div>

        <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-5">
          {services.map((srv, i) => (
            <ServiceCard
              key={srv.title + i}
              service={srv}
              index={i}
              active={activeService === i}
              onActivate={() => setActiveService(i)}
            />
          ))}
        </div>
      </div>

      <ProfileJourney items={profileContents} />
    </div>
  );
}
