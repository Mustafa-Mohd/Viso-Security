import { Suspense, useEffect, useRef, useState, type MouseEvent } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Environment, MeshDistortMaterial, ContactShadows } from "@react-three/drei";
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useSpring,
  useTransform,
  AnimatePresence,
  type MotionValue,
} from "framer-motion";
import type { Group } from "three";
import { Link } from "@tanstack/react-router";

type Service = { title: string; desc: string };
type ProfileItem = { num: string; title: string; desc: string };

const ease = [0.16, 1, 0.3, 1] as const;

const serviceVisuals = [
  {
    glyph: "◈",
    accent: "#1B4F72",
    soft: "rgba(27, 79, 114, 0.14)",
    glow: "rgba(27, 79, 114, 0.35)",
    image:
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=900&q=80",
  },
  {
    glyph: "◇",
    accent: "#0E7C66",
    soft: "rgba(14, 124, 102, 0.14)",
    glow: "rgba(14, 124, 102, 0.35)",
    image:
      "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=900&q=80",
  },
  {
    glyph: "⬡",
    accent: "#B8860B",
    soft: "rgba(184, 134, 11, 0.16)",
    glow: "rgba(212, 175, 55, 0.4)",
    image:
      "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=900&q=80",
  },
  {
    glyph: "◎",
    accent: "#8B3A2A",
    soft: "rgba(139, 58, 42, 0.14)",
    glow: "rgba(139, 58, 42, 0.35)",
    image:
      "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=900&q=80",
  },
];

/* ---------- 3D Gold Shield ---------- */
function GoldForm({ mouseX, mouseY }: { mouseX: MotionValue<number>; mouseY: MotionValue<number> }) {
  const group = useRef<Group>(null);
  const target = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const unsubX = mouseX.on("change", (v) => {
      target.current.x = (v - 0.5) * 0.8;
    });
    const unsubY = mouseY.on("change", (v) => {
      target.current.y = (v - 0.5) * 0.5;
    });
    return () => {
      unsubX();
      unsubY();
    };
  }, [mouseX, mouseY]);

  useFrame((_, delta) => {
    if (!group.current) return;
    group.current.rotation.y += delta * 0.25;
    group.current.rotation.x +=
      (target.current.y * 0.6 - group.current.rotation.x) * 0.06;
    group.current.rotation.z +=
      (target.current.x * 0.35 - group.current.rotation.z) * 0.06;
  });

  return (
    <Float speed={1.4} rotationIntensity={0.35} floatIntensity={0.9}>
      <group ref={group}>
        <mesh castShadow>
          <icosahedronGeometry args={[1.35, 1]} />
          <MeshDistortMaterial
            color="#D4AF37"
            metalness={0.92}
            roughness={0.18}
            distort={0.18}
            speed={1.6}
            envMapIntensity={1.4}
          />
        </mesh>
        <mesh scale={1.08}>
          <icosahedronGeometry args={[1.35, 1]} />
          <meshBasicMaterial color="#F5E6A8" wireframe transparent opacity={0.18} />
        </mesh>
      </group>
    </Float>
  );
}

function ShieldCanvas({ mouseX, mouseY }: { mouseX: MotionValue<number>; mouseY: MotionValue<number> }) {
  return (
    <Canvas
      dpr={[1, 1.75]}
      camera={{ position: [0, 0, 4.2], fov: 42 }}
      gl={{ antialias: true, alpha: true }}
      style={{ background: "transparent" }}
    >
      <ambientLight intensity={0.55} />
      <directionalLight position={[4, 6, 3]} intensity={1.4} color="#fff6d6" />
      <directionalLight position={[-4, -2, -3]} intensity={0.35} color="#8a7340" />
      <Suspense fallback={null}>
        <GoldForm mouseX={mouseX} mouseY={mouseY} />
        <Environment preset="city" />
        <ContactShadows
          position={[0, -1.85, 0]}
          opacity={0.35}
          scale={8}
          blur={2.4}
          far={4}
          color="#1a1508"
        />
      </Suspense>
    </Canvas>
  );
}

/* ---------- Magnetic / tilt service card ---------- */
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
  const rotateX = useTransform(my, [-0.5, 0.5], [9, -9]);
  const rotateY = useTransform(mx, [-0.5, 0.5], [-11, 11]);
  const glareX = useTransform(mx, [-0.5, 0.5], [0, 100]);
  const glareY = useTransform(my, [-0.5, 0.5], [0, 100]);
  const visual = serviceVisuals[index % serviceVisuals.length];
  const glare = useMotionTemplate`radial-gradient(420px circle at ${glareX}% ${glareY}%, ${visual.glow}, transparent 55%)`;

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
        backgroundImage: glare,
        borderColor: active ? visual.accent : undefined,
        boxShadow: active ? `0 18px 40px -20px ${visual.glow}` : "none",
      }}
      animate={{
        scale: active ? 1 : 0.97,
        opacity: active ? 1 : 0.72,
      }}
      transition={{ duration: 0.45, ease }}
      className={`relative text-left overflow-hidden rounded-sm border p-6 md:p-7 min-h-[220px] md:min-h-[260px] transition-colors duration-500 ${
        active
          ? "text-background"
          : "border-foreground/10 bg-surface/70"
      }`}
    >
      <div
        className="absolute inset-0 opacity-30 mix-blend-luminosity pointer-events-none"
        style={{
          backgroundImage: `url(${visual.image})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          transform: "translateZ(0)",
        }}
      />
      <div
        className="absolute inset-0 pointer-events-none transition-opacity duration-500"
        style={{
          background: active
            ? `linear-gradient(145deg, ${visual.accent} 0%, #151515 58%, #0d0d0d 100%)`
            : `linear-gradient(160deg, ${visual.soft} 0%, rgba(255,255,255,0.88) 55%, rgba(248,248,246,0.95) 100%)`,
        }}
      />

      <div className="relative z-10 flex flex-col h-full" style={{ transform: "translateZ(40px)" }}>
        <div className="flex items-start justify-between mb-8">
          <span
            className="font-mono text-[11px] tracking-[0.3em]"
            style={{ color: active ? "#F5E6A8" : visual.accent }}
          >
            0{index + 1}
          </span>
          <motion.span
            animate={{ rotate: active ? 90 : 0, scale: active ? 1.15 : 1 }}
            transition={{ duration: 0.5, ease }}
            className="font-serif text-3xl leading-none"
            style={{ color: active ? "#F5E6A8" : visual.accent }}
          >
            {visual.glyph}
          </motion.span>
        </div>

        <h4
          className={`font-display text-xl md:text-2xl tracking-tight mb-3 ${
            active ? "text-white" : "text-foreground"
          }`}
        >
          {service.title}
        </h4>
        <p
          className={`text-sm font-light leading-relaxed mt-auto ${
            active ? "text-white/70" : "text-foreground/50"
          }`}
        >
          {service.desc}
        </p>

        <motion.div
          animate={{ width: active ? "100%" : "28%" }}
          transition={{ duration: 0.55, ease }}
          className="absolute bottom-0 left-0 h-[3px]"
          style={{ backgroundColor: active ? "#F5E6A8" : visual.accent }}
        />
      </div>
    </motion.button>
  );
}

/* ---------- Profile interactive stepper ---------- */
function ProfileJourney({ items }: { items: ProfileItem[] }) {
  const [active, setActive] = useState(0);
  const progress = ((active + 1) / items.length) * 100;

  return (
    <div className="relative">
      <div className="flex items-center gap-4 mb-10 md:mb-12">
        <h3 className="font-mono text-[10px] tracking-[0.3em] text-foreground/40 uppercase shrink-0">
          Profile Contents
        </h3>
        <div className="flex-1 h-px bg-foreground/10 relative overflow-hidden">
          <motion.div
            className="absolute inset-y-0 left-0 bg-primary"
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.55, ease }}
          />
        </div>
        <span className="font-mono text-[10px] tracking-widest text-primary tabular-nums">
          0{active + 1} / 0{items.length}
        </span>
      </div>

      <div className="grid lg:grid-cols-12 gap-8 lg:gap-10 items-stretch">
        <div className="lg:col-span-5 space-y-2">
          {items.map((item, i) => (
            <button
              key={item.num}
              type="button"
              onMouseEnter={() => setActive(i)}
              onFocus={() => setActive(i)}
              onClick={() => setActive(i)}
              className={`w-full text-left group flex items-center gap-5 px-4 py-4 rounded-sm border transition-all duration-400 ${
                active === i
                  ? "border-primary/40 bg-primary/[0.06]"
                  : "border-transparent hover:border-foreground/10"
              }`}
            >
              <span
                className={`font-display text-3xl md:text-4xl tracking-tight transition-colors duration-400 ${
                  active === i ? "text-primary" : "text-foreground/20 group-hover:text-foreground/40"
                }`}
              >
                {item.num}
              </span>
              <span
                className={`font-display text-base md:text-lg tracking-tight transition-colors duration-400 ${
                  active === i ? "text-foreground" : "text-foreground/45"
                }`}
              >
                {item.title}
              </span>
            </button>
          ))}
        </div>

        <div className="lg:col-span-7 relative min-h-[260px] md:min-h-[320px]">
          <div className="absolute inset-0 rounded-sm overflow-hidden border border-foreground/10 bg-foreground">
            <AnimatePresence mode="wait">
              <motion.div
                key={active}
                initial={{ opacity: 0, y: 24, filter: "blur(8px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: -16, filter: "blur(8px)" }}
                transition={{ duration: 0.45, ease }}
                className="absolute inset-0 p-8 md:p-12 flex flex-col justify-between"
              >
                <div
                  className="absolute inset-0 opacity-30"
                  style={{
                    backgroundImage: `url(${serviceVisuals[active % serviceVisuals.length].image})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-br from-foreground via-foreground/95 to-foreground/75" />

                <div className="relative z-10">
                  <p className="font-mono text-[10px] tracking-[0.3em] text-primary uppercase mb-4">
                    Chapter {items[active].num}
                  </p>
                  <h4 className="font-display text-3xl md:text-5xl text-white tracking-tight leading-[1.05] max-w-lg">
                    {items[active].title}
                  </h4>
                </div>
                <p className="relative z-10 text-base md:text-lg text-white/65 font-light leading-relaxed max-w-xl">
                  {items[active].desc}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
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

      {/* Intro + 3D */}
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
            <p className="text-sm text-foreground/55 font-light leading-relaxed">
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
              <ShieldCanvas mouseX={mouseX} mouseY={mouseY} />
            ) : (
              <div className="h-full w-full bg-gradient-to-br from-primary/10 via-transparent to-foreground/5" />
            )}
          </div>
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 28, repeat: Infinity, ease: "linear" }}
            className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[88%] aspect-square opacity-40"
          >
            <svg viewBox="0 0 100 100" className="w-full h-full">
              <path
                id="visoRing"
                d="M 50, 50 m -42, 0 a 42,42 0 1,1 84,0 a 42,42 0 1,1 -84,0"
                fill="none"
              />
              <text className="font-mono text-[4.5px] tracking-[0.35em] uppercase" fill="#D4AF37">
                <textPath href="#visoRing" startOffset="0%">
                  VISO GROUP · SECURITY ARCHITECTURE · CONSULTANCY ·
                </textPath>
              </text>
            </svg>
          </motion.div>
        </div>
      </div>

      {/* Interactive services */}
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
              Four core VISO offerings — hover any panel to explore how consulting, translation, digital access, and SAIS alignment work together.
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
