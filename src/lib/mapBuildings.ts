// 3D layout for the village map. Positions/sizes now follow the real
// adjacency and relative footprint sizes from the CAD plan
// (Plaza_Tent_s_2026_SF_02.pdf): the three back tents sit in a single row
// sharing walls (400m² / 300m² / 300m² left-to-right), with the 500m² front
// hall spanning beneath them, connected by two gates. The dome is a
// separate landmark structure attached past the last back tent.
export interface Building {
  key: string
  numberLabel: string | null
  tentName: string | null
  shape: 'box' | 'dome'
  position: [number, number, number]
  size?: [number, number, number] // width, height, depth
  radius?: number
}

// Back row (left -> right): tent4 (400m²), tent3 (300m²), tent2 (300m²), dome
const TENT4_WIDTH = 3.6
const TENT3_WIDTH = 2.8
const TENT2_WIDTH = 2.8
const BACK_DEPTH = 4
const GAP = 0.35
const BACK_Z = -2

const tent4X = 0
const tent3X = tent4X + TENT4_WIDTH / 2 + GAP + TENT3_WIDTH / 2
const tent2X = tent3X + TENT3_WIDTH / 2 + GAP + TENT2_WIDTH / 2
const domeX = tent2X + TENT2_WIDTH / 2 + 1.2 + 1.8

export const buildings: Building[] = [
  {
    key: 'buildingOne',
    numberLabel: '1',
    tentName: 'خيمة بوابة الكون', // front hall, 500m², booths 2-13
    shape: 'box',
    position: [(tent4X + tent2X) / 2, 0, 3],
    size: [tent2X - tent4X + TENT2_WIDTH, 1.4, 4.2],
  },
  {
    key: 'buildingFour',
    numberLabel: '4',
    tentName: 'خيمة أكاديمية القبة السماوية لتأهيل رواد الفضاء', // 400m², dome workshops (booths 35-36)
    shape: 'box',
    position: [tent4X, 0, BACK_Z],
    size: [TENT4_WIDTH, 1.6, BACK_DEPTH],
  },
  {
    key: 'buildingThree',
    numberLabel: '3',
    tentName: 'خيمة الانفجار العظيم', // 300m², booths 25-34
    shape: 'box',
    position: [tent3X, 0, BACK_Z],
    size: [TENT3_WIDTH, 1.6, BACK_DEPTH],
  },
  {
    key: 'buildingTwo',
    numberLabel: '2',
    tentName: 'خيمة مرصد السماء', // 300m², booths 14-24
    shape: 'box',
    position: [tent2X, 0, BACK_Z],
    size: [TENT2_WIDTH, 1.6, BACK_DEPTH],
  },
  // Dome-shaped landmark past the last back tent — decorative/unused, no
  // tentName, so it renders unclickable.
  {
    key: 'dome',
    numberLabel: null,
    tentName: null,
    shape: 'dome',
    position: [domeX, 0, BACK_Z + 0.5],
    radius: 2,
  },
]

export const villageBounds = {
  centerX: (tent4X + domeX) / 2,
  centerZ: (BACK_Z + 3) / 2,
}