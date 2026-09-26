// Clickable markers over the village overview render
// (src/assets/tents/village-overview.jpg).
//
// x / y  = marker position as a PERCENTAGE of the image
//          (0,0 = top-left corner, 100,100 = bottom-right corner).
//          To move a marker: open the image in any editor, read the pixel
//          position you want, and divide by the image size (1400 x 821).
//          The 3D model (VillageModel.tsx) is built on the same coordinates,
//          so the icon lands on the matching spot of the model.
// label  = the name shown on the map next to the icon.
// tentNames = names to look for in `tents.name_ar` (database). The first one
//          that exists is the tent this marker opens. Several names are listed
//          so the map keeps working whichever naming the database uses.
//          If none is found the marker is shown dimmed and isn't clickable.
// labelSide = where the name sits relative to the icon ('top' | 'bottom').
// lift   = how high the icon floats above its base (default 1.5). Neighbouring
//          markers use different heights so their names don't overlap.
export interface MapHotspot {
  key: string;
  label: string;
  zoneCode: string;
  tentNames: string[];
  x: number;
  y: number;
  labelSide?: "top" | "bottom";
  lift?: number;
  height?: number;
}

export const mapHotspots: MapHotspot[] = [
  {
    key: "academy",
    label: "أكاديمية القبة السماوية",
    tentNames: ["خيمة أكاديمية القبة السماوية لتأهيل رواد الفضاء"],
    zoneCode: "planetarium_academy",
    x: 13.6,
    y: 36.5,
    labelSide: "top",
  },
  {
    key: "observatory",
    label: "مرصد السماء",
    tentNames: ["خيمة مرصد السماء"],
    zoneCode: "sky_observatory",
    x: 52.7, // ⬅ كان 36.4 — اتبدل مع الانفجار العظيم
    y: 27.4,
    labelSide: "top",
  },
  {
    key: "bigbang",
    label: "الانفجار العظيم",
    tentNames: ["خيمة الانفجار العظيم"],
    zoneCode: "big_bang",
    x: 36.4, // ⬅ كان 52.7 — اتبدل مع مرصد السماء
    y: 27.4,
    labelSide: "top",
    lift: 2.5, // ⬅ الارتفاع العالي انتقل للمكان الجديد (كان مع المرصد)
  },
  {
    // The big front hall. It isn't in the 4-name list, so it keeps its own name —
    // delete this block if it shouldn't appear on the map.
    key: "gate",
    label: "بوابة الكون",
    tentNames: ["خيمة بوابة الكون"],
    zoneCode: "gateway_to_universe",
    x: 46.4,
    y: 65.8,
    labelSide: "bottom",
    lift: 0.9,
  },
];