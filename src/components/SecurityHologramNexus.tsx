import { useEffect, useMemo, useRef, useState, type MouseEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "@tanstack/react-router";
import {
  Shield,
  Activity,
  Radio,
  Layers,
  Cpu,
  Zap,
  Globe2,
  Lock,
  ChevronRight,
  Sparkles,
  RotateCcw,
  ZoomIn,
  ZoomOut,
  Play,
  Pause,
  Filter,
  ExternalLink,
  X,
  Compass,
} from "lucide-react";
import { CAPABILITY_TOPICS, type CapabilityTopic } from "@/data/capabilityTopics";

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

// Category styling tokens
const CATEGORY_COLORS: Record<string, { hex: string; bg: string; border: string }> = {
  Assessment: { hex: "#38BDF8", bg: "rgba(56, 189, 248, 0.15)", border: "rgba(56, 189, 248, 0.4)" },
  Design: { hex: "#34D399", bg: "rgba(52, 211, 153, 0.15)", border: "rgba(52, 211, 153, 0.4)" },
  Delivery: { hex: "#D4AF37", bg: "rgba(212, 175, 55, 0.15)", border: "rgba(212, 175, 55, 0.4)" },
  Compliance: { hex: "#F87171", bg: "rgba(248, 113, 113, 0.15)", border: "rgba(248, 113, 113, 0.4)" },
  Systems: { hex: "#C084FC", bg: "rgba(192, 132, 252, 0.15)", border: "rgba(192, 132, 252, 0.4)" },
};

// Regional KSA nodes data
const KSA_HUBS = [
  { id: "riyadh", name: "Riyadh HQ", code: "RUH-01", x: 50, y: 48, status: "NOMINAL", latency: "2ms", level: "HCIS Class 1", route: "/about" },
  { id: "khobar", name: "Khobar Hub", code: "KBR-02", x: 74, y: 42, status: "ONLINE", latency: "4ms", level: "Industrial Spec", route: "/about" },
  { id: "jubail", name: "Jubail Center", code: "JBL-03", x: 71, y: 34, status: "ACTIVE", latency: "5ms", level: "Critical Infra", route: "/about" },
  { id: "jeddah", name: "Jeddah Station", code: "JED-04", x: 26, y: 64, status: "NOMINAL", latency: "3ms", level: "Commercial & Port", route: "/about" },
  { id: "yanbu", name: "Yanbu Facility", code: "YNB-05", x: 22, y: 48, status: "ONLINE", latency: "6ms", level: "Energy Defense", route: "/about" },
];

const HCIS_DIRECTIVES = [
  { code: "SEC-01", title: "General Security Requirements", status: "VERIFIED", color: "#D4AF37" },
  { code: "SEC-02", title: "Perimeter & Barrier Systems", status: "CERTIFIED", color: "#E5C158" },
  { code: "SEC-03", title: "Access Control & Turnstiles", status: "COMPLIANT", color: "#10B981" },
  { code: "SEC-04", title: "CCTV & Video Analytics", status: "OPTIMAL", color: "#3B82F6" },
  { code: "SEC-05", title: "Intrusion Detection (IDS)", status: "ACTIVE", color: "#8B5CF6" },
  { code: "SEC-06", title: "Security Control Centers", status: "MISSION READY", color: "#EC4899" },
  { code: "SEC-07", title: "Cyber-Physical Interfaces", status: "ENCRYPTED", color: "#F59E0B" },
];

export function SecurityHologramNexus() {
  // Main view tab (3D Sphere is now the prominent default mode)
  const [activeTab, setActiveTab] = useState<"sphere" | "radar" | "hcis">("sphere");
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [selectedTopic, setSelectedTopic] = useState<CapabilityTopic | null>(null);
  const [hoveredTopic, setHoveredTopic] = useState<string | null>(null);

  // 3D Sphere Interactive Controls
  const [autoRotate, setAutoRotate] = useState<boolean>(true);
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [showArcs, setShowArcs] = useState<boolean>(true);
  const [shockwaves, setShockwaves] = useState<{ id: number; x: number; y: number }[]>([]);
  const [scanPulse, setScanPulse] = useState(false);

  // Regional Hubs
  const [selectedHub, setSelectedHub] = useState<(typeof KSA_HUBS)[0] | null>(KSA_HUBS[0]);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [canvasSize, setCanvasSize] = useState({ w: 640, h: 520 });

  // 3D Sphere Physics & Rotation
  const sphereTopics = useMemo(() => {
    if (selectedCategory === "ALL") return CAPABILITY_TOPICS;
    return CAPABILITY_TOPICS.filter((t) => t.category === selectedCategory);
  }, [selectedCategory]);

  const sphereBase = useMemo(() => fibonacciSphere(sphereTopics.length, 1), [sphereTopics.length]);
  const angle = useRef({ x: 0.25, y: 0.1 });
  const velocity = useRef({ x: 0, y: 0 });
  const drift = useRef({ x: 0.0008, y: 0.003 });
  const drag = useRef({ active: false, lx: 0, ly: 0, moved: false });
  const mouseParallax = useRef({ x: 0.5, y: 0.5, tx: 0.5, ty: 0.5 });

  const [sphereNodes, setSphereNodes] = useState<
    {
      topic: CapabilityTopic;
      x: number;
      y: number;
      z: number;
      scale: number;
      opacity: number;
      color: string;
    }[]
  >([]);

  // Telemetry real-time angles display
  const [telemetry, setTelemetry] = useState({ az: 0, el: 0, nodes: 0 });

  // Trigger golden energy scan shockwave
  const triggerDiagnostics = () => {
    setScanPulse(true);
    const newId = Date.now();
    setShockwaves((prev) => [...prev, { id: newId, x: 50, y: 50 }]);
    setTimeout(() => {
      setShockwaves((prev) => prev.filter((s) => s.id !== newId));
      setScanPulse(false);
    }, 2400);
  };

  const resetCamera = () => {
    angle.current = { x: 0.25, y: 0.1 };
    velocity.current = { x: 0, y: 0 };
    setZoomLevel(1);
  };

  // Resize observer
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      if (width > 0 && height > 0) {
        setCanvasSize({ w: Math.floor(width), h: Math.floor(height) });
      }
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Mouse move handler for 3D parallax
  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    mouseParallax.current.tx = (e.clientX - rect.left) / rect.width;
    mouseParallax.current.ty = (e.clientY - rect.top) / rect.height;
  };

  // 3D Sphere projection loop
  useEffect(() => {
    let raf = 0;
    let count = 0;

    const tick = () => {
      // Inertia & auto-rotate
      if (drag.current.active) {
        // Dragging is updating angles directly
      } else {
        if (autoRotate) {
          angle.current.y += drift.current.y;
          angle.current.x += drift.current.x;
        }
        // Damping velocity
        angle.current.y += velocity.current.y;
        angle.current.x += velocity.current.x;
        velocity.current.x *= 0.94;
        velocity.current.y *= 0.94;
      }

      // Base radius scaled by container & user zoom
      const baseRadius = Math.min(canvasSize.w, canvasSize.h) * 0.36 * zoomLevel;

      const next = sphereTopics.map((topic, i) => {
        let p = sphereBase[i] || { x: 0, y: 0, z: 1 };
        p = rotateY(p, angle.current.y);
        p = rotateX(p, angle.current.x);
        const depth = (p.z + 1) / 2;
        const scale = 0.5 + depth * 0.85;
        const opacity = Math.max(0.15, Math.min(1, 0.18 + depth * 0.82));
        const color = CATEGORY_COLORS[topic.category]?.hex || "#D4AF37";

        return {
          topic,
          x: p.x * baseRadius,
          y: p.y * baseRadius,
          z: p.z,
          scale,
          opacity,
          color,
        };
      });

      next.sort((a, b) => a.z - b.z);
      setSphereNodes(next);

      count++;
      if (count % 8 === 0) {
        setTelemetry({
          az: Math.round(((angle.current.y * 180) / Math.PI) % 360),
          el: Math.round(((angle.current.x * 180) / Math.PI) % 360),
          nodes: next.length,
        });
      }

      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [sphereBase, sphereTopics, canvasSize, zoomLevel, autoRotate]);

  // Main Canvas 3D WebGL / 2D Hologram Graphics Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId = 0;
    let time = 0;
    let radarAngle = 0;

    // Background particle vortex
    const particleCount = 60;
    const particles: {
      x: number;
      y: number;
      z: number;
      radius: number;
      theta: number;
      phi: number;
      speed: number;
      size: number;
    }[] = [];

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: 0,
        y: 0,
        z: 0,
        radius: 120 + Math.random() * 140,
        theta: Math.random() * Math.PI * 2,
        phi: (Math.random() - 0.5) * Math.PI,
        speed: (Math.random() * 0.006 + 0.002) * (Math.random() > 0.5 ? 1 : -1),
        size: Math.random() * 1.8 + 0.8,
      });
    }

    const render = () => {
      time += 0.018;
      radarAngle += 0.03;

      // Smooth mouse lerp
      mouseParallax.current.x += (mouseParallax.current.tx - mouseParallax.current.x) * 0.06;
      mouseParallax.current.y += (mouseParallax.current.ty - mouseParallax.current.y) * 0.06;

      const { w, h } = canvasSize;
      const dpr = window.devicePixelRatio || 1;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.resetTransform();
      ctx.scale(dpr, dpr);

      ctx.clearRect(0, 0, w, h);

      const cx = w / 2 + (mouseParallax.current.x - 0.5) * 30;
      const cy = h / 2 + (mouseParallax.current.y - 0.5) * 25;
      const sphereRadius = Math.min(w, h) * 0.36 * zoomLevel;

      // 1. Perspective Cyber Grid Floor & Ceiling
      ctx.save();
      ctx.strokeStyle = "rgba(212, 175, 55, 0.04)";
      ctx.lineWidth = 1;
      const gridSize = 44;
      for (let x = 0; x < w; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
        ctx.stroke();
      }
      for (let y = 0; y < h; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
      }
      ctx.restore();

      // 2. 3D Wireframe Globe Latitudes & Longitudes
      if (activeTab === "sphere") {
        ctx.save();
        ctx.translate(cx, cy);

        // Core Ambient Sphere Glow
        const sphereGlow = ctx.createRadialGradient(0, 0, 0, 0, 0, sphereRadius * 1.1);
        sphereGlow.addColorStop(0, "rgba(212, 175, 55, 0.18)");
        sphereGlow.addColorStop(0.6, "rgba(212, 175, 55, 0.04)");
        sphereGlow.addColorStop(1, "transparent");
        ctx.fillStyle = sphereGlow;
        ctx.beginPath();
        ctx.arc(0, 0, sphereRadius * 1.1, 0, Math.PI * 2);
        ctx.fill();

        // 3D Rotating Longitude Rings
        const longitudeRings = [0, Math.PI / 4, Math.PI / 2, (3 * Math.PI) / 4];
        longitudeRings.forEach((lon) => {
          ctx.save();
          const rLon = lon + angle.current.y;
          ctx.beginPath();
          ctx.ellipse(0, 0, Math.abs(Math.cos(rLon)) * sphereRadius, sphereRadius, angle.current.x, 0, Math.PI * 2);
          ctx.strokeStyle = "rgba(212, 175, 55, 0.12)";
          ctx.lineWidth = 1;
          ctx.setLineDash([4, 10]);
          ctx.stroke();
          ctx.restore();
        });

        // 3D Latitude Rings
        const latitudes = [-0.6, -0.3, 0, 0.3, 0.6];
        latitudes.forEach((lat) => {
          const latY = lat * sphereRadius;
          const latRadius = Math.sqrt(Math.max(0, sphereRadius * sphereRadius - latY * latY));
          ctx.save();
          ctx.beginPath();
          ctx.ellipse(0, latY, latRadius, latRadius * 0.28, 0, 0, Math.PI * 2);
          ctx.strokeStyle = lat === 0 ? "rgba(212, 175, 55, 0.35)" : "rgba(212, 175, 55, 0.09)";
          ctx.lineWidth = lat === 0 ? 1.5 : 1;
          if (lat !== 0) ctx.setLineDash([6, 8]);
          ctx.stroke();
          ctx.restore();
        });

        // Outer Cyber Gimbal Halo Ring
        ctx.save();
        ctx.rotate(time * 0.15);
        ctx.beginPath();
        ctx.arc(0, 0, sphereRadius * 1.25, 0, Math.PI * 2);
        ctx.strokeStyle = "rgba(212, 175, 55, 0.2)";
        ctx.lineWidth = 1.2;
        ctx.setLineDash([12, 16, 2, 16]);
        ctx.stroke();

        // Orbiting Gimbal Satellites
        for (let a = 0; a < Math.PI * 2; a += Math.PI / 2) {
          const satX = Math.cos(a + time * 0.4) * sphereRadius * 1.25;
          const satY = Math.sin(a + time * 0.4) * sphereRadius * 1.25;
          ctx.beginPath();
          ctx.arc(satX, satY, 2.5, 0, Math.PI * 2);
          ctx.fillStyle = "#D4AF37";
          ctx.shadowColor = "#D4AF37";
          ctx.shadowBlur = 8;
          ctx.fill();
        }
        ctx.restore();

        // 3D Connecting Defense Arcs between nodes
        if (showArcs && sphereNodes.length > 1) {
          ctx.save();
          for (let i = 0; i < sphereNodes.length; i += 2) {
            const n1 = sphereNodes[i];
            const n2 = sphereNodes[(i + 3) % sphereNodes.length];
            if (!n1 || !n2) continue;

            // Only draw if on front half of sphere
            if (n1.z > -0.3 && n2.z > -0.3) {
              const midX = (n1.x + n2.x) / 2;
              const midY = (n1.y + n2.y) / 2 - 25 * zoomLevel;

              ctx.beginPath();
              ctx.moveTo(n1.x, n1.y);
              ctx.quadraticCurveTo(midX, midY, n2.x, n2.y);
              ctx.strokeStyle = `rgba(212, 175, 55, ${(n1.opacity + n2.opacity) * 0.15})`;
              ctx.lineWidth = 1;
              ctx.stroke();

              // Pulsing photon packet travelling along the arc
              const tPacket = (time * 1.2 + i * 0.3) % 1;
              const packetX = (1 - tPacket) * (1 - tPacket) * n1.x + 2 * (1 - tPacket) * tPacket * midX + tPacket * tPacket * n2.x;
              const packetY = (1 - tPacket) * (1 - tPacket) * n1.y + 2 * (1 - tPacket) * tPacket * midY + tPacket * tPacket * n2.y;

              ctx.beginPath();
              ctx.arc(packetX, packetY, 2, 0, Math.PI * 2);
              ctx.fillStyle = "#F5D77F";
              ctx.shadowColor = "#D4AF37";
              ctx.shadowBlur = 6;
              ctx.fill();
            }
          }
          ctx.restore();
        }

        ctx.restore();
      }

      // 3. Radar Beam Sweep (Active in Radar / HCIS mode)
      if (activeTab === "radar" || activeTab === "hcis") {
        ctx.save();
        ctx.translate(cx, cy);

        // Concentric radar rings
        [60, 120, 180, 240].forEach((r, idx) => {
          ctx.beginPath();
          ctx.arc(0, 0, r, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(212, 175, 55, ${0.16 - idx * 0.03})`;
          ctx.lineWidth = 1;
          ctx.setLineDash(idx % 2 === 0 ? [8, 12] : [4, 6]);
          ctx.stroke();
        });

        // 360° Radar Sweep
        const sweepGrad = ctx.createRadialGradient(0, 0, 10, 0, 0, 240);
        sweepGrad.addColorStop(0, "rgba(212, 175, 55, 0.4)");
        sweepGrad.addColorStop(0.8, "rgba(212, 175, 55, 0.05)");
        sweepGrad.addColorStop(1, "transparent");

        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.arc(0, 0, 240, radarAngle, radarAngle + Math.PI / 4);
        ctx.closePath();
        ctx.fillStyle = sweepGrad;
        ctx.fill();

        // Leading laser sweep line
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(Math.cos(radarAngle + Math.PI / 4) * 240, Math.sin(radarAngle + Math.PI / 4) * 240);
        ctx.strokeStyle = "rgba(212, 175, 55, 0.9)";
        ctx.lineWidth = 1.5;
        ctx.shadowColor = "#D4AF37";
        ctx.shadowBlur = 12;
        ctx.stroke();

        ctx.restore();
      }

      // 4. 3D Particle Cloud orbiting in space
      ctx.save();
      ctx.translate(cx, cy);
      particles.forEach((p) => {
        p.theta += p.speed;
        const px = Math.cos(p.theta) * Math.cos(p.phi) * p.radius;
        const py = Math.sin(p.phi) * p.radius;
        const pz = Math.sin(p.theta) * Math.cos(p.phi) * p.radius;

        let pRot = rotateY({ x: px, y: py, z: pz }, angle.current.y * 0.4);
        pRot = rotateX(pRot, angle.current.x * 0.4);

        const depth = (pRot.z + p.radius) / (p.radius * 2);
        const alpha = Math.max(0.08, Math.min(0.7, 0.1 + depth * 0.6));

        ctx.beginPath();
        ctx.arc(pRot.x, pRot.y, p.size * (0.6 + depth * 0.8), 0, Math.PI * 2);
        ctx.fillStyle = `rgba(212, 175, 55, ${alpha})`;
        ctx.fill();
      });
      ctx.restore();

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, [canvasSize, activeTab, zoomLevel, showArcs, sphereNodes]);

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="relative w-full rounded-2xl overflow-hidden border border-gold/30 bg-[#070A12]/95 text-white shadow-[0_24px_70px_rgba(0,0,0,0.6),inset_0_1px_0_rgba(212,175,55,0.25)] backdrop-blur-2xl select-none flex flex-col"
      style={{ minHeight: "560px" }}
    >
      {/* 3D Background Interactive Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none z-0"
      />

      {/* Futuristic Corner Framing Accents */}
      <div className="absolute top-0 left-0 w-10 h-10 border-t-2 border-l-2 border-gold/80 z-20 pointer-events-none" />
      <div className="absolute top-0 right-0 w-10 h-10 border-t-2 border-r-2 border-gold/80 z-20 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-10 h-10 border-b-2 border-l-2 border-gold/80 z-20 pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-10 h-10 border-b-2 border-r-2 border-gold/80 z-20 pointer-events-none" />

      {/* Top HUD Telemetry Navigation Bar */}
      <div className="relative z-20 flex flex-wrap items-center justify-between gap-3 px-5 py-3 border-b border-gold/15 bg-black/50 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="relative flex h-3 w-3 items-center justify-center">
            <span className="absolute h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
            <span className="relative h-2 w-2 rounded-full bg-emerald-500" />
          </div>
          <div className="flex items-center gap-2 font-mono text-[11px] tracking-widest text-gold font-bold uppercase">
            <Shield className="w-3.5 h-3.5 text-gold" />
            <span>VISO 3D SECURITY NEXUS</span>
          </div>
        </div>

        {/* Mode Switcher Tabs */}
        <div className="flex items-center gap-1 bg-white/5 p-1 rounded-lg border border-white/10">
          <button
            onClick={() => setActiveTab("sphere")}
            className={`flex items-center gap-1.5 px-3 py-1 rounded text-[11px] font-mono tracking-wider transition-all cursor-pointer ${
              activeTab === "sphere"
                ? "bg-gold text-black font-bold shadow-[0_0_15px_rgba(212,175,55,0.45)]"
                : "text-white/60 hover:text-white hover:bg-white/5"
            }`}
          >
            <Globe2 className="w-3 h-3" />
            <span>3D SPHERE</span>
          </button>
          <button
            onClick={() => setActiveTab("radar")}
            className={`flex items-center gap-1.5 px-3 py-1 rounded text-[11px] font-mono tracking-wider transition-all cursor-pointer ${
              activeTab === "radar"
                ? "bg-gold text-black font-bold shadow-[0_0_15px_rgba(212,175,55,0.45)]"
                : "text-white/60 hover:text-white hover:bg-white/5"
            }`}
          >
            <Radio className="w-3 h-3" />
            <span>KSA RADAR</span>
          </button>
          <button
            onClick={() => setActiveTab("hcis")}
            className={`flex items-center gap-1.5 px-3 py-1 rounded text-[11px] font-mono tracking-wider transition-all cursor-pointer ${
              activeTab === "hcis"
                ? "bg-gold text-black font-bold shadow-[0_0_15px_rgba(212,175,55,0.45)]"
                : "text-white/60 hover:text-white hover:bg-white/5"
            }`}
          >
            <Layers className="w-3 h-3" />
            <span>HCIS MATRIX</span>
          </button>
        </div>

        {/* Pulse Scan Trigger */}
        <button
          onClick={triggerDiagnostics}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gold/15 hover:bg-gold/25 border border-gold/40 text-gold font-mono text-[10px] font-bold tracking-widest uppercase transition-all hover:scale-105 active:scale-95 cursor-pointer shadow-[0_0_12px_rgba(212,175,55,0.25)]"
        >
          <Zap className={`w-3 h-3 ${scanPulse ? "animate-spin text-amber-300" : ""}`} />
          <span>{scanPulse ? "SCANNING..." : "PULSE DIAGNOSTIC"}</span>
        </button>
      </div>

      {/* Expanding Shockwave Ripple on Trigger */}
      <AnimatePresence>
        {shockwaves.map((s) => (
          <motion.div
            key={s.id}
            initial={{ scale: 0.1, opacity: 0.95 }}
            animate={{ scale: 3.8, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 2.2, ease: "easeOut" }}
            className="pointer-events-none absolute inset-0 m-auto h-72 w-72 rounded-full border-2 border-gold shadow-[0_0_60px_rgba(212,175,55,0.7)] z-10"
          />
        ))}
      </AnimatePresence>

      {/* Main Interactive Stage */}
      <div className="relative z-10 flex-1 p-5 md:p-6 flex flex-col justify-between">
        {/* ============================================================
            VIEW 1: FULL 3D INTERACTIVE CYBER SPHERE
           ============================================================ */}
        {activeTab === "sphere" && (
          <div className="relative w-full h-full flex flex-col justify-between">
            {/* Top Sphere Controls & Category Filters */}
            <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
              <div>
                <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-gold/80 flex items-center gap-1.5">
                  <Sparkles className="w-3 h-3 text-gold" />
                  Full-Spectrum Interactive 3D Sphere
                </span>
                <h4 className="font-display font-bold text-xl md:text-2xl text-white tracking-tight">
                  Security Lifecycle Architecture
                </h4>
              </div>

              {/* 3D Manipulation Toolbar */}
              <div className="flex items-center gap-1.5 bg-black/60 p-1 rounded-lg border border-white/10">
                <button
                  onClick={() => setAutoRotate((prev) => !prev)}
                  title={autoRotate ? "Pause Auto-Rotate" : "Resume Auto-Rotate"}
                  className={`p-1.5 rounded transition-all cursor-pointer ${
                    autoRotate ? "bg-gold text-black font-bold" : "text-white/70 hover:text-white"
                  }`}
                >
                  {autoRotate ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                </button>
                <button
                  onClick={() => setZoomLevel((z) => Math.min(1.4, z + 0.15))}
                  title="Zoom In"
                  className="p-1.5 rounded text-white/70 hover:text-white hover:bg-white/10 transition-all cursor-pointer"
                >
                  <ZoomIn className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setZoomLevel((z) => Math.max(0.7, z - 0.15))}
                  title="Zoom Out"
                  className="p-1.5 rounded text-white/70 hover:text-white hover:bg-white/10 transition-all cursor-pointer"
                >
                  <ZoomOut className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setShowArcs((prev) => !prev)}
                  title="Toggle Defense Arcs"
                  className={`px-2 py-1 rounded text-[10px] font-mono tracking-wider transition-all cursor-pointer ${
                    showArcs ? "bg-gold/20 text-gold border border-gold/40" : "text-white/50"
                  }`}
                >
                  ARCS
                </button>
                <button
                  onClick={resetCamera}
                  title="Reset View Orientation"
                  className="p-1.5 rounded text-white/70 hover:text-white hover:bg-white/10 transition-all cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Category Filter Chips */}
            <div className="flex flex-wrap items-center gap-1.5 my-2">
              <span className="font-mono text-[9px] uppercase tracking-wider text-white/40 mr-1 flex items-center gap-1">
                <Filter className="w-3 h-3" /> Filter:
              </span>
              {["ALL", "Assessment", "Design", "Delivery", "Compliance", "Systems"].map((cat) => {
                const isSelected = selectedCategory === cat;
                const catColor = cat === "ALL" ? "#D4AF37" : CATEGORY_COLORS[cat]?.hex || "#D4AF37";
                return (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-2.5 py-0.5 rounded-full font-mono text-[10px] tracking-wider uppercase transition-all cursor-pointer border ${
                      isSelected
                        ? "bg-gold text-black font-bold border-gold shadow-[0_0_10px_rgba(212,175,55,0.4)]"
                        : "bg-white/5 text-white/70 border-white/10 hover:border-white/30"
                    }`}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>

            {/* 3D Sphere Interactive Stage */}
            <div
              className="relative my-3 h-72 md:h-80 w-full flex items-center justify-center touch-none select-none cursor-grab active:cursor-grabbing"
              onPointerDown={(e) => {
                drag.current = { active: true, lx: e.clientX, ly: e.clientY, moved: false };
                (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
              }}
              onPointerMove={(e) => {
                if (!drag.current.active) return;
                const dx = e.clientX - drag.current.lx;
                const dy = e.clientY - drag.current.ly;
                if (Math.abs(dx) > 3 || Math.abs(dy) > 3) {
                  drag.current.moved = true;
                }
                drag.current.lx = e.clientX;
                drag.current.ly = e.clientY;
                angle.current.y += dx * 0.006;
                angle.current.x -= dy * 0.006;
                velocity.current.y = dx * 0.0025;
                velocity.current.x = -dy * 0.0025;
              }}
              onPointerUp={() => {
                drag.current.active = false;
              }}
              onPointerCancel={() => {
                drag.current.active = false;
              }}
            >
              {/* Projected 3D Nodes */}
              <div className="absolute left-1/2 top-1/2 h-0 w-0">
                {sphereNodes.map((n) => {
                  const isFront = n.opacity > 0.45;
                  const isHovered = hoveredTopic === n.topic.slug;
                  const isSelected = selectedTopic?.slug === n.topic.slug;

                  return (
                    <div
                      key={n.topic.slug}
                      onPointerDown={(e) => e.stopPropagation()}
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedTopic(n.topic);
                      }}
                      onPointerEnter={() => isFront && setHoveredTopic(n.topic.slug)}
                      onPointerLeave={() => setHoveredTopic(null)}
                      className="absolute -translate-x-1/2 -translate-y-1/2 will-change-transform transition-[transform,opacity,filter] duration-150"
                      style={{
                        transform: `translate(${n.x}px, ${n.y}px) scale(${n.scale})`,
                        opacity: n.opacity,
                        zIndex: Math.round((n.z + 1) * 50),
                        pointerEvents: isFront ? "auto" : "none",
                        cursor: isFront ? "pointer" : "default",
                      }}
                    >
                      {/* Node Label Pill */}
                      <div
                        className={`group flex items-center gap-1.5 px-2.5 py-1 rounded-lg backdrop-blur-md border transition-all whitespace-nowrap ${
                          isSelected
                            ? "bg-gold text-black font-bold border-gold shadow-[0_0_20px_#D4AF37] scale-110"
                            : isHovered
                              ? "bg-slate-900/90 text-gold border-gold/70 shadow-[0_0_15px_rgba(212,175,55,0.4)] scale-105"
                              : n.opacity > 0.75
                                ? "bg-black/75 text-white border-white/20 hover:border-gold/50"
                                : "bg-black/50 text-white/60 border-white/10"
                        }`}
                      >
                        {/* Status glowing dot */}
                        <div
                          className="h-2 w-2 rounded-full shrink-0 shadow-sm"
                          style={{
                            backgroundColor: n.color,
                            boxShadow: isHovered || isSelected ? `0 0 8px ${n.color}` : "none",
                          }}
                        />

                        <span
                          className="font-display tracking-tight text-[11px] md:text-xs font-semibold"
                          style={{
                            color: isSelected
                              ? "#000000"
                              : isHovered
                                ? "#D4AF37"
                                : n.opacity > 0.7
                                  ? "#FFFFFF"
                                  : `rgba(255, 255, 255, ${0.4 + n.opacity * 0.5})`,
                          }}
                        >
                          {n.topic.label}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Interactive Inspector HUD Card for Selected Topic */}
            <AnimatePresence>
              {selectedTopic && (
                <motion.div
                  initial={{ opacity: 0, y: 15, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.97 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  className="relative p-4 rounded-xl border border-gold/40 bg-black/80 backdrop-blur-xl shadow-[0_10px_35px_rgba(0,0,0,0.6)] mb-2"
                >
                  <button
                    onClick={() => setSelectedTopic(null)}
                    className="absolute top-3 right-3 p-1 rounded-md text-white/50 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>

                  <div className="flex flex-wrap items-center gap-2 mb-1.5">
                    <span
                      className="px-2 py-0.5 rounded font-mono text-[9px] font-bold uppercase tracking-wider"
                      style={{
                        backgroundColor: CATEGORY_COLORS[selectedTopic.category]?.bg,
                        color: CATEGORY_COLORS[selectedTopic.category]?.hex,
                        border: `1px solid ${CATEGORY_COLORS[selectedTopic.category]?.border}`,
                      }}
                    >
                      {selectedTopic.category}
                    </span>
                    <span className="font-mono text-[9px] text-white/50 tracking-wider">
                      VISO ARCHITECTURAL SPECIFICATION
                    </span>
                  </div>

                  <h5 className="font-display font-bold text-base md:text-lg text-white mb-1">
                    {selectedTopic.headline || selectedTopic.label}
                  </h5>
                  <p className="text-xs text-white/75 leading-relaxed font-light mb-3">
                    {selectedTopic.summary}
                  </p>

                  <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-white/10">
                    <Link
                      to="/explore/$slug"
                      params={{ slug: selectedTopic.slug }}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gold hover:bg-gold/90 text-black font-mono text-[10px] font-bold tracking-wider uppercase transition-all shadow-[0_0_12px_rgba(212,175,55,0.3)] hover:scale-105"
                    >
                      <span>Explore Engineering Details</span>
                      <ExternalLink className="w-3 h-3" />
                    </Link>

                    {selectedTopic.relatedRoute && (
                      <Link
                        to={selectedTopic.relatedRoute}
                        className="inline-flex items-center gap-1 text-gold hover:text-amber-300 font-mono text-[10px] tracking-wider uppercase transition-colors"
                      >
                        <span>{selectedTopic.relatedLabel}</span>
                        <ChevronRight className="w-3 h-3" />
                      </Link>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Instruction Cue */}
            <p className="text-center font-mono text-[9px] text-white/45 tracking-[0.25em] uppercase">
              Drag to Orbit 3D Sphere · Click Any Capability Node to Inspect Architecture
            </p>
          </div>
        )}

        {/* ============================================================
            VIEW 2: KSA REGIONAL RADAR
           ============================================================ */}
        {activeTab === "radar" && (
          <div className="relative w-full h-full flex flex-col justify-between">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
              <div>
                <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-gold/80 flex items-center gap-1.5">
                  <Activity className="w-3 h-3 animate-pulse text-emerald-400" />
                  National Security Backbone Coverage
                </span>
                <h4 className="font-display font-bold text-xl md:text-2xl text-white tracking-tight">
                  Kingdom-Wide Operational Telemetry
                </h4>
              </div>

              <div className="flex items-center gap-4 bg-black/50 px-3 py-1.5 rounded-lg border border-white/10 font-mono text-[10px] text-white/70">
                <div>
                  UPTIME: <span className="text-emerald-400 font-bold">99.99%</span>
                </div>
                <div className="h-3 w-px bg-white/20" />
                <div>
                  NODES: <span className="text-gold font-bold">5 ACTIVE</span>
                </div>
              </div>
            </div>

            {/* Radar Hubs Map */}
            <div className="relative my-4 h-64 md:h-72 w-full rounded-xl border border-white/10 bg-black/30 overflow-hidden flex items-center justify-center">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.12)_0%,transparent_70%)] pointer-events-none" />
              <div className="absolute inset-x-0 top-1/2 h-px bg-gold/10" />
              <div className="absolute inset-y-0 left-1/2 w-px bg-gold/10" />

              {KSA_HUBS.map((hub) => {
                const isSelected = selectedHub?.id === hub.id;
                return (
                  <button
                    key={hub.id}
                    onClick={() => setSelectedHub(hub)}
                    style={{ left: `${hub.x}%`, top: `${hub.y}%` }}
                    className="group absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center cursor-pointer focus:outline-none z-20"
                  >
                    <div className="relative flex items-center justify-center">
                      <span
                        className={`absolute h-8 w-8 rounded-full border transition-all duration-300 ${
                          isSelected
                            ? "border-gold bg-gold/20 animate-ping"
                            : "border-white/20 group-hover:border-gold/60"
                        }`}
                      />
                      <div
                        className={`h-4 w-4 rounded-full flex items-center justify-center transition-all ${
                          isSelected
                            ? "bg-gold text-black shadow-[0_0_15px_#D4AF37]"
                            : "bg-slate-800 border border-gold/60 text-gold group-hover:scale-125"
                        }`}
                      >
                        <div className="h-1.5 w-1.5 rounded-full bg-current" />
                      </div>
                    </div>

                    <div
                      className={`mt-1.5 px-2 py-0.5 rounded font-mono text-[9px] tracking-wider uppercase transition-all whitespace-nowrap ${
                        isSelected
                          ? "bg-gold text-black font-bold shadow-md"
                          : "bg-black/70 text-white/80 border border-white/10 group-hover:text-gold"
                      }`}
                    >
                      {hub.name}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Selected Hub Detail Card */}
            {selectedHub && (
              <motion.div
                key={selectedHub.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-xl border border-gold/30 bg-gold/5 backdrop-blur-md"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gold/15 border border-gold/40 text-gold font-mono font-bold text-xs">
                    {selectedHub.code.split("-")[0]}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h5 className="font-display font-bold text-sm text-white">{selectedHub.name}</h5>
                      <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono text-[9px] font-bold">
                        {selectedHub.status}
                      </span>
                    </div>
                    <p className="font-mono text-[10px] text-white/60">
                      Tier: {selectedHub.level} · Response Latency: {selectedHub.latency}
                    </p>
                  </div>
                </div>

                <Link
                  to="/about"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-gold/20 hover:bg-gold text-gold hover:text-black font-mono text-[10px] font-bold tracking-wider uppercase transition-all"
                >
                  <span>Explore Hub</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </motion.div>
            )}
          </div>
        )}

        {/* ============================================================
            VIEW 3: HCIS & MOI COMPLIANCE MATRIX
           ============================================================ */}
        {activeTab === "hcis" && (
          <div className="relative w-full h-full flex flex-col justify-between">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
              <div>
                <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-gold/80 flex items-center gap-1.5">
                  <Lock className="w-3 h-3 text-gold" />
                  Saudi Regulatory Authority Engineering
                </span>
                <h4 className="font-display font-bold text-xl md:text-2xl text-white tracking-tight">
                  HCIS & MOI Directive Framework
                </h4>
              </div>

              <div className="font-mono text-[10px] text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-3 py-1 rounded-full">
                100% REGULATORY AUDIT DEFENSE
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 my-2">
              {HCIS_DIRECTIVES.map((d, i) => (
                <motion.div
                  key={d.code}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="group relative p-3 rounded-xl border border-white/10 bg-white/[0.03] hover:bg-white/[0.08] hover:border-gold/40 transition-all cursor-default"
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-mono font-bold text-xs text-gold">{d.code}</span>
                    <span className="font-mono text-[9px] px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-emerald-400">
                      {d.status}
                    </span>
                  </div>
                  <p className="text-xs text-white/80 font-medium line-clamp-1">{d.title}</p>
                </motion.div>
              ))}
            </div>

            <div className="mt-4 pt-3 border-t border-white/10 flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Link
                  to="/regulatory/hcis"
                  className="px-3 py-1 rounded-md bg-gold/15 hover:bg-gold text-gold hover:text-black font-mono text-[10px] font-bold tracking-wider uppercase transition-all"
                >
                  HCIS Directives →
                </Link>
                <Link
                  to="/regulatory/moi"
                  className="px-3 py-1 rounded-md bg-white/5 hover:bg-white/15 text-white/80 font-mono text-[10px] tracking-wider uppercase transition-all border border-white/10"
                >
                  MOI Governance →
                </Link>
                <Link
                  to="/regulatory/sais"
                  className="px-3 py-1 rounded-md bg-white/5 hover:bg-white/15 text-white/80 font-mono text-[10px] tracking-wider uppercase transition-all border border-white/10"
                >
                  SAIS Standards →
                </Link>
              </div>

              <span className="font-mono text-[9px] text-white/40 tracking-wider">
                Full-Lifecycle Authority Approvals
              </span>
            </div>
          </div>
        )}

        {/* Real-time Telemetry Status Ticker */}
        <div className="mt-3 pt-3 border-t border-white/10 flex flex-wrap items-center justify-between text-white/50 font-mono text-[9px] tracking-wider uppercase">
          <div className="flex items-center gap-2">
            <Compass className="w-3 h-3 text-gold" />
            <span>
              AZ: {telemetry.az}° · EL: {telemetry.el}° · NODES: {telemetry.nodes}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Cpu className="w-3 h-3 text-gold" />
            <span>SYS.INTEGRITY // 100% SECURE</span>
          </div>
        </div>
      </div>
    </div>
  );
}
