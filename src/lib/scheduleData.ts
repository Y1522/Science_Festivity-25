// Fixed 3-day program for the two festival venues that sit outside the
// tents: the outdoor stage ("المسرح الخارجي") and the indoor session
// ("قاعة المحاضرات").
//
// Source of truth: PSC-ScienceFestivity2026_Leaflet_-Design-V7 (screenshot confirmed)
// Title fix only: noon outdoor show named "كليلة ودمنة والقمر" (not generic)

export type Venue = 'stage' | 'hall' | 'small-theater'

export interface ScheduleItem {
  id: string
  venue: Venue
  date: '2026-09-26' | '2026-09-27' | '2026-09-28'
  dayLabelAr: string
  dayLabelEn: string
  startTime: string // 24h "HH:mm", for sorting/display
  timeLabelAr: string
  timeLabelEn: string
  titleAr: string
  titleEn: string
  descriptionAr?: string
  descriptionEn?: string
  locationAr: string
  locationEn: string
  audienceAr: string
  audienceEn: string
}

const AUDIENCE_ALL_AR = 'جميع الفئات العمرية'
const AUDIENCE_ALL_EN = 'All age groups'

const PODCAST_DESC_AR =
  'ماذا لو اجتمع علماء وحكماء الحضارات القديمة في مجلس واحد ليتحدثوا عن أسرار السماء؟ في هذا العرض نلتقي عبر الزمن بشخصيات من الحضارتين المصرية واليونانية، ونكتشف كيف ألهمت النجوم خيال الإنسان وشكّلت بدايات معرفته بالفلك، في عرض تفاعلي يجمع بين التاريخ والتكنولوجيا والدراما.'
const PODCAST_DESC_EN =
  'What if scholars and sages from ancient civilizations gathered in one council to talk about the secrets of the sky? Travel across time to meet figures from Egyptian and Greek civilization and discover how the stars inspired humanity\u2019s early astronomy \u2014 an interactive show blending history, technology and drama.'

const STAGE_LOC_AR = 'مكتبة الإسكندرية، الساحة الخارجية (البلازا)، المسرح الخارجي'
const STAGE_LOC_EN = 'Bibliotheca Alexandrina, Plaza, Outdoor Stage'
const HALL_LOC_AR = 'مكتبة الإسكندرية، مركز المؤتمرات، قاعة المحاضرات'
const HALL_LOC_EN = 'Bibliotheca Alexandrina, Conference Center, Lecture Hall'

export const scheduleItems: ScheduleItem[] = [

  // ══════════════════════ السبت ٢٦ سبتمبر ══════════════════════
  {
    id: 'sat-wonders',
    venue: 'stage',
    date: '2026-09-26',
    dayLabelAr: 'السبت، 26 سبتمبر 2026',
    dayLabelEn: 'Saturday, 26 September 2026',
    startTime: '09:30',
    timeLabelAr: '9:30 – 10:30 صباحًا',
    timeLabelEn: '9:30 – 10:30 am',
    titleAr: 'عرض عجائب العلوم',
    titleEn: 'Wonders of Science Show',
    locationAr: STAGE_LOC_AR,
    locationEn: STAGE_LOC_EN,
    audienceAr: AUDIENCE_ALL_AR,
    audienceEn: AUDIENCE_ALL_EN,
  },
  {
    // البودكاست — عرض الصباح
    id: 'sat-podcast-1',
    venue: 'hall',
    date: '2026-09-26',
    dayLabelAr: 'السبت، 26 سبتمبر 2026',
    dayLabelEn: 'Saturday, 26 September 2026',
    startTime: '11:00',
    timeLabelAr: '11:00 – 11:45 صباحًا',
    timeLabelEn: '11:00 – 11:45 am',
    titleAr: 'عرض «بودكاست: نجوم في السما»',
    titleEn: 'Podcast Show: "Stars in the Sky"',
    descriptionAr: PODCAST_DESC_AR,
    descriptionEn: PODCAST_DESC_EN,
    locationAr: HALL_LOC_AR,
    locationEn: HALL_LOC_EN,
    audienceAr: AUDIENCE_ALL_AR,
    audienceEn: AUDIENCE_ALL_EN,
  },

  {
    // البودكاست — عرض الظهيرة
    id: 'sat-podcast-2',
    venue: 'hall',
    date: '2026-09-26',
    dayLabelAr: 'السبت، 26 سبتمبر 2026',
    dayLabelEn: 'Saturday, 26 September 2026',
    startTime: '13:00',
    timeLabelAr: '1:00 – 2:00 ظهرًا',
    timeLabelEn: '1:00 – 2:00 pm',
    titleAr: 'عرض «بودكاست: نجوم في السما»',
    titleEn: 'Podcast Show: "Stars in the Sky"',
    descriptionAr: PODCAST_DESC_AR,
    descriptionEn: PODCAST_DESC_EN,
    locationAr: HALL_LOC_AR,
    locationEn: HALL_LOC_EN,
    audienceAr: AUDIENCE_ALL_AR,
    audienceEn: AUDIENCE_ALL_EN,
  },

  // ══════════════════════ الأحد ٢٧ سبتمبر ══════════════════════
  {
    id: 'sun-wonders',
    venue: 'stage',
    date: '2026-09-27',
    dayLabelAr: 'الأحد، 27 سبتمبر 2026',
    dayLabelEn: 'Sunday, 27 September 2026',
    startTime: '09:30',
    timeLabelAr: '9:30 – 10:30 صباحًا',
    timeLabelEn: '9:30 – 10:30 am',
    titleAr: 'عرض عجائب العلوم',
    titleEn: 'Wonders of Science Show',
    locationAr: STAGE_LOC_AR,
    locationEn: STAGE_LOC_EN,
    audienceAr: AUDIENCE_ALL_AR,
    audienceEn: AUDIENCE_ALL_EN,
  },
  {
    // البودكاست — عرض الصباح
    id: 'sun-podcast-1',
    venue: 'hall',
    date: '2026-09-27',
    dayLabelAr: 'الأحد، 27 سبتمبر 2026',
    dayLabelEn: 'Sunday, 27 September 2026',
    startTime: '11:00',
    timeLabelAr: '11:00 – 11:45 صباحًا',
    timeLabelEn: '11:00 – 11:45 am',
    titleAr: 'عرض «بودكاست: نجوم في السما»',
    titleEn: 'Podcast Show: "Stars in the Sky"',
    descriptionAr: PODCAST_DESC_AR,
    descriptionEn: PODCAST_DESC_EN,
    locationAr: HALL_LOC_AR,
    locationEn: HALL_LOC_EN,
    audienceAr: AUDIENCE_ALL_AR,
    audienceEn: AUDIENCE_ALL_EN,
  },

  {
    // البودكاست — عرض الظهيرة
    id: 'sun-podcast-2',
    venue: 'hall',
    date: '2026-09-27',
    dayLabelAr: 'الأحد، 27 سبتمبر 2026',
    dayLabelEn: 'Sunday, 27 September 2026',
    startTime: '13:00',
    timeLabelAr: '1:00 – 2:00 ظهرًا',
    timeLabelEn: '1:00 – 2:00 pm',
    titleAr: 'عرض «بودكاست: نجوم في السما»',
    titleEn: 'Podcast Show: "Stars in the Sky"',
    descriptionAr: PODCAST_DESC_AR,
    descriptionEn: PODCAST_DESC_EN,
    locationAr: HALL_LOC_AR,
    locationEn: HALL_LOC_EN,
    audienceAr: AUDIENCE_ALL_AR,
    audienceEn: AUDIENCE_ALL_EN,
  },

  // ══════════════════════ الاثنين ٢٨ سبتمبر ══════════════════════
  {
    id: 'mon-wonders',
    venue: 'stage',
    date: '2026-09-28',
    dayLabelAr: 'الاثنين، 28 سبتمبر 2026',
    dayLabelEn: 'Monday, 28 September 2026',
    startTime: '09:30',
    timeLabelAr: '9:30 – 10:30 صباحًا',
    timeLabelEn: '9:30 – 10:30 am',
    titleAr: 'عرض عجائب العلوم',
    titleEn: 'Wonders of Science Show',
    locationAr: STAGE_LOC_AR,
    locationEn: STAGE_LOC_EN,
    audienceAr: AUDIENCE_ALL_AR,
    audienceEn: AUDIENCE_ALL_EN,
  },
  {
    // البودكاست — عرض الصباح (11:00)
    id: 'mon-podcast-1',
    venue: 'hall',
    date: '2026-09-28',
    dayLabelAr: 'الاثنين، 28 سبتمبر 2026',
    dayLabelEn: 'Monday, 28 September 2026',
    startTime: '11:00',
    timeLabelAr: '11:00 – 11:45 صباحًا',
    timeLabelEn: '11:00 – 11:45 am',
    titleAr: 'عرض «بودكاست: نجوم في السما»',
    titleEn: 'Podcast Show: "Stars in the Sky"',
    descriptionAr: PODCAST_DESC_AR,
    descriptionEn: PODCAST_DESC_EN,
    locationAr: HALL_LOC_AR,
    locationEn: HALL_LOC_EN,
    audienceAr: AUDIENCE_ALL_AR,
    audienceEn: AUDIENCE_ALL_EN,
  },
  {
    // البودكاست — عرض الظهيرة (12:00) — الاثنين فقط عنده عرضين متتاليين
    id: 'mon-podcast-2',
    venue: 'hall',
    date: '2026-09-28',
    dayLabelAr: 'الاثنين، 28 سبتمبر 2026',
    dayLabelEn: 'Monday, 28 September 2026',
    startTime: '12:00',
    timeLabelAr: '12:00 – 12:45 ظهرًا',
    timeLabelEn: '12:00 – 12:45 pm',
    titleAr: 'عرض «بودكاست: نجوم في السما»',
    titleEn: 'Podcast Show: "Stars in the Sky"',
    descriptionAr: PODCAST_DESC_AR,
    descriptionEn: PODCAST_DESC_EN,
    locationAr: HALL_LOC_AR,
    locationEn: HALL_LOC_EN,
    audienceAr: AUDIENCE_ALL_AR,
    audienceEn: AUDIENCE_ALL_EN,
  },
  {
    id: 'mon-kilila',
    venue: 'stage',
    date: '2026-09-28',
    dayLabelAr: 'الاثنين، 28 سبتمبر 2026',
    dayLabelEn: 'Monday, 28 September 2026',
    startTime: '12:00',
    timeLabelAr: '12:00 – 12:45 ظهرًا',
    timeLabelEn: '12:00 – 12:45 pm',
    titleAr: 'عرض علمي: «كليلة ودمنة والقمر»',
    titleEn: 'Show: "Kalila wa Dimna and the Moon"',
    locationAr: STAGE_LOC_AR,
    locationEn: STAGE_LOC_EN,
    audienceAr: AUDIENCE_ALL_AR,
    audienceEn: AUDIENCE_ALL_EN,
  },
  {
    // الختام — قاعة المحاضرات (مش المسرح الخارجي)
    id: 'mon-closing',
    venue: 'hall',
    date: '2026-09-28',
    dayLabelAr: 'الاثنين، 28 سبتمبر 2026',
    dayLabelEn: 'Monday, 28 September 2026',
    startTime: '14:00',
    timeLabelAr: '2:00 – 3:00 عصرًا',
    timeLabelEn: '2:00 – 3:00 pm',
    titleAr: 'الختام وتسليم الشهادات للعارضين',
    titleEn: 'Closing Ceremony & Certificates for Exhibitors',
    locationAr: HALL_LOC_AR,
    locationEn: HALL_LOC_EN,
    audienceAr: AUDIENCE_ALL_AR,
    audienceEn: AUDIENCE_ALL_EN,
  },
]

// ══════════════════ المسرح الصغير (small-theater) ══════════════════
// عرضان يوميًا طوال الـ ٣ أيام: 11:00–11:45 و 1:00–1:45

const BLACK_THEATER_DESC_AR =
  'عرض المسرح الأسود حيث يكون الكون أقرب مما تظن! تجربة بصرية مذهلة تنقلك عبر أسرار الفضاء.'
const BLACK_THEATER_DESC_EN =
  'A mesmerizing black-theatre show: "The Universe is Closer Than You Think!" — a stunning visual journey through the secrets of space.'

const SMALL_THEATER_LOC_AR = 'مكتبة الإسكندرية، مركز المؤتمرات، المسرح الصغير'
const SMALL_THEATER_LOC_EN = 'Bibliotheca Alexandrina, Conference Center, Small Theater'

const smallTheaterItems: ScheduleItem[] = [
  // السبت — عرض ١
  {
    id: 'sat-blackshow-1',
    venue: 'small-theater',
    date: '2026-09-26',
    dayLabelAr: 'السبت، 26 سبتمبر 2026',
    dayLabelEn: 'Saturday, 26 September 2026',
    startTime: '11:00',
    timeLabelAr: '11:00 – 11:45 صباحًا',
    timeLabelEn: '11:00 – 11:45 am',
    titleAr: 'عرض المسرح الأسود «الكون أقرب مما تظن!»',
    titleEn: 'Black Theatre Show: "The Universe is Closer Than You Think!"',
    descriptionAr: BLACK_THEATER_DESC_AR,
    descriptionEn: BLACK_THEATER_DESC_EN,
    locationAr: SMALL_THEATER_LOC_AR,
    locationEn: SMALL_THEATER_LOC_EN,
    audienceAr: AUDIENCE_ALL_AR,
    audienceEn: AUDIENCE_ALL_EN,
  },
  // السبت — عرض ٢
  {
    id: 'sat-blackshow-2',
    venue: 'small-theater',
    date: '2026-09-26',
    dayLabelAr: 'السبت، 26 سبتمبر 2026',
    dayLabelEn: 'Saturday, 26 September 2026',
    startTime: '13:00',
    timeLabelAr: '1:00 – 1:45 ظهرًا',
    timeLabelEn: '1:00 – 1:45 pm',
    titleAr: 'عرض المسرح الأسود «الكون أقرب مما تظن!»',
    titleEn: 'Black Theatre Show: "The Universe is Closer Than You Think!"',
    descriptionAr: BLACK_THEATER_DESC_AR,
    descriptionEn: BLACK_THEATER_DESC_EN,
    locationAr: SMALL_THEATER_LOC_AR,
    locationEn: SMALL_THEATER_LOC_EN,
    audienceAr: AUDIENCE_ALL_AR,
    audienceEn: AUDIENCE_ALL_EN,
  },
  // السبت — عرض ٣ (12:00)
  {
    id: 'sat-blackshow-3',
    venue: 'small-theater',
    date: '2026-09-26',
    dayLabelAr: 'السبت، 26 سبتمبر 2026',
    dayLabelEn: 'Saturday, 26 September 2026',
    startTime: '12:00',
    timeLabelAr: '12:00 – 12:45 ظهرًا',
    timeLabelEn: '12:00 – 12:45 pm',
    titleAr: 'عرض المسرح الأسود «الكون أقرب مما تظن!»',
    titleEn: 'Black Theatre Show: "The Universe is Closer Than You Think!"',
    descriptionAr: BLACK_THEATER_DESC_AR,
    descriptionEn: BLACK_THEATER_DESC_EN,
    locationAr: SMALL_THEATER_LOC_AR,
    locationEn: SMALL_THEATER_LOC_EN,
    audienceAr: AUDIENCE_ALL_AR,
    audienceEn: AUDIENCE_ALL_EN,
  },
  // الأحد — عرض ١
  {
    id: 'sun-blackshow-1',
    venue: 'small-theater',
    date: '2026-09-27',
    dayLabelAr: 'الأحد، 27 سبتمبر 2026',
    dayLabelEn: 'Sunday, 27 September 2026',
    startTime: '11:00',
    timeLabelAr: '11:00 – 11:45 صباحًا',
    timeLabelEn: '11:00 – 11:45 am',
    titleAr: 'عرض المسرح الأسود «الكون أقرب مما تظن!»',
    titleEn: 'Black Theatre Show: "The Universe is Closer Than You Think!"',
    descriptionAr: BLACK_THEATER_DESC_AR,
    descriptionEn: BLACK_THEATER_DESC_EN,
    locationAr: SMALL_THEATER_LOC_AR,
    locationEn: SMALL_THEATER_LOC_EN,
    audienceAr: AUDIENCE_ALL_AR,
    audienceEn: AUDIENCE_ALL_EN,
  },
  // الأحد — عرض ٢
  {
    id: 'sun-blackshow-2',
    venue: 'small-theater',
    date: '2026-09-27',
    dayLabelAr: 'الأحد، 27 سبتمبر 2026',
    dayLabelEn: 'Sunday, 27 September 2026',
    startTime: '13:00',
    timeLabelAr: '1:00 – 1:45 ظهرًا',
    timeLabelEn: '1:00 – 1:45 pm',
    titleAr: 'عرض المسرح الأسود «الكون أقرب مما تظن!»',
    titleEn: 'Black Theatre Show: "The Universe is Closer Than You Think!"',
    descriptionAr: BLACK_THEATER_DESC_AR,
    descriptionEn: BLACK_THEATER_DESC_EN,
    locationAr: SMALL_THEATER_LOC_AR,
    locationEn: SMALL_THEATER_LOC_EN,
    audienceAr: AUDIENCE_ALL_AR,
    audienceEn: AUDIENCE_ALL_EN,
  },
  // الأحد — عرض ٣ (12:00)
  {
    id: 'sun-blackshow-3',
    venue: 'small-theater',
    date: '2026-09-27',
    dayLabelAr: 'الأحد، 27 سبتمبر 2026',
    dayLabelEn: 'Sunday, 27 September 2026',
    startTime: '12:00',
    timeLabelAr: '12:00 – 12:45 ظهرًا',
    timeLabelEn: '12:00 – 12:45 pm',
    titleAr: 'عرض المسرح الأسود «الكون أقرب مما تظن!»',
    titleEn: 'Black Theatre Show: "The Universe is Closer Than You Think!"',
    descriptionAr: BLACK_THEATER_DESC_AR,
    descriptionEn: BLACK_THEATER_DESC_EN,
    locationAr: SMALL_THEATER_LOC_AR,
    locationEn: SMALL_THEATER_LOC_EN,
    audienceAr: AUDIENCE_ALL_AR,
    audienceEn: AUDIENCE_ALL_EN,
  },
  // الاثنين — عرض ١
  {
    id: 'mon-blackshow-1',
    venue: 'small-theater',
    date: '2026-09-28',
    dayLabelAr: 'الاثنين، 28 سبتمبر 2026',
    dayLabelEn: 'Monday, 28 September 2026',
    startTime: '11:00',
    timeLabelAr: '11:00 – 11:45 صباحًا',
    timeLabelEn: '11:00 – 11:45 am',
    titleAr: 'عرض المسرح الأسود «الكون أقرب مما تظن!»',
    titleEn: 'Black Theatre Show: "The Universe is Closer Than You Think!"',
    descriptionAr: BLACK_THEATER_DESC_AR,
    descriptionEn: BLACK_THEATER_DESC_EN,
    locationAr: SMALL_THEATER_LOC_AR,
    locationEn: SMALL_THEATER_LOC_EN,
    audienceAr: AUDIENCE_ALL_AR,
    audienceEn: AUDIENCE_ALL_EN,
  },
  // الاثنين — عرض ٢
  {
    id: 'mon-blackshow-2',
    venue: 'small-theater',
    date: '2026-09-28',
    dayLabelAr: 'الاثنين، 28 سبتمبر 2026',
    dayLabelEn: 'Monday, 28 September 2026',
    startTime: '13:00',
    timeLabelAr: '1:00 – 1:45 ظهرًا',
    timeLabelEn: '1:00 – 1:45 pm',
    titleAr: 'عرض المسرح الأسود «الكون أقرب مما تظن!»',
    titleEn: 'Black Theatre Show: "The Universe is Closer Than You Think!"',
    descriptionAr: BLACK_THEATER_DESC_AR,
    descriptionEn: BLACK_THEATER_DESC_EN,
    locationAr: SMALL_THEATER_LOC_AR,
    locationEn: SMALL_THEATER_LOC_EN,
    audienceAr: AUDIENCE_ALL_AR,
    audienceEn: AUDIENCE_ALL_EN,
  },
]

// Merge into the main export
scheduleItems.push(...smallTheaterItems)

export function scheduleByVenue(venue: Venue): ScheduleItem[] {
  return scheduleItems
    .filter((item) => item.venue === venue)
    .sort((a, b) => (a.date + a.startTime).localeCompare(b.date + b.startTime))
}