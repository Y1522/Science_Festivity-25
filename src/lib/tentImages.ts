import tent1 from '../assets/tents/tent1.png'
import tent2 from '../assets/tents/tent2.png'
import tent3 from '../assets/tents/tent3.png'
import tent4 from '../assets/tents/tent4.png'
import villageOverview from '../assets/tents/village-overview.jpg'

// Real top-down renders, used as textures so the 3D scenes visually match
// the actual venue designs instead of abstract shapes alone.
// Keyed by zone_code (see tentLayouts.ts for why — stable id vs. the
// translatable Arabic name).
export const tentImages: Record<string, string> = {
  gateway_to_universe: tent1,
  sky_observatory: tent2,
  big_bang: tent3,
  planetarium_academy: tent4,
}

export { villageOverview }

// All four renders were normalized to this aspect ratio (width / height).
export const TENT_IMAGE_ASPECT = 1400 / 822
