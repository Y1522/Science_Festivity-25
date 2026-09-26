import { useMemo, useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Html, OrbitControls, useTexture } from '@react-three/drei'
import type { Mesh } from 'three'
import { TENT_IMAGE_ASPECT } from '../lib/tentImages'
import type { TentLayout } from '../lib/tentLayouts'
import type { Booth } from '../lib/types'

// ── Scene constants ────────────────────────────────────────────────────────
const COLOR_GROUND          = '#0e1326'
const COLOR_ACCENT_SELECTED = '#f2c572'
const COLOR_ACCENT_HOVER    = '#d4a43a'

const SPREAD_Z = 7
const SPREAD_X = SPREAD_Z * TENT_IMAGE_ASPECT

// ── Animations ────────────────────────────────────────────────────────────
const SCENE_KEYFRAMES = `
@keyframes sfPinBounce {
  0%, 100% { transform: translateY(0); }
  50%       { transform: translateY(-5px); }
}
@keyframes sfPinGlow {
  0%, 100% { filter: drop-shadow(0 0 7px rgba(242,197,114,0.8)) drop-shadow(0 2px 4px rgba(0,0,0,0.5)); }
  50%       { filter: drop-shadow(0 0 18px rgba(242,197,114,1)) drop-shadow(0 2px 4px rgba(0,0,0,0.5)); }
}
@keyframes sfIdleGlow {
  0%, 100% { filter: drop-shadow(0 0 4px rgba(242,197,114,0.5)) drop-shadow(0 2px 5px rgba(0,0,0,0.5)); }
  50%       { filter: drop-shadow(0 0 9px rgba(242,197,114,0.8)) drop-shadow(0 2px 5px rgba(0,0,0,0.5)); }
}
@keyframes sfHoverGlow {
  0%, 100% { filter: drop-shadow(0 0 6px rgba(242,197,114,0.9)) drop-shadow(0 2px 5px rgba(0,0,0,0.5)); }
  50%       { filter: drop-shadow(0 0 14px rgba(255,220,100,1)) drop-shadow(0 2px 5px rgba(0,0,0,0.5)); }
}
`

interface PositionedBooth {
  boothNumber: number
  position: [number, number, number]
}

function layoutToPositions(layout: TentLayout): PositionedBooth[] {
  return layout.markers.map((m) => ({
    boothNumber: m.number,
    position: [
      (m.xPct / 100 - 0.5) * SPREAD_X,
      0,
      (m.zPct / 100 - 0.5) * SPREAD_Z,
    ],
  }))
}

// ── Idle / hover pin — transparent inside, gold border + gold number ──────
function IdlePin({ number, hovered }: { number: number; hovered: boolean }) {
  // head size slightly larger on hover
  const size = hovered ? 30 : 26

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        cursor: 'pointer',
        userSelect: 'none',
        animation: hovered ? 'sfHoverGlow 1.2s ease-in-out infinite' : 'sfIdleGlow 2.5s ease-in-out infinite',
        transform: hovered ? 'scale(1.12)' : 'scale(1)',
        transition: 'transform 0.15s ease',
      }}
    >
      {/* Circle: transparent fill, gold border */}
      <div
        style={{
          width: size,
          height: size,
          borderRadius: '50%',
          background: hovered
            ? 'rgba(242,197,114,0.18)'
            : 'rgba(20,25,50,0.35)',
          border: `2px solid ${hovered ? '#f2c572' : 'rgba(242,197,114,0.75)'}`,
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: hovered
            ? 'inset 0 0 8px rgba(242,197,114,0.2)'
            : 'inset 0 0 4px rgba(242,197,114,0.08)',
        }}
      >
        <span
          style={{
            fontFamily: 'IBM Plex Mono, monospace',
            fontSize: number >= 100 ? 7 : 9,
            fontWeight: 800,
            color: '#f2c572',
            lineHeight: 1,
            textShadow: '0 0 6px rgba(242,197,114,0.6)',
          }}
        >
          {number}
        </span>
      </div>

      {/* Gold pin tail */}
      <div
        style={{
          width: 0,
          height: 0,
          borderLeft:  '5px solid transparent',
          borderRight: '5px solid transparent',
          borderTop:   `9px solid ${hovered ? '#f2c572' : 'rgba(242,197,114,0.75)'}`,
          marginTop: -1,
        }}
      />
    </div>
  )
}

// ── Selected pin — bright gold, bouncing ──────────────────────────────────
function SelectedPin({ number }: { number: number }) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        cursor: 'pointer',
        userSelect: 'none',
        animation: 'sfPinBounce 1.6s ease-in-out infinite, sfPinGlow 1.6s ease-in-out infinite',
        willChange: 'transform, filter',
      }}
    >
      {/* Larger circle, gold-filled for selected state */}
      <div
        style={{
          width: 34,
          height: 34,
          borderRadius: '50%',
          background: 'linear-gradient(135deg, rgba(255,230,130,0.22) 0%, rgba(200,140,30,0.18) 100%)',
          border: '2.5px solid #f2c572',
          backdropFilter: 'blur(6px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 0 0 3px rgba(242,197,114,0.2), inset 0 0 10px rgba(242,197,114,0.15)',
        }}
      >
        <span
          style={{
            fontFamily: 'IBM Plex Mono, monospace',
            fontSize: number >= 100 ? 9 : 12,
            fontWeight: 800,
            color: '#f2c572',
            lineHeight: 1,
            textShadow: '0 0 8px rgba(242,197,114,0.8)',
          }}
        >
          {number}
        </span>
      </div>

      {/* Brighter gold tail */}
      <div
        style={{
          width: 0,
          height: 0,
          borderLeft:  '6px solid transparent',
          borderRight: '6px solid transparent',
          borderTop:   '11px solid #f2c572',
          marginTop: -1,
        }}
      />
    </div>
  )
}

// ── Floor pulse ring ──────────────────────────────────────────────────────
function PulseRing({ color }: { color: string }) {
  const ref = useRef<Mesh>(null!)
  useFrame((state) => {
    ref.current.scale.setScalar(1 + 0.08 * Math.sin(state.clock.elapsedTime * 3.2))
  })
  return (
    <mesh ref={ref} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
      <ringGeometry args={[0.5, 0.62, 48]} />
      <meshBasicMaterial color={color} transparent opacity={0.5} />
    </mesh>
  )
}

// ── Per-booth invisible hit area + floating pin ───────────────────────────
function BoothSpot({
  positioned, booth, hovered, isSelected, onHover, onClick,
}: {
  positioned: PositionedBooth
  booth: Booth | undefined
  hovered: boolean
  isSelected: boolean
  onHover: (n: number | null) => void
  onClick: () => void
}) {
  const handleClick = (e: any) => {
    e.stopPropagation()
    if (!booth) return
    onClick()
  }

  return (
    <group position={positioned.position}>
      {(hovered || isSelected) && (
        <PulseRing color={isSelected ? COLOR_ACCENT_SELECTED : COLOR_ACCENT_HOVER} />
      )}

      {/* invisible hit disk */}
      <mesh
        position={[0, 0.02, 0]}
        onPointerOver={(e) => { e.stopPropagation(); onHover(positioned.boothNumber) }}
        onPointerOut={(e)  => { e.stopPropagation(); onHover(null) }}
        onClick={handleClick}
      >
        <cylinderGeometry args={[0.7, 0.7, 0.04, 16]} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>

      <Html
        zIndexRange={[10, 0]}
        position={[0, isSelected ? 1.5 : 1.1, 0]}
        center
        distanceFactor={9}
      >
        <div
          onPointerDown={(e) => e.stopPropagation()}
          onClick={(e) => { e.stopPropagation(); if (booth) onClick() }}
        >
          {isSelected
            ? <SelectedPin number={positioned.boothNumber} />
            : <IdlePin number={positioned.boothNumber} hovered={hovered} />
          }
        </div>
      </Html>
    </group>
  )
}

// ── Textured ground plane ─────────────────────────────────────────────────
function TexturedGround({ imageUrl }: { imageUrl: string }) {
  const texture = useTexture(imageUrl)
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} receiveShadow>
      <planeGeometry args={[SPREAD_X + 0.5, SPREAD_Z + 0.5]} />
      <meshStandardMaterial map={texture} roughness={1} />
    </mesh>
  )
}

// ── Main ──────────────────────────────────────────────────────────────────
export default function TentScene({
  layout,
  booths,
  imageUrl,
  selectedBoothNumber,
  onSelectBooth,
}: {
  layout: TentLayout
  booths: Booth[]
  imageUrl?: string
  selectedBoothNumber?: number | null
  onSelectBooth: (booth: Booth) => void
}) {
  const [hovered, setHovered] = useState<number | null>(null)

  const positioned = useMemo(() => layoutToPositions(layout), [layout])

  const boothByNumber = useMemo(() => {
    const map = new Map<number, Booth>()
    booths.forEach((b) => map.set(b.booth_number, b))
    return map
  }, [booths])

  return (
    <div className="w-full h-full" style={{ background: COLOR_GROUND }}>
      <style>{SCENE_KEYFRAMES}</style>
      <Canvas
        shadows
        camera={{ position: [0, 10, 12], fov: 52 }}
        gl={{ antialias: true, alpha: false }}
        style={{ background: COLOR_GROUND }}
      >
        <color attach="background" args={[COLOR_GROUND]} />
        <ambientLight intensity={1.4} />
        <directionalLight position={[4, 8, 4]} intensity={0.6} castShadow />

        {imageUrl ? (
          <TexturedGround imageUrl={imageUrl} />
        ) : (
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]}>
            <planeGeometry args={[SPREAD_X + 2, SPREAD_Z + 2]} />
            <meshStandardMaterial color={COLOR_GROUND} roughness={1} />
          </mesh>
        )}

        {positioned.map((p) => {
          const booth = boothByNumber.get(p.boothNumber)
          return (
            <BoothSpot
              key={p.boothNumber}
              positioned={p}
              booth={booth}
              hovered={hovered === p.boothNumber}
              isSelected={selectedBoothNumber === p.boothNumber}
              onHover={setHovered}
              onClick={() => { if (booth) onSelectBooth(booth) }}
            />
          )
        })}

        <OrbitControls
          enablePan={false}
          minDistance={4}
          maxDistance={16}
          maxPolarAngle={Math.PI / 2.2}
        />
      </Canvas>
    </div>
  )
}