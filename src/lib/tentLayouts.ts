export interface BoothMarker {
  number: number
  xPct: number
  zPct: number
}

export interface TentLayout {
  markers: BoothMarker[]
}

export const tentLayouts: Record<string, TentLayout> = {
  // Booths 2–12 — "خيمة بوابة الكون" (Gateway to the Universe)
  gateway_to_universe: {
    markers: [
      // الصف الأمامي (zPct ~71)
      { number: 2,  xPct: 91.2, zPct: 71.3 },
      { number: 3,  xPct: 65,   zPct: 70.8 },
      { number: 4,  xPct: 54.6, zPct: 70.4 },
      { number: 5,  xPct: 39.3, zPct: 70.5 },
      { number: 6,  xPct: 21.4, zPct: 69.7 },
      { number: 7,  xPct: 13.8, zPct: 71   },
      // الصف الخلفي (zPct ~21)
      { number: 8,  xPct: 14.4, zPct: 21.2 },
      { number: 9,  xPct: 40.6, zPct: 20.9 },
      { number: 10, xPct: 54.6, zPct: 21.6 },
      { number: 11, xPct: 68.0, zPct: 21.0 },
      { number: 12, xPct: 82.0, zPct: 21.0 },
    ],
  },

  // Booths 13–24 — "خيمة مرصد السماء" (Sky Observatory)
  sky_observatory: {
    markers: [
      { number: 13, xPct: 20.1, zPct: 70.2 },
      { number: 14, xPct: 31.2, zPct: 69.2 },
      { number: 15, xPct: 59.3, zPct: 69.2 },
      { number: 16, xPct: 70,   zPct: 69.5 },
      { number: 17, xPct: 80,   zPct: 69.5 },
      { number: 18, xPct: 92.1, zPct: 69.2 },
      { number: 19, xPct: 77.2, zPct: 21   },
      { number: 20, xPct: 69.5, zPct: 18.1 },
      { number: 21, xPct: 55.5, zPct: 19.1 },
      { number: 22, xPct: 33.2, zPct: 19.8 },
      { number: 23, xPct: 23.5, zPct: 18.4 },
      { number: 24, xPct: 13.5, zPct: 18.6 },
    ],
  },

  // Booths 25–35 — "خيمة الانفجار العظيم" (The Big Bang)
  big_bang: {
    markers: [
      { number: 25, xPct: 10.4, zPct: 69.7 },
      { number: 26, xPct: 18.6, zPct: 69.3 },
      { number: 27, xPct: 26.7, zPct: 69.7 },
      { number: 28, xPct: 54.4, zPct: 70.7 },
      { number: 29, xPct: 63.6, zPct: 71.4 },
      { number: 30, xPct: 75.9, zPct: 17.9 },
      { number: 31, xPct: 57.1, zPct: 18.4 },
      { number: 32, xPct: 49,   zPct: 19.6 },
      { number: 33, xPct: 26.5, zPct: 19.3 },
      { number: 34, xPct: 18.2, zPct: 17.7 },
      { number: 35, xPct: 10.2, zPct: 18.1 },
    ],
  },

  // Booth 36 — "خيمة أكاديمية القبة السماوية لتأهيل رواد الفضاء"
  planetarium_academy: {
    markers: [
      { number: 36, xPct: 70, zPct: 47 },
    ],
  },
}