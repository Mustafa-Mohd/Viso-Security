import { useEffect, useMemo, useRef, useState, type PointerEvent } from "react";
import { Link } from "@tanstack/react-router";
import { CAPABILITY_TOPICS, type CapabilityTopic } from "@/data/capabilityTopics";
import { Sparkles, Move } from "lucide-react";

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
  return { x: p.x * c - p.z * s, z: p.y * s + p.z * c };
}

export function FlyingWordsSphere({
  topics = CAPABILITY_TOPICS,
}: {
  topics?: CapabilityTopic[];
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [size, setSize] = useState(240);
  const [hoveredSlug, setHoveredSlug] = useState<string | null>(null);

  const base = useMemo(() => fibonacciSphere(topics.length, 1), [topics.length]);
  const angle = useRef({ x: 0.15, y: 0.2 });
  const velocity = useRef({ x: 0, y: 0 });
  const drift = useRef({ x: 0.0012, y: 0.004 });
  const drag = useRef({ active: false, lx: 0, ly: 0, moved: false });

  const [nodes, setNodes] = useState<
    {
      slug: string;
      text: string;
      category: string;
      x: number;
      y: number;
      z: number;
      scale: number;
      opacity: number;
    }[]
  >([]);

  // Resize observer
  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      const w = entry.contentRect.width;
      const h = entry.contentRect.height;
      if (w > 0 && h > 0) {
        setSize(Math.min(w, h) * 0.42);
      }
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // 3D Flying Words Projection & Physics Loop
  useEffect(() => {
    let raf = 0;
    const tick = () => {
      if (drag.current.active) {
        // Dragging controls angle directly
      } else {
        // Auto continuous orbital drift
        angle.current.y += drift.current.y;
        angle.current.x += drift.current.x;

        // Apply inertia velocity with damping
        angle.current.y += velocity.current.y;
        angle.current.x += velocity.current.x;
        velocity.current.x *= 0.94;
        velocity.current.y *= 0.94;
      }

      const next = topics.map((topic, i) => {
        let p = base[i] || { x: 0, y: 0, z: 1 };
        p = rotateY(p, angle.current.y);
        p = rotateX(p, angle.current.x);
        const depth = (p.z + 1) / 2; // 0 to 1
        const scale = 0.52 + depth * 0.82;
        const opacity = Math.max(0.18, Math.min(1, 0.22 + depth * 0.78));

        return {
          slug: topic.slug,
          text: topic.label,
          category: topic.category,
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
  }, [base, size, topics]);

  // Ambient Celestial Background Canvas Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId = 0;
    let time = 0;

    // Ambient floating starlight particles
    const particleCount = 35;
    const particles = Array.from({ length: particleCount }, () => ({
      x: Math.random() * 600,
      y: Math.random() * 600,
      radius: Math.random() * 1.5 + 0.5,
      alpha: Math.random() * 0.5 + 0.1,
      speed: Math.random() * 0.02 + 0.005,
    }));

    const render = () => {
      time += 0.015;
      const w = canvas.parentElement?.clientWidth || 500;
      const h = canvas.parentElement?.clientHeight || 500;
      const dpr = window.devicePixelRatio || 1;

      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.resetTransform();
      ctx.scale(dpr, dpr);

      ctx.clearRect(0, 0, w, h);
      const cx = w / 2;
      const cy = h / 2;
      const r = Math.min(w, h) * 0.42;

      // 1. Central Golden Core Glow
      const coreGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, r * 1.1);
      coreGrad.addColorStop(0, "rgba(212, 175, 55, 0.16)");
      coreGrad.addColorStop(0.5, "rgba(212, 175, 55, 0.04)");
      coreGrad.addColorStop(1, "transparent");
      ctx.fillStyle = coreGrad;
      ctx.beginPath();
      ctx.arc(cx, cy, r * 1.1, 0, Math.PI * 2);
      ctx.fill();

      // 2. Rotating Celestial Orbital Rings
      [r * 0.75, r * 1.05].forEach((ringR, idx) => {
        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(time * (idx === 0 ? 0.15 : -0.1));
        ctx.beginPath();
        ctx.arc(0, 0, ringR, 0, Math.PI * 2);
        ctx.strokeStyle = idx === 0 ? "rgba(212, 175, 55, 0.15)" : "rgba(212, 175, 55, 0.08)";
        ctx.lineWidth = 1;
        ctx.setLineDash(idx === 0 ? [8, 14] : [4, 8]);
        ctx.stroke();

        // Orbiting golden photon bead
        const beadX = Math.cos(time * 0.6) * ringR;
        const beadY = Math.sin(time * 0.6) * ringR;
        ctx.beginPath();
        ctx.arc(beadX, beadY, 2, 0, Math.PI * 2);
        ctx.fillStyle = "#D4AF37";
        ctx.shadowColor = "#D4AF37";
        ctx.shadowBlur = 8;
        ctx.fill();

        ctx.restore();
      });

      // 3. Floating ambient dust particles
      particles.forEach((p, idx) => {
        p.alpha += Math.sin(time * 2 + idx) * 0.005;
        const a = Math.max(0.05, Math.min(0.7, p.alpha));
        ctx.beginPath();
        ctx.arc(p.x % w, p.y % h, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(212, 175, 55, ${a})`;
        ctx.fill();
      });

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, []);

  const onPointerDown = (e: PointerEvent<HTMLDivElement>) => {
    drag.current = { active: true, lx: e.clientX, ly: e.clientY, moved: false };
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e: PointerEvent<HTMLDivElement>) => {
    if (!drag.current.active) return;
    const dx = e.clientX - drag.current.lx;
    const dy = e.clientY - drag.current.ly;
    if (Math.abs(dx) > 3 || Math.abs(dy) > 3) {
      drag.current.moved = true;
    }
    drag.current.lx = e.clientX;
    drag.current.ly = e.clientY;

    angle.current.y += dx * 0.0055;
    angle.current.x -= dy * 0.0055;
    velocity.current.y = dx * 0.0025;
    velocity.current.x = -dy * 0.0025;
  };

  const onPointerUp = () => {
    drag.current.active = false;
  };

  return (
    <div
      ref={wrapRef}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      className="relative h-full w-full min-h-[460px] md:min-h-[540px] select-none touch-none overflow-hidden rounded-2xl border border-gold/25 bg-gradient-to-b from-[#0A0E1A]/95 via-[#0D121F]/95 to-[#070A12]/95 shadow-[0_20px_50px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(212,175,55,0.2)] cursor-grab active:cursor-grabbing flex flex-col justify-between"
      role="img"
      aria-label="VISO 3D Flying Word Cloud Sphere"
    >
      {/* Ambient Canvas Layer */}
      <canvas
        ref={canvasRef}
        className="pointer-events-none absolute inset-0 w-full h-full"
      />

      {/* Top Header Badge */}
      <div className="relative z-20 flex items-center justify-between p-4 md:p-5 border-b border-gold/15 bg-black/30 backdrop-blur-xs">
        <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-widest text-gold font-bold">
          <Sparkles className="w-3.5 h-3.5 text-gold" />
          <span>VISO 3D CAPABILITY ORBIT</span>
        </div>
        <div className="flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-widest text-white/50 bg-white/5 px-2.5 py-1 rounded-full border border-white/10">
          <Move className="w-3 h-3 text-gold" />
          <span>Drag to Spin</span>
        </div>
      </div>

      {/* 3D Flying Words Layer */}
      <div className="relative flex-1 flex items-center justify-center">
        <div className="absolute left-1/2 top-1/2 h-0 w-0">
          {nodes.map((n) => {
            const isFront = n.opacity > 0.48;
            const isHot = hoveredSlug === n.slug;

            return (
              <Link
                key={n.slug}
                to="/explore/$slug"
                params={{ slug: n.slug }}
                onPointerDown={(e) => e.stopPropagation()}
                onClick={(e) => {
                  if (drag.current.moved) {
                    e.preventDefault();
                  }
                }}
                onPointerEnter={() => isFront && setHoveredSlug(n.slug)}
                onPointerLeave={() => setHoveredSlug(null)}
                className="absolute whitespace-nowrap font-display tracking-tight will-change-transform transition-[color,filter,transform] duration-200"
                style={{
                  transform: `translate(-50%, -50%) translate(${n.x}px, ${n.y}px) scale(${isHot ? n.scale * 1.2 : n.scale})`,
                  opacity: n.opacity,
                  fontSize: "clamp(12px, 1.75vw, 19px)",
                  fontWeight: n.opacity > 0.72 || isHot ? 700 : 400,
                  pointerEvents: isFront ? "auto" : "none",
                  cursor: isFront ? "pointer" : "default",
                  zIndex: Math.round((n.z + 1) * 50),
                  textShadow:
                    isHot || n.opacity > 0.7
                      ? "0 0 25px rgba(212, 175, 55, 0.75), 0 0 10px rgba(212, 175, 55, 0.4)"
                      : "none",
                  color: isHot
                    ? "#FFD700"
                    : n.opacity > 0.75
                      ? "#FFFFFF"
                      : `rgba(255, 255, 255, ${0.25 + n.opacity * 0.55})`,
                }}
              >
                {n.text}
              </Link>
            );
          })}
        </div>
      </div>

      {/* Bottom Floating Hint */}
      <div className="relative z-20 p-4 border-t border-gold/10 bg-black/30 backdrop-blur-xs flex items-center justify-between font-mono text-[9px] uppercase tracking-[0.25em] text-white/50">
        <span>3D Perspective Matrix</span>
        <span className="text-gold/80">Click any topic to explore →</span>
      </div>
    </div>
  );
}
