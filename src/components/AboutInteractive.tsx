import { useEffect, useMemo, useRef, useState, type MouseEvent } from "react";
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useTransform,
} from "framer-motion";
import { Link } from "@tanstack/react-router";
import { ContentImagePlaceholder } from "@/components/ContentImagePlaceholder";
import { CAPABILITY_TOPICS, type CapabilityTopic } from "@/data/capabilityTopics";

const ease = [0.16, 1, 0.3, 1] as const;

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

/** Continuously rotating 3D word sphere — click a label to open its explore page */
function TagCloudSphere({ topics = CAPABILITY_TOPICS }: { topics?: CapabilityTopic[] }) {
  const tags = topics;
  const wrapRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState(420);
  const [nodes, setNodes] = useState<
    {
      slug: string;
      text: string;
      x: number;
      y: number;
      scale: number;
      opacity: number;
      z: number;
    }[]
  >([]);
  const [hoveredSlug, setHoveredSlug] = useState<string | null>(null);

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

      const next = tags.map((topic, i) => {
        let p = base[i];
        p = rotateY(p, angle.current.y);
        p = rotateX(p, angle.current.x);
        const depth = (p.z + 1) / 2;
        const scale = 0.55 + depth * 0.85;
        const opacity = 0.22 + depth * 0.78;
        return {
          slug: topic.slug,
          text: topic.label,
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
      className="relative h-full w-full select-none touch-none overflow-hidden rounded-2xl border border-foreground/10 bg-gradient-to-br from-surface via-background to-primary/[0.04]"
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      role="img"
      aria-label="VISO security topics rotating sphere — click a label to open its page"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(212,175,55,0.1)_0%,transparent_58%)]" />
      <div className="pointer-events-none absolute inset-8 rounded-full border border-dashed border-primary/20" />
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-24 w-24 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/10 blur-2xl" />

      <div className="absolute left-1/2 top-1/2 h-0 w-0">
        {nodes.map((n) => {
          const isFront = n.opacity > 0.52;
          const isHot = hoveredSlug === n.slug;
          return (
            <Link
              key={n.slug}
              to="/explore/$slug"
              params={{ slug: n.slug }}
              onPointerDown={(e) => e.stopPropagation()}
              onPointerEnter={() => isFront && setHoveredSlug(n.slug)}
              onPointerLeave={() => setHoveredSlug(null)}
              className="absolute whitespace-nowrap font-display tracking-tight will-change-transform transition-[color,filter] duration-200"
              style={{
                transform: `translate(-50%, -50%) translate(${n.x}px, ${n.y}px) scale(${n.scale})`,
                opacity: n.opacity,
                fontSize: "clamp(11px, 1.55vw, 17px)",
                fontWeight: n.opacity > 0.7 || isHot ? 700 : 400,
                pointerEvents: isFront ? "auto" : "none",
                cursor: isFront ? "pointer" : "default",
                textShadow: isHot || n.opacity > 0.65 ? "0 0 20px rgba(212,175,55,0.35)" : "none",
                color: isHot
                  ? "var(--primary)"
                  : n.opacity > 0.72
                    ? "#1a1917"
                    : `rgba(26, 25, 23, ${0.28 + n.opacity * 0.55})`,
              }}
            >
              {n.text}
            </Link>
          );
        })}
      </div>

      <p className="pointer-events-none absolute bottom-4 left-0 right-0 text-center font-mono text-[9px] tracking-[0.28em] uppercase text-foreground/40">
        Drag to rotate · Click a topic to open
      </p>
    </div>
  );
}

function renderVisionTitle(title: string) {
  const split = title.match(/^(.+?\s+to)\s+(.+)$/i);
  if (!split) return title;
  return (
    <>
      {split[1]}{" "}
      <span className="text-primary font-light">{split[2]}</span>
    </>
  );
}

/* ---------- Main export ---------- */
export function AboutInteractive({
  title,
  subtitle,
  whoWeAreTitle,
  whoWeAreDesc,
}: {
  title: string;
  subtitle: string;
  whoWeAreTitle: string;
  whoWeAreDesc: string;
}) {
  const [mounted, setMounted] = useState(false);
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

      <div className="grid lg:grid-cols-12 gap-10 lg:gap-10 items-stretch mb-16 md:mb-24">
        <div className="lg:col-span-6 relative z-10 flex flex-col">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease }}
            className="relative flex-1 rounded-2xl border border-foreground/10 bg-gradient-to-br from-surface/90 via-background to-primary/[0.06] p-6 md:p-9 overflow-hidden"
          >
            <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-primary/10 blur-3xl" />
            <div className="flex items-center gap-3 mb-8">
              <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/15 font-mono text-sm font-bold text-primary">
                01
              </span>
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-foreground/45">
                  Section
                </p>
                <p className="font-display text-lg tracking-tight text-foreground">About VISO</p>
              </div>
            </div>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.85, delay: 0.06, ease }}
              className="font-display text-3xl md:text-4xl lg:text-[2.65rem] leading-[1.1] tracking-tight text-balance text-foreground max-w-xl"
            >
              {renderVisionTitle(title)}
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.12, ease }}
              className="mt-5 text-base md:text-lg text-foreground/55 leading-relaxed font-light max-w-xl text-pretty"
            >
              {subtitle}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.18, ease }}
              className="mt-8 rounded-xl border border-primary/20 bg-background/70 p-5 md:p-6"
            >
              <p className="font-mono text-[10px] tracking-[0.28em] text-primary uppercase mb-2">
                Who we are
              </p>
              <h3 className="font-display text-xl tracking-tight mb-2">{whoWeAreTitle}</h3>
              <p className="text-sm text-foreground/75 leading-relaxed">{whoWeAreDesc}</p>
              <Link
                to="/about"
                className="mt-6 inline-flex items-center justify-center gap-2 rounded-md bg-primary px-6 py-3 font-sans text-[11px] font-bold tracking-[0.16em] uppercase text-primary-foreground hover:bg-secondary transition-colors w-full sm:w-auto"
              >
                View full about page
                <span aria-hidden>→</span>
              </Link>
            </motion.div>

            <div className="mt-6 flex flex-wrap gap-2">
              {["5 offices", "Since 2020", "KSA-wide"].map((chip) => (
                <span
                  key={chip}
                  className="rounded-full border border-foreground/10 bg-foreground/[0.03] px-3 py-1 font-mono text-[10px] tracking-wider uppercase text-foreground/50"
                >
                  {chip}
                </span>
              ))}
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <Link
                to="/regulatory/moi"
                className="rounded-full border border-foreground/15 bg-background/80 px-3 py-1.5 font-mono text-[10px] tracking-wider uppercase text-foreground/60 hover:border-primary hover:text-primary transition-colors"
              >
                MOI
              </Link>
              <Link
                to="/regulatory/sais"
                className="rounded-full border border-primary/30 bg-primary/10 px-3 py-1.5 font-mono text-[10px] tracking-wider uppercase text-primary hover:bg-primary/15 transition-colors"
              >
                SAIS
              </Link>
              <Link
                to="/regulatory/hcis"
                className="rounded-full border border-foreground/15 bg-background/80 px-3 py-1.5 font-mono text-[10px] tracking-wider uppercase text-foreground/60 hover:border-primary hover:text-primary transition-colors"
              >
                HCIS
              </Link>
            </div>
          </motion.div>
        </div>

        <div className="lg:col-span-6 flex flex-col gap-4 min-h-[320px] md:min-h-[420px] lg:min-h-[480px]">
          <div className="relative flex-1 min-h-[260px] rounded-2xl overflow-hidden">
            {mounted ? (
              <TagCloudSphere />
            ) : (
              <div className="h-full w-full bg-transparent" />
            )}
          </div>
          <ContentImagePlaceholder
            src="/images/about/about-feature.jpg"
            alt="VISO team and security consulting"
            aspect="video"
            accent="#D4AF37"
            className="shrink-0"
          />
        </div>
      </div>
    </div>
  );
}
