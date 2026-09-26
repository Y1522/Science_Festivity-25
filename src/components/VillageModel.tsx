import { useMemo } from 'react'
import * as THREE from 'three'
import { Edges } from '@react-three/drei'

// A real 3D model of the science village, built from primitives and laid out
// after the overview render (src/assets/tents/village-overview.jpg).
//
// The plan below is written in PIXELS of that 1400 x 821 image (so you can
// read coordinates straight off the picture). Everything is then scaled to
// world units by MODEL_U, and the plan centre is moved to the origin.

// ---------------------------------------------------------------- scale ---
export const IMAGE_W = 1400
export const IMAGE_H = 821
export const MODEL_U = 0.0094 // world units per plan pixel
const CX = 690 // plan point that ends up at the world origin
const CZ = 415
const GROUND_R = 900 // radius of the soft ground (plan px)

// width of the buildings (used to size the model on screen)
export const MODEL_BUILT_WIDTH = 1500 * MODEL_U

// image pixel -> world position on the ground
export function planToWorld(px: number, pz: number): [number, number] {
  return [(px - CX) * MODEL_U, (pz - CZ) * MODEL_U]
}

// --------------------------------------------------------------- colours ---
const M = {
  ground: new THREE.MeshStandardMaterial({ color: '#8d94a6', roughness: 1 }),
  groundSide: new THREE.MeshStandardMaterial({ color: '#1b2445', roughness: 0.9 }),
  floor: new THREE.MeshStandardMaterial({ color: '#a3a8b5', roughness: 1 }),
  floorDome: new THREE.MeshStandardMaterial({ color: '#7e879a', roughness: 1 }),
  wall: new THREE.MeshStandardMaterial({ color: '#f3f5f9', roughness: 0.85 }),
  white: new THREE.MeshStandardMaterial({ color: '#f7f8fb', roughness: 0.7 }),
  dark: new THREE.MeshStandardMaterial({ color: '#232734', roughness: 0.8 }),
  glass: new THREE.MeshStandardMaterial({
    color: '#cfe6f7',
    transparent: true,
    opacity: 0.2,
    roughness: 0.1,
    depthWrite: false,
  }),
  blue: new THREE.MeshStandardMaterial({ color: '#2a72d4', roughness: 0.6 }),
  blueGlow: new THREE.MeshStandardMaterial({
    color: '#7fd4ff',
    emissive: '#3aaeea',
    emissiveIntensity: 0.9,
    roughness: 0.4,
  }),
  pink: new THREE.MeshStandardMaterial({ color: '#d23c9a', roughness: 0.6 }),
  dome: new THREE.MeshStandardMaterial({ color: '#eceff5', roughness: 0.75 }),
  planterRim: new THREE.MeshStandardMaterial({ color: '#f1f3f7', roughness: 0.8 }),
  grass: new THREE.MeshStandardMaterial({ color: '#2f9440', roughness: 1 }),
  trunk: new THREE.MeshStandardMaterial({ color: '#6b5a44', roughness: 1 }),
  leaf: new THREE.MeshStandardMaterial({ color: '#77864f', roughness: 0.9, flatShading: true }),
  leafDark: new THREE.MeshStandardMaterial({ color: '#5e6d3f', roughness: 0.9, flatShading: true }),
}

// White in the middle, fading to black at the edge -> used as the ground's alpha.
function makeFadeTexture() {
  const c = document.createElement('canvas')
  c.width = c.height = 256
  const g = c.getContext('2d')!
  const grad = g.createRadialGradient(128, 128, 0, 128, 128, 128)
  grad.addColorStop(0, '#fff')
  grad.addColorStop(0.62, '#fff')
  grad.addColorStop(1, '#000')
  g.fillStyle = grad
  g.fillRect(0, 0, 256, 256)
  return new THREE.CanvasTexture(c)
}
const fadeTexture = makeFadeTexture()

const WALL_H = 72
const WALL_T = 13

type P = [number, number]

// ------------------------------------------------------------ primitives ---
function Block({
  x0,
  z0,
  x1,
  z1,
  h,
  y = 0,
  mat,
  cast = true,
}: {
  x0: number
  z0: number
  x1: number
  z1: number
  h: number
  y?: number
  mat: THREE.Material
  cast?: boolean
}) {
  return (
    <mesh
      position={[(x0 + x1) / 2 - CX, y + h / 2, (z0 + z1) / 2 - CZ]}
      material={mat}
      castShadow={cast}
      receiveShadow
    >
      <boxGeometry args={[x1 - x0, h, z1 - z0]} />
    </mesh>
  )
}

function WallLine({ a, b, h, t = WALL_T }: { a: P; b: P; h: number; t?: number }) {
  const dx = b[0] - a[0]
  const dz = b[1] - a[1]
  const len = Math.hypot(dx, dz)
  return (
    <mesh
      position={[(a[0] + b[0]) / 2 - CX, h / 2, (a[1] + b[1]) / 2 - CZ]}
      rotation={[0, -Math.atan2(dz, dx), 0]}
      material={M.wall}
      castShadow
      receiveShadow
    >
      <boxGeometry args={[len + t, h, t]} />
    </mesh>
  )
}

// Splits one wall edge into pieces, leaving openings (gaps) for gates.
// Gap numbers are absolute plan coordinates along the edge's main axis.
function edgePieces(a: P, b: P, gaps: [number, number][] = []): [P, P][] {
  const axis = Math.abs(b[0] - a[0]) >= Math.abs(b[1] - a[1]) ? 0 : 1
  const span = b[axis] - a[axis]
  const ts = gaps
    .map(([g0, g1]) => {
      const t0 = (g0 - a[axis]) / span
      const t1 = (g1 - a[axis]) / span
      return [Math.min(t0, t1), Math.max(t0, t1)] as [number, number]
    })
    .sort((p, q) => p[0] - q[0])

  const at = (t: number): P => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t]
  const out: [P, P][] = []
  let start = 0
  for (const [t0, t1] of ts) {
    if (t0 > start) out.push([at(start), at(t0)])
    start = t1
  }
  if (start < 1) out.push([at(start), at(1)])
  return out
}

// A room = floor + walls around a polygon. `gaps[i]` are openings in edge i
// (edge i goes from points[i] to points[i+1]).
function Room({
  points,
  gaps = {},
  h = WALL_H,
  floor = M.floor,
}: {
  points: P[]
  gaps?: Record<number, [number, number][]>
  h?: number
  floor?: THREE.Material
}) {
  const shape = useMemo(() => {
    const s = new THREE.Shape()
    points.forEach(([x, z], i) => {
      const X = x - CX
      const Y = -(z - CZ)
      if (i === 0) s.moveTo(X, Y)
      else s.lineTo(X, Y)
    })
    s.closePath()
    return s
  }, [points])

  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 1, 0]} material={floor} receiveShadow>
        <shapeGeometry args={[shape]} />
      </mesh>
      {points.map((a, i) => {
        const b = points[(i + 1) % points.length]
        return edgePieces(a, b, gaps[i]).map(([p, q], j) => (
          <WallLine key={`${i}-${j}`} a={p} b={q} h={h} />
        ))
      })}
    </group>
  )
}

// Glass exhibition cubicle with a small table inside.
function Booth({ x, z, w = 56, d = 52, h = 44 }: { x: number; z: number; w?: number; d?: number; h?: number }) {
  return (
    <group>
      <mesh position={[x - CX, h / 2, z - CZ]} material={M.glass}>
        <boxGeometry args={[w, h, d]} />
        <Edges threshold={20} color="#1c2233" />
      </mesh>
      <Block x0={x - w * 0.3} z0={z - d * 0.15} x1={x + w * 0.3} z1={z + d * 0.3} h={14} mat={M.white} />
    </group>
  )
}

// Low reception counter along a wall.
function Counter({ x, z, w = 58 }: { x: number; z: number; w?: number }) {
  return (
    <group>
      <Block x0={x - w / 2} z0={z - 6} x1={x + w / 2} z1={z + 6} h={12} mat={M.dark} />
      <Block x0={x - w / 2 - 1} z0={z - 8} x1={x + w / 2 + 1} z1={z + 8} h={3} y={12} mat={M.white} />
    </group>
  )
}

// White table with chairs on both long sides.
function Table({ x, z, w = 60 }: { x: number; z: number; w?: number }) {
  return (
    <group>
      <Block x0={x - w / 2} z0={z - 9} x1={x + w / 2} z1={z + 9} h={13} mat={M.white} />
      {[-w * 0.3, 0, w * 0.3].map((dx) => (
        <group key={dx}>
          <Block x0={x + dx - 5} z0={z - 20} x1={x + dx + 5} z1={z - 12} h={12} mat={M.white} cast={false} />
          <Block x0={x + dx - 5} z0={z + 12} x1={x + dx + 5} z1={z + 20} h={12} mat={M.white} cast={false} />
        </group>
      ))}
    </group>
  )
}

// Tree in a green planter.
function Tree({ x, z, s = 1 }: { x: number; z: number; s?: number }) {
  return (
    <group>
      <Block x0={x - 22 * s} z0={z - 22 * s} x1={x + 22 * s} z1={z + 22 * s} h={5} mat={M.planterRim} cast={false} />
      <Block x0={x - 17 * s} z0={z - 17 * s} x1={x + 17 * s} z1={z + 17 * s} h={7} mat={M.grass} cast={false} />
      <mesh position={[x - CX, 22 * s, z - CZ]} material={M.trunk} castShadow>
        <cylinderGeometry args={[2.5 * s, 3.5 * s, 34 * s, 6]} />
      </mesh>
      <mesh position={[x - CX, 46 * s, z - CZ]} material={M.leaf} castShadow>
        <icosahedronGeometry args={[19 * s, 0]} />
      </mesh>
      <mesh position={[x - CX + 8 * s, 38 * s, z - CZ - 6 * s]} material={M.leafDark} castShadow>
        <icosahedronGeometry args={[12 * s, 0]} />
      </mesh>
    </group>
  )
}

// White flat canopy on four thin posts (the small covered areas between tents).
function Canopy({ x0, z0, x1, z1 }: { x0: number; z0: number; x1: number; z1: number }) {
  const posts: P[] = [
    [x0 + 3, z0 + 3],
    [x1 - 3, z0 + 3],
    [x0 + 3, z1 - 3],
    [x1 - 3, z1 - 3],
  ]
  return (
    <group>
      <Block x0={x0} z0={z0} x1={x1} z1={z1} h={5} y={42} mat={M.white} />
      {posts.map(([px, pz], i) => (
        <Block key={i} x0={px - 2} z0={pz - 2} x1={px + 2} z1={pz + 2} h={42} mat={M.dark} cast={false} />
      ))}
    </group>
  )
}

// Blue gate frame that sits in a wall opening.
function GateFrame({ x0, x1, z0, z1, h = 70 }: { x0: number; x1: number; z0: number; z1: number; h?: number }) {
  const post = 12
  return (
    <group>
      <Block x0={x0} z0={z0} x1={x0 + post} z1={z1} h={h} mat={M.blue} />
      <Block x0={x1 - post} z0={z0} x1={x1} z1={z1} h={h} mat={M.blue} />
      <Block x0={x0} z0={z0} x1={x1} z1={z1} h={12} y={h - 12} mat={M.blue} />
      <Block x0={x0 + post} z0={z0 + 4} x1={x1 - post} z1={z1 - 4} h={3} y={h - 15} mat={M.blueGlow} cast={false} />
    </group>
  )
}

// The ornate blue entrance gate at the front of the hall (arch opening).
function EntranceGate({ x0, z, w = 176, h = 100, depth = 36 }: { x0: number; z: number; w?: number; h?: number; depth?: number }) {
  const shape = useMemo(() => {
    const s = new THREE.Shape()
    const o0 = w / 2 - 30
    const o1 = w / 2 + 30
    s.moveTo(0, 0)
    s.lineTo(o0, 0)
    s.lineTo(o0, 48)
    s.absarc(w / 2, 48, 30, Math.PI, 0, true)
    s.lineTo(o1, 0)
    s.lineTo(w, 0)
    s.lineTo(w, h)
    s.lineTo(0, h)
    s.closePath()
    return s
  }, [w, h])

  return (
    <group position={[x0 - CX, 0, z - CZ]}>
      <mesh material={M.blue} castShadow receiveShadow>
        <extrudeGeometry args={[shape, { depth, bevelEnabled: false }]} />
      </mesh>
      {/* light band above the arch */}
      <mesh position={[w / 2, 88, depth + 0.5]} material={M.blueGlow}>
        <boxGeometry args={[70, 10, 1]} />
      </mesh>
    </group>
  )
}

// ---------------------------------------------------------------- layout ---
const HALL: P[] = [
  [300, 405],
  [1000, 405],
  [1030, 678],
  [258, 678],
]
const TENT3: P[] = [
  [430, 58],
  [590, 58],
  [590, 392],
  [430, 392],
]
const TENT2: P[] = [
  [655, 58],
  [822, 58],
  [822, 392],
  [655, 392],
]
const TENT4_LOWER: P[] = [
  [185, 205],
  [282, 205],
  [282, 398],
  [88, 398],
]
const TENT4_UPPER: P[] = [
  [262, 40],
  [402, 40],
  [402, 178],
  [197, 178],
]
const DOME_YARD: P[] = [
  [828, 90],
  [1315, 90],
  [1315, 438],
  [828, 438],
]

const DOME_CENTER: P = [1072, 264]
const DOME_R = 150

const HALL_BACK_BOOTHS: P[] = [
  [352, 472],
  [541, 472],
  [619, 472],
  [838, 472],
  [895, 472],
  [954, 472],
]
const HALL_COUNTERS: P[] = [
  [300, 655],
  [425, 655],
  [560, 655],
  [675, 655],
  [770, 655],
  [985, 655],
]
const HALL_TABLES: P[] = [
  [365, 512],
  [365, 552],
  [335, 625],
  [630, 650],
  [885, 612],
]
const TENT3_BOOTHS: P[] = [
  [463, 175],
  [463, 228],
  [463, 345],
  [556, 118],
  [556, 172],
  [556, 226],
  [556, 345],
]
const TENT2_BOOTHS: P[] = [
  [692, 115],
  [692, 170],
  [692, 225],
  [692, 340],
  [785, 110],
  [785, 165],
  [785, 225],
  [785, 345],
]
const TREES: P[] = [
  // left of the first tent
  [200, 110],
  [160, 190],
  [120, 270],
  [85, 350],
  [58, 430],
  // between tents
  [416, 100],
  [414, 180],
  [330, 285],
  [345, 335],
  [320, 380],
  [624, 105],
  [622, 160],
  [620, 285],
  [614, 335],
  [604, 380],
]

// ----------------------------------------------------------------- model ---
export default function VillageModel() {
  return (
    <group scale={MODEL_U}>
      {/* soft ground that fades out at the edges (no hard platform edge) */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <circleGeometry args={[GROUND_R, 64]} />
        <meshStandardMaterial color="#6a7184" roughness={1} transparent alphaMap={fadeTexture} />
      </mesh>

      {/* front hall */}
      <Room points={HALL} gaps={{ 0: [[446, 502], [718, 800]], 2: [[840, 900]] }} />
      {HALL_BACK_BOOTHS.map(([x, z]) => (
        <Booth key={`hb${x}`} x={x} z={z} w={58} d={54} />
      ))}
      {HALL_COUNTERS.map(([x, z]) => (
        <Counter key={`hc${x}`} x={x} z={z} />
      ))}
      {HALL_TABLES.map(([x, z]) => (
        <Table key={`ht${x}-${z}`} x={x} z={z} w={64} />
      ))}
      <EntranceGate x0={782} z={664} />

      {/* gates between the hall and the two back tents */}
      <GateFrame x0={446} x1={502} z0={380} z1={419} />
      <GateFrame x0={718} x1={800} z0={380} z1={419} />

      {/* back tents */}
      <Room points={TENT3} gaps={{ 2: [[446, 502]] }} />
      {TENT3_BOOTHS.map(([x, z]) => (
        <Booth key={`t3${x}-${z}`} x={x} z={z} w={46} d={48} />
      ))}
      <Table x={470} z={105} w={50} />

      <Room points={TENT2} gaps={{ 2: [[718, 800]] }} />
      {TENT2_BOOTHS.map(([x, z]) => (
        <Booth key={`t2${x}-${z}`} x={x} z={z} w={46} d={48} />
      ))}

      {/* left tent (two rooms) */}
      <Room points={TENT4_LOWER} gaps={{ 2: [[222, 262]] }} />
      <Room points={TENT4_UPPER} />
      <Block x0={250} z0={62} x1={335} z1={140} h={58} mat={M.blue} />
      <Block x0={262} z0={140} x1={323} z1={143} h={20} y={20} mat={M.blueGlow} cast={false} />
      {[
        [168, 270],
        [151, 305],
        [133, 340],
      ].map(([x, z]) => (
        <Block key={`bd${z}`} x0={x - 6} z0={z - 17} x1={x + 6} z1={z + 17} h={56} mat={M.dark} />
      ))}
      <Table x={215} z={290} w={60} />
      <Table x={190} z={355} w={60} />
      {/* pink gate */}
      <Block x0={222} z0={398} x1={232} z1={430} h={56} mat={M.pink} />
      <Block x0={252} z0={398} x1={262} z1={430} h={56} mat={M.pink} />
      <Block x0={222} z0={398} x1={262} z1={430} h={10} y={46} mat={M.pink} />

      {/* small covered areas between the tents */}
      <Canopy x0={335} z0={192} x1={420} z1={242} />
      <Canopy x0={575} z0={193} x1={660} z1={243} />

      {/* dome yard */}
      <Room points={DOME_YARD} h={48} floor={M.floorDome} />
      <mesh
        position={[DOME_CENTER[0] - CX, 1, DOME_CENTER[1] - CZ]}
        scale={[1, 0.95, 0.95]}
        material={M.dome}
        castShadow
        receiveShadow
      >
        <sphereGeometry args={[DOME_R, 48, 24, 0, Math.PI * 2, 0, Math.PI / 2]} />
      </mesh>

      {TREES.map(([x, z]) => (
        <Tree key={`tr${x}-${z}`} x={x} z={z} />
      ))}
    </group>
  )
}