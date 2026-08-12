import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Stars, Html, useTexture } from "@react-three/drei";
import * as THREE from "three";
import type { Group, Mesh } from "three";

export type GlobeLocation = {
  id: string;
  name: string;
  coordinates: [number, number]; // [lat, lng]
};

function latLngToVector3(lat: number, lng: number, radius: number) {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);
  const x = -radius * Math.sin(phi) * Math.cos(theta);
  const z = radius * Math.sin(phi) * Math.sin(theta);
  const y = radius * Math.cos(phi);
  return new THREE.Vector3(x, y, z);
}

function Marker({
  active,
  label,
  onSelect,
}: {
  active: boolean;
  label: string;
  onSelect: () => void;
}) {
  const ref = useRef<Mesh>(null);
  const ring = useRef<Mesh>(null);

  useFrame((_, delta) => {
    if (!ref.current) return;
    const s = active ? 1.4 : 1;
    ref.current.scale.lerp(new THREE.Vector3(s, s, s), 1 - Math.exp(-8 * delta));
    if (ring.current) {
      ring.current.rotation.z += delta * 1.2;
      const opacity = active ? 0.65 : 0;
      const mat = ring.current.material as THREE.MeshBasicMaterial;
      mat.opacity = THREE.MathUtils.damp(mat.opacity, opacity, 8, delta);
    }
  });

  return (
    <group>
      <mesh
        ref={ref}
        onClick={(e) => {
          e.stopPropagation();
          onSelect();
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          document.body.style.cursor = "pointer";
          onSelect();
        }}
        onPointerOut={() => {
          document.body.style.cursor = "grab";
        }}
      >
        <sphereGeometry args={[0.038, 20, 20]} />
        <meshStandardMaterial
          color={active ? "#D4AF37" : "#E74C3C"}
          emissive={active ? "#D4AF37" : "#6B1515"}
          emissiveIntensity={active ? 1.1 : 0.3}
          metalness={0.55}
          roughness={0.22}
        />
      </mesh>

      <mesh ref={ring}>
        <ringGeometry args={[0.07, 0.1, 40]} />
        <meshBasicMaterial
          color="#D4AF37"
          transparent
          opacity={0}
          side={THREE.DoubleSide}
        />
      </mesh>

      {active && (
        <Html distanceFactor={7} position={[0, 0.14, 0]} center style={{ pointerEvents: "none" }}>
          <div className="whitespace-nowrap rounded-sm bg-[#0c0c0c]/92 px-3 py-1.5 text-[11px] font-semibold tracking-wide text-[#F5E6A8] shadow-xl border border-[#D4AF37]/45">
            {label}
          </div>
        </Html>
      )}
    </group>
  );
}

function Earth({
  locations,
  activeId,
  onSelect,
  userDragging,
}: {
  locations: GlobeLocation[];
  activeId: string;
  onSelect: (id: string) => void;
  userDragging: boolean;
}) {
  const globe = useRef<Group>(null);
  const targetQuat = useRef(new THREE.Quaternion());
  const idleSpin = useRef(0);

  const texture = useTexture({
    map: "https://cdn.jsdelivr.net/npm/three-globe/example/img/earth-blue-marble.jpg",
    bumpMap: "https://cdn.jsdelivr.net/npm/three-globe/example/img/earth-topology.png",
  });

  const active = useMemo(
    () => locations.find((l) => l.id === activeId) || locations[0],
    [locations, activeId]
  );

  useEffect(() => {
    if (!active) return;
    const point = latLngToVector3(active.coordinates[0], active.coordinates[1], 1).normalize();
    // Face the active city toward the camera (+Z)
    const q = new THREE.Quaternion().setFromUnitVectors(point, new THREE.Vector3(0, 0, 1));
    targetQuat.current.copy(q);
    idleSpin.current = 0;
  }, [active]);

  useFrame((_, delta) => {
    if (!globe.current) return;

    if (userDragging) {
      idleSpin.current = 0;
      return;
    }

    // Slerp toward focused city
    globe.current.quaternion.slerp(targetQuat.current, 1 - Math.exp(-3.5 * delta));

    idleSpin.current += delta;
    // After focus settles, gentle continuous drift
    if (idleSpin.current > 5) {
      const drift = new THREE.Quaternion().setFromAxisAngle(
        new THREE.Vector3(0, 1, 0),
        delta * 0.12
      );
      targetQuat.current.multiplyQuaternions(drift, targetQuat.current);
    }
  });

  return (
    <group ref={globe}>
      {/* Soft atmosphere */}
      <mesh scale={1.09}>
        <sphereGeometry args={[1.6, 64, 64]} />
        <meshBasicMaterial color="#6EA8FF" transparent opacity={0.08} side={THREE.BackSide} />
      </mesh>

      {/* Gold wire lattice */}
      <mesh scale={1.012}>
        <sphereGeometry args={[1.6, 36, 36]} />
        <meshBasicMaterial color="#D4AF37" wireframe transparent opacity={0.07} />
      </mesh>

      <mesh castShadow>
        <sphereGeometry args={[1.6, 64, 64]} />
        <meshStandardMaterial
          map={texture.map}
          bumpMap={texture.bumpMap}
          bumpScale={0.045}
          roughness={0.7}
          metalness={0.1}
        />
      </mesh>

      {locations.map((loc) => {
        const pos = latLngToVector3(loc.coordinates[0], loc.coordinates[1], 1.63);
        return (
          <group key={loc.id} position={pos}>
            <Marker
              active={loc.id === activeId}
              label={loc.name}
              onSelect={() => onSelect(loc.id)}
            />
          </group>
        );
      })}
    </group>
  );
}

function Scene({
  locations,
  activeId,
  onSelect,
}: {
  locations: GlobeLocation[];
  activeId: string;
  onSelect: (id: string) => void;
}) {
  const [dragging, setDragging] = useState(false);
  const controlsRef = useRef<any>(null);

  useEffect(() => {
    // When a city is focused, ease camera back so the globe rotation faces you
    controlsRef.current?.reset?.();
  }, [activeId]);

  return (
    <>
      <color attach="background" args={["#07090f"]} />
      <fog attach="fog" args={["#07090f", 8, 18]} />
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 3, 5]} intensity={1.45} color="#fff6e0" />
      <directionalLight position={[-5, -1, -2]} intensity={0.4} color="#3d5a80" />
      <pointLight position={[2.5, 1.5, 3]} intensity={0.55} color="#D4AF37" />

      <Stars radius={90} depth={50} count={2200} factor={2.8} saturation={0} fade speed={0.5} />

      <Suspense fallback={null}>
        <Earth
          locations={locations}
          activeId={activeId}
          onSelect={onSelect}
          userDragging={dragging}
        />
      </Suspense>

      <OrbitControls
        ref={controlsRef}
        enablePan={false}
        enableZoom
        minDistance={3.4}
        maxDistance={7.5}
        rotateSpeed={0.6}
        zoomSpeed={0.55}
        autoRotate={false}
        onStart={() => setDragging(true)}
        onEnd={() => setDragging(false)}
      />
    </>
  );
}

export function LocationsGlobe({
  locations,
  activeId,
  onSelect,
}: {
  locations: GlobeLocation[];
  activeId: string;
  onSelect: (id: string) => void;
}) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return (
      <div className="h-full w-full bg-[#07090f] flex items-center justify-center">
        <div className="relative">
          <div className="w-36 h-36 rounded-full border border-primary/25" />
          <div className="absolute inset-0 rounded-full border border-t-primary border-r-transparent border-b-transparent border-l-transparent animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <Canvas
      dpr={[1, 1.75]}
      camera={{ position: [0, 0.2, 4.8], fov: 40 }}
      gl={{ antialias: true }}
      style={{ cursor: "grab", touchAction: "none" }}
    >
      <Scene locations={locations} activeId={activeId} onSelect={onSelect} />
    </Canvas>
  );
}
