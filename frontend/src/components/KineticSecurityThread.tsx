import { useEffect, useRef, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "@tanstack/react-router";
import {
  Shield,
  Sparkles,
  ArrowUpRight,
  Zap,
  Lock,
  Layers,
  CheckCircle2,
} from "lucide-react";
import { CAPABILITY_TOPICS, type CapabilityTopic } from "@/data/capabilityTopics";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const THREAD_TOPICS = [
  { slug: "risk-assessment", label: "Security Risk Assessment", category: "Assessment", stage: "01", tag: "Threat Model" },
  { slug: "concept-of-design", label: "Concept & Architecture", category: "Design", stage: "02", tag: "Strategy" },
  { slug: "hcis-compliance", label: "HCIS Directives & MOI", category: "Compliance", stage: "03", tag: "Governance" },
  { slug: "physical-security", label: "Physical & Perimeter Defense", category: "Design", stage: "04", tag: "Barriers" },
  { slug: "access-control", label: "Access Control & Biometrics", category: "Systems", stage: "05", tag: "Identity" },
  { slug: "cctv-coverage", label: "AI Video & CCTV Analytics", category: "Systems", stage: "06", tag: "Surveillance" },
  { slug: "fat-sat", label: "FAT / SAT Testing & Commissioning", category: "Delivery", stage: "07", tag: "Acceptance" },
  { slug: "operational-readiness", label: "24/7 Operational Readiness", category: "Delivery", stage: "08", tag: "Handover" },
];

const CATEGORY_STYLES: Record<string, { color: string; bg: string; border: string }> = {
  Assessment: { color: "#38BDF8", bg: "rgba(56, 189, 248, 0.12)", border: "rgba(56, 189, 248, 0.3)" },
  Design: { color: "#34D399", bg: "rgba(52, 211, 153, 0.12)", border: "rgba(52, 211, 153, 0.3)" },
  Compliance: { color: "#F87171", bg: "rgba(248, 113, 113, 0.12)", border: "rgba(248, 113, 113, 0.3)" },
  Systems: { color: "#C084FC", bg: "rgba(192, 132, 252, 0.12)", border: "rgba(192, 132, 252, 0.3)" },
  Delivery: { color: "#D4AF37", bg: "rgba(212, 175, 55, 0.12)", border: "rgba(212, 175, 55, 0.3)" },
};

export function KineticSecurityThread() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [hoveredSlug, setHoveredSlug] = useState<string | null>(null);
  const [activeStep, setActiveStep] = useState<number>(0);
  const [mousePos, setMousePos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  // GSAP ScrollTrigger timeline tracking
  useEffect(() => {
    const el = containerRef.current;
    if (!el || typeof window === "undefined") return;

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: el,
        start: "top 75%",
        end: "bottom 25%",
        onUpdate: (self) => {
          const progress = self.progress;
          const idx = Math.min(
            THREAD_TOPICS.length - 1,
            Math.floor(progress * THREAD_TOPICS.length)
          );
          setActiveStep(idx);
        },
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  // Kinetic Glowing Thread Canvas Animation Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId = 0;
    let time = 0;

    const render = () => {
      time += 0.02;
      const w = canvas.parentElement?.clientWidth || 500;
      const h = canvas.parentElement?.clientHeight || 700;
      const dpr = window.devicePixelRatio || 1;

      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.resetTransform();
      ctx.scale(dpr, dpr);

      ctx.clearRect(0, 0, w, h);

      // Thread anchors along the vertical path
      const stepHeight = h / (THREAD_TOPICS.length + 1);
      const points: { x: number; y: number }[] = [];

      for (let i = 0; i < THREAD_TOPICS.length; i++) {
        const baseY = stepHeight * (i + 1);
        const wave = Math.sin(time * 1.5 + i * 0.8) * 18;
        // Anchor points aligned with the node list on the left/center
        const baseX = 42 + wave;
        points.push({ x: baseX, y: baseY });
      }

      // 1. Draw glowing background thread guide
      if (points.length > 1) {
        // Outer broad glow
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(points[0].x, points[0].y - 20);
        for (let i = 0; i < points.length - 1; i++) {
          const xc = (points[i].x + points[i + 1].x) / 2;
          const yc = (points[i].y + points[i + 1].y) / 2;
          ctx.quadraticCurveTo(points[i].x, points[i].y, xc, yc);
        }
        const last = points[points.length - 1];
        ctx.lineTo(last.x, last.y + 30);
        ctx.strokeStyle = "rgba(212, 175, 55, 0.15)";
        ctx.lineWidth = 6;
        ctx.lineCap = "round";
        ctx.stroke();
        ctx.restore();

        // Core bright golden fiber thread
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(points[0].x, points[0].y - 20);
        for (let i = 0; i < points.length - 1; i++) {
          const xc = (points[i].x + points[i + 1].x) / 2;
          const yc = (points[i].y + points[i + 1].y) / 2;
          ctx.quadraticCurveTo(points[i].x, points[i].y, xc, yc);
        }
        ctx.lineTo(last.x, last.y + 30);
        ctx.strokeStyle = "rgba(212, 175, 55, 0.8)";
        ctx.lineWidth = 2;
        ctx.shadowColor = "#D4AF37";
        ctx.shadowBlur = 12;
        ctx.stroke();
        ctx.restore();

        // 2. Travelling Photon Light Pulses along the thread
        const pulseCount = 3;
        for (let p = 0; p < pulseCount; p++) {
          const progress = (time * 0.4 + p / pulseCount) % 1;
          const targetIndex = progress * (points.length - 1);
          const i1 = Math.floor(targetIndex);
          const i2 = Math.min(points.length - 1, i1 + 1);
          const t = targetIndex - i1;

          const p1 = points[i1];
          const p2 = points[i2];
          if (p1 && p2) {
            const px = (1 - t) * p1.x + t * p2.x;
            const py = (1 - t) * p1.y + t * p2.y;

            ctx.save();
            ctx.beginPath();
            ctx.arc(px, py, 4, 0, Math.PI * 2);
            ctx.fillStyle = "#FFF7D6";
            ctx.shadowColor = "#D4AF37";
            ctx.shadowBlur = 15;
            ctx.fill();
            ctx.restore();
          }
        }

        // 3. Anchor Node Glowing Connectors
        points.forEach((pt, i) => {
          const isHot = hoveredSlug === THREAD_TOPICS[i]?.slug;
          const isActive = activeStep === i;

          ctx.save();
          ctx.beginPath();
          ctx.arc(pt.x, pt.y, isHot || isActive ? 6 : 4, 0, Math.PI * 2);
          ctx.fillStyle = isHot || isActive ? "#FFD700" : "rgba(212, 175, 55, 0.6)";
          ctx.shadowColor = "#D4AF37";
          ctx.shadowBlur = isHot || isActive ? 16 : 6;
          ctx.fill();

          if (isHot || isActive) {
            ctx.beginPath();
            ctx.arc(pt.x, pt.y, 11, 0, Math.PI * 2);
            ctx.strokeStyle = "rgba(212, 175, 55, 0.5)";
            ctx.lineWidth = 1.5;
            ctx.stroke();
          }
          ctx.restore();
        });
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, [hoveredSlug, activeStep]);

  return (
    <div
      ref={containerRef}
      onMouseMove={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
      }}
      className="relative w-full h-full min-h-[580px] md:min-h-[640px] rounded-2xl border border-gold/25 bg-gradient-to-br from-[#0B0F19]/95 via-[#0D1322]/95 to-[#070A12]/95 shadow-[0_20px_50px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(212,175,55,0.2)] backdrop-blur-xl p-6 md:p-8 flex flex-col justify-between overflow-hidden"
    >
      {/* Background Interactive Kinetic Canvas */}
      <canvas
        ref={canvasRef}
        className="pointer-events-none absolute inset-0 w-full h-full z-0"
      />

      {/* Cyber Corner Markers */}
      <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-gold/70 pointer-events-none" />
      <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-gold/70 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-gold/70 pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-gold/70 pointer-events-none" />

      {/* Thread Header Bar */}
      <div className="relative z-10 flex items-center justify-between pb-4 border-b border-gold/15">
        <div className="flex items-center gap-2.5">
          <div className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
          <span className="font-mono text-xs font-bold tracking-widest text-gold uppercase flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-gold" />
            VISO CONTINUOUS SECURITY THREAD
          </span>
        </div>
        <span className="font-mono text-[9px] uppercase tracking-widest text-white/50 bg-white/5 px-2.5 py-1 rounded-full border border-white/10 hidden sm:inline-block">
          Click keyword to explore
        </span>
      </div>

      {/* Thread Items Stream */}
      <div className="relative z-10 my-4 flex flex-col justify-between flex-1 gap-2 pl-12 md:pl-14">
        {THREAD_TOPICS.map((topic, i) => {
          const isHovered = hoveredSlug === topic.slug;
          const isActive = activeStep === i;
          const catStyle = CATEGORY_STYLES[topic.category] || CATEGORY_STYLES.Delivery;

          return (
            <Link
              key={topic.slug}
              to="/explore/$slug"
              params={{ slug: topic.slug }}
              onPointerEnter={() => setHoveredSlug(topic.slug)}
              onPointerLeave={() => setHoveredSlug(null)}
              className="group relative flex items-center justify-between gap-3 p-3 rounded-xl border transition-all duration-300 backdrop-blur-xs cursor-pointer focus:outline-none"
              style={{
                borderColor: isHovered
                  ? "rgba(212, 175, 55, 0.6)"
                  : isActive
                    ? "rgba(212, 175, 55, 0.35)"
                    : "rgba(255, 255, 255, 0.07)",
                backgroundColor: isHovered
                  ? "rgba(212, 175, 55, 0.1)"
                  : isActive
                    ? "rgba(255, 255, 255, 0.04)"
                    : "rgba(0, 0, 0, 0.25)",
                transform: isHovered ? "translateX(8px) scale(1.02)" : "translateX(0px)",
                boxShadow: isHovered ? "0 4px 20px rgba(212, 175, 55, 0.15)" : "none",
              }}
            >
              {/* Left stage indicator and title */}
              <div className="flex items-center gap-3">
                <span
                  className="font-mono text-[10px] font-bold px-1.5 py-0.5 rounded border transition-colors"
                  style={{
                    color: isHovered ? "#FFD700" : catStyle.color,
                    backgroundColor: catStyle.bg,
                    borderColor: catStyle.border,
                  }}
                >
                  {topic.stage}
                </span>

                <div>
                  <h4
                    className="font-display text-sm md:text-base font-bold tracking-tight transition-colors"
                    style={{
                      color: isHovered ? "#FFD700" : "#FFFFFF",
                      textShadow: isHovered ? "0 0 12px rgba(212, 175, 55, 0.5)" : "none",
                    }}
                  >
                    {topic.label}
                  </h4>
                </div>
              </div>

              {/* Right Tag & Arrow */}
              <div className="flex items-center gap-2">
                <span className="font-mono text-[9px] uppercase tracking-wider text-white/50 px-2 py-0.5 rounded bg-white/5 border border-white/5 hidden sm:inline-block">
                  {topic.tag}
                </span>

                <div
                  className="p-1 rounded-lg border transition-all"
                  style={{
                    borderColor: isHovered ? "rgba(212, 175, 55, 0.6)" : "rgba(255, 255, 255, 0.1)",
                    backgroundColor: isHovered ? "rgba(212, 175, 55, 0.2)" : "transparent",
                    color: isHovered ? "#FFD700" : "rgba(255, 255, 255, 0.5)",
                  }}
                >
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Bottom Status Footer */}
      <div className="relative z-10 pt-3 border-t border-gold/15 flex flex-wrap items-center justify-between text-white/50 font-mono text-[9px] tracking-wider uppercase">
        <div className="flex items-center gap-1.5 text-gold">
          <Sparkles className="w-3 h-3" />
          <span>8-STAGE INTEGRATED DEFENSE LIFECYCLE</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="text-emerald-400 font-bold">100% TRACEABILITY</span>
        </div>
      </div>
    </div>
  );
}
