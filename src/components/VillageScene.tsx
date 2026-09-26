import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Html, OrbitControls } from "@react-three/drei";
import type { Mesh } from "three";
import { mapHotspots, type MapHotspot } from "../lib/mapHotspots";
import type { Zone } from "../lib/types";
import VillageModel, {
  IMAGE_H,
  IMAGE_W,
  MODEL_BUILT_WIDTH,
  planToWorld,
} from "./VillageModel";

const COLOR_GOLD = "#f2c572";
const COLOR_TEAL = "#4fd6c4";

const NAVIGATE_DELAY_MS = 150;
const PIN_HEIGHT = 1.5;

const CAMERA_DISTANCE = 15;
const CAMERA_TILT = (58 * Math.PI) / 180;
const CAMERA_FOV = 42;

const MAP_SCREEN_SHARE = 0.62;
const MAX_AZIMUTH = Infinity;

function Marker({
  clickable,
  hovered,
  onEnter,
  onLeave,
  onActivate,
}: {
  clickable: boolean;
  hovered: boolean;
  onEnter: () => void;
  onLeave: () => void;
  onActivate: () => void;
}) {
  const [activated, setActivated] = useState(false);

  const handleClick = () => {
    if (!clickable || activated) return;
    setActivated(true);
    window.setTimeout(onActivate, NAVIGATE_DELAY_MS);
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      disabled={!clickable}
      className={`map-marker flex items-center justify-center rounded-full border-2 shadow-lg
        ${clickable ? "cursor-pointer" : "cursor-default opacity-50"} ${activated ? "is-activated" : ""}`}
      style={{
        width: 40,
        height: 40,
        background: activated || hovered ? COLOR_TEAL : "#171f38",
        borderColor: activated || hovered ? COLOR_TEAL : "#2a3453",
      }}
    >
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke={activated || hovered ? "#090c16" : COLOR_GOLD}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M12 2l2.4 6.6L21 11l-6.6 2.4L12 20l-2.4-6.6L3 11l6.6-2.4L12 2z" />
      </svg>
    </button>
  );
}

function Pin({ hovered, lift }: { hovered: boolean; lift: number }) {
  const gem = useRef<Mesh>(null);
  useFrame((_, delta) => {
    if (gem.current) gem.current.rotation.y += delta * 0.9;
  });
  const color = hovered ? COLOR_TEAL : COLOR_GOLD;

  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
        <ringGeometry args={[0.28, 0.4, 32]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={hovered ? 0.95 : 0.6}
        />
      </mesh>
      <mesh position={[0, 0.3 + (lift - 0.55) / 2, 0]}>
        <cylinderGeometry args={[0.02, 0.02, lift - 0.55, 6]} />
        <meshBasicMaterial color={color} transparent opacity={0.7} />
      </mesh>
      <mesh ref={gem} position={[0, 0.3, 0]}>
        <octahedronGeometry args={[0.16, 0]} />
        <meshStandardMaterial
          color={color}
          flatShading
          emissive={color}
          emissiveIntensity={hovered ? 0.7 : 0.25}
          roughness={0.25}
          metalness={0.3}
        />
      </mesh>
    </group>
  );
}

function ZonePin({
  hotspot,
  zone,
  hovered,
  onHover,
  onClick,
}: {
  hotspot: MapHotspot;
  zone: Zone | undefined;
  hovered: boolean;
  onHover: (key: string | null) => void;
  onClick: () => void;
}) {
  const clickable = Boolean(zone);
  const label = hotspot.label;
  const lift = hotspot.lift ?? PIN_HEIGHT;

  const canvasWidth = useThree((s) => s.size.width);
  const compact = canvasWidth < 560;

  const [x, z] = planToWorld(
    (hotspot.x / 100) * IMAGE_W,
    (hotspot.y / 100) * IMAGE_H,
  );

  return (
    <group position={[x, hotspot.height ?? 0.02, z]}>
      <Pin hovered={hovered} lift={lift} />
      <Html
        zIndexRange={[10, 0]}
        position={[0, lift, 0]}
        center
        distanceFactor={compact ? 10 : 15}
      >
        <div className="relative">
          <Marker
            clickable={clickable}
            hovered={hovered}
            onEnter={() => onHover(hotspot.key)}
            onLeave={() => onHover(null)}
            onActivate={onClick}
          />
          <span
            className={`absolute left-1/2 -translate-x-1/2 font-mono text-[10px] px-2 py-0.5 rounded-full whitespace-nowrap pointer-events-none ${
              hotspot.labelSide === "top" ? "bottom-full mb-1" : "top-full mt-1"
            }`}
            style={{
              background: "rgba(23,31,56,0.85)",
              color: "#eef0f8",
              border: "1px solid #2a3453",
            }}
          >
            {label}
          </span>
        </div>
      </Html>
    </group>
  );
}

function ResponsiveFit() {
  const camera = useThree((s) => s.camera);
  const size = useThree((s) => s.size);

  useEffect(() => {
    const aspect = size.width / size.height;
    const visibleHeight =
      2 * CAMERA_DISTANCE * Math.tan((CAMERA_FOV / 2) * (Math.PI / 180));
    const visibleWidth = visibleHeight * aspect;

    const zoomByWidth =
      aspect >= 1
        ? visibleWidth / (MODEL_BUILT_WIDTH / MAP_SCREEN_SHARE)
        : visibleWidth / (MODEL_BUILT_WIDTH + 2);
    const zoomByHeight = visibleHeight / 9.5;
    camera.zoom = Math.min(zoomByWidth, zoomByHeight, 1.6);
    camera.updateProjectionMatrix();
  }, [camera, size]);

  return null;
}

// فريم مربع غامق بسيط بدل الـ ellipse البيضاء
function FrameBorder() {
  return (
    <div
      className="absolute inset-0 pointer-events-none"
      style={{
        border: "1px solid rgba(42, 52, 83, 0.55)",
        borderRadius: "16px",
        boxShadow: "inset 0 0 40px rgba(9,12,22,0.5)",
      }}
      aria-hidden="true"
    />
  );
}

export default function VillageScene({
  zones,
  onSelectZone,
}: {
  zones: Zone[];
  onSelectZone: (zone: Zone) => void;
}) {
  const [hovered, setHovered] = useState<string | null>(null);

  const pins = useMemo(
    () =>
      mapHotspots.map((h) => ({
        hotspot: h,
        zone: zones.find((z) => z.zone_code === h.zoneCode),
      })),
    [zones],
  );

  return (
    <div
      dir="ltr"
      className="relative w-full h-[55vw] sm:h-[70vh] sm:min-h-[420px]"
    >
      <FrameBorder />
      <Canvas
        shadows
        camera={{
          position: [
            0,
            Math.cos(CAMERA_TILT) * CAMERA_DISTANCE,
            Math.sin(CAMERA_TILT) * CAMERA_DISTANCE,
          ],
          fov: CAMERA_FOV,
        }}
      >
        <hemisphereLight args={["#1a2a6c", "#0a1020", 0.6]} />
        <directionalLight
          position={[6, 11, 7]}
          intensity={2.2}
          castShadow
          shadow-mapSize={[2048, 2048]}
          shadow-camera-left={-9}
          shadow-camera-right={9}
          shadow-camera-top={9}
          shadow-camera-bottom={-9}
          shadow-camera-near={1}
          shadow-camera-far={30}
          shadow-bias={-0.0005}
        />
        <directionalLight
          position={[-5, 8, -5]}
          intensity={0.4}
          color="#4060c0"
        />

        <ResponsiveFit />
        <VillageModel />

        {pins.map(({ hotspot, zone }) => (
          <ZonePin
            key={hotspot.key}
            hotspot={hotspot}
            zone={zone}
            hovered={hovered === hotspot.key}
            onHover={setHovered}
            onClick={() => zone && onSelectZone(zone)}
          />
        ))}

        <OrbitControls
          enablePan={false}
          minDistance={8}
          maxDistance={26}
          minAzimuthAngle={-MAX_AZIMUTH}
          maxAzimuthAngle={MAX_AZIMUTH}
          minPolarAngle={Math.PI / 6}
          maxPolarAngle={Math.PI / 2.3}
          target={[0, 0.4, 0]}
        />
      </Canvas>
    </div>
  );
}
