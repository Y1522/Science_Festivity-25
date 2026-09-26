// Translation context for AR/EN toggle across all pages

export type Language = 'ar' | 'en'

export interface Translations {
  // Nav
  home: string
  about: string
  events: string
  today: string
  map: string
  // Landing
  heroTitle: string
  heroSubtitle: string
  exploreMap: string
  // MapPage
  discoverVillage: string
  discoverDesc: string
  dragRotate: string
  conferenceHall: string
  outdoorStage: string
  loadingTents: string
  errorTents: string
  // TentPage
  backToMap: string
  boothCount: (n: number) => string
  tentSubtitle: string
  loadingBooths: string
  errorBooths: string
  noLayout: string
  // BoothInfoPanel
  roomNumber: string
  noInfo: string
  openPage: string
  // BoothPage
  backToTent: string
  loadingBooth: string
  errorBooth: string
  noActivities: string
  // Activity types
  Workshop: string
  Presentation: string
  Storytelling: string
  // Audience
  kindergarten: string
  primary: string
  preparatory: string
  secondary_university: string
  people_of_determination: string
  // Small theater venue
  smallTheater: string
  // Events page
  eventsPageTitle: string
  eventsPageSubtitle: string
  // Toggle button label
  toggleLang: string
  // AboutPage
  aboutHeading: string
  aboutIntro: string
  aboutDatesLabel: string
  aboutHoursLabel: string
  aboutVenueLabel: string
  aboutAudienceLabel: string
  aboutDates: string
  aboutHours: string
  aboutVenue: string
  backHome: string
}

export const ar: Translations = {
  home: 'الرئيسية',
  about: 'عن الاحتفالية',
  events: 'الفعاليات',
  today: 'عروض اليوم',
  map: 'خريطة القرية',
  heroTitle: 'احتفالية العلوم ٢٠٢٦',
  heroSubtitle: 'أبدأ رحلة الاكتشاف، الكون أقرب مما تظن',
  exploreMap: 'استكشف خريطة القرية',
  discoverVillage: 'اكتشف قرية العلوم',
  discoverDesc: 'استكشف كل منطقة وتعرف على التجارب والفعاليات الموجودة في كل منطقة',
  dragRotate: 'اسحب لتدوير الخريطة، واضغط على الأيقونة لاستكشاف الخيمة',
  conferenceHall: 'قاعة المحاضرات',
  outdoorStage: 'المسرح الخارجي',
  loadingTents: 'جارٍ تحميل الخيام...',
  errorTents: 'تعذّر تحميل بيانات الخيام',
  backToMap: '← العودة إلى الخريطة',
  boothCount: (n) => `${n} كشك`,
  tentSubtitle: 'اسحب لتدوير الخريطة، واضغط على أي كشك لعرض تفاصيله',
  loadingBooths: 'جارٍ تحميل الأكشاك...',
  errorBooths: 'تعذّر تحميل الأكشاك',
  noLayout: 'لا يوجد تخطيط داخلي مسجّل لهذه الخيمة بعد.',
  roomNumber: 'غرفة رقم',
  noInfo: 'لا توجد معلومات مسجّلة لهذا الكشك بعد.',
  openPage: 'فتح كصفحة مستقلة',
  backToTent: '← العودة للخيمة',
  loadingBooth: 'جارٍ تحميل بيانات الكشك...',
  errorBooth: 'تعذّر تحميل الكشك',
  noActivities: 'لا توجد معلومات مسجّلة لهذا الكشك بعد.',
  Workshop: 'ورشة عمل',
  Presentation: 'عرض تقديمي',
  Storytelling: 'سرد قصصي',
  kindergarten: 'رياض أطفال',
  primary: 'ابتدائي',
  preparatory: 'إعدادي',
  secondary_university: 'ثانوي وجامعي',
  people_of_determination: 'ذوي الهمم',
  smallTheater: 'المسرح الصغير',
  eventsPageTitle: 'الفعاليات',
  eventsPageSubtitle: 'جميع العروض والفعاليات في الاحتفالية',
  toggleLang: 'English',
  aboutHeading: 'عن الاحتفالية',
  aboutIntro:
    'تنظّم مكتبة الإسكندرية احتفالية العلوم 2026 لتفتح أبواب الاكتشاف أمام زوارها من كل الأعمار، عبر قرية علمية تضم عشرات الأكشاك والورش والعروض التقديمية التفاعلية، إلى جانب عروض حية على المسرح الخارجي وجلسة داخلية في قاعة المحاضرات كل يوم.',
  aboutDatesLabel: 'التواريخ',
  aboutHoursLabel: 'المواعيد',
  aboutVenueLabel: 'المكان',
  aboutAudienceLabel: 'الجمهور المستهدف',
  aboutDates: 'من السبت إلى الاثنين، 26–28 سبتمبر 2026',
  aboutHours: '9:00 صباحًا – 2:00 ظهرًا',
  aboutVenue: 'مكتبة الإسكندرية، الساحة الخارجية (البلازا)',
  backHome: '← العودة للرئيسية',
}

export const en: Translations = {
  home: 'Home',
  about: 'About',
  events: 'Events',
  today: "Today's Shows",
  map: 'Village Map',
  heroTitle: 'Science Festivity 2026',
  heroSubtitle: 'Begin your journey of discovery — the universe is closer than you think',
  exploreMap: 'Explore the Village Map',
  discoverVillage: 'Discover Science Village',
  discoverDesc: 'Explore every zone and discover the experiences and activities in each area',
  dragRotate: 'Drag to rotate the map, click an icon to explore the tent',
  conferenceHall: 'Lecture Hall',
  outdoorStage: 'Outdoor Stage',
  loadingTents: 'Loading tents...',
  errorTents: 'Failed to load tents',
  backToMap: '← Back to Map',
  boothCount: (n) => `${n} booths`,
  tentSubtitle: 'Drag to rotate the map, click any booth to view details',
  loadingBooths: 'Loading booths...',
  errorBooths: 'Failed to load booths',
  noLayout: 'No indoor layout registered for this tent yet.',
  roomNumber: 'Room No.',
  noInfo: 'No information registered for this booth yet.',
  openPage: 'Open Full Page',
  backToTent: '← Back to Tent',
  loadingBooth: 'Loading booth details...',
  errorBooth: 'Failed to load booth',
  noActivities: 'No activities registered for this booth yet.',
  Workshop: 'Workshop',
  Presentation: 'Presentation',
  Storytelling: 'Storytelling',
  kindergarten: 'Kindergarten',
  primary: 'Primary',
  preparatory: 'Preparatory',
  secondary_university: 'Secondary & University',
  people_of_determination: 'People of Determination',
  smallTheater: 'Small Theater',
  eventsPageTitle: 'Events',
  eventsPageSubtitle: 'All shows and events at the festivity',
  toggleLang: 'عربي',
  aboutHeading: 'About the Festivity',
  aboutIntro:
    'Bibliotheca Alexandrina presents Science Festivity 2026, opening the doors of discovery to visitors of all ages through a science village of dozens of booths, workshops and interactive presentations — alongside live shows on the outdoor stage and an indoor session in the lecture hall every day.',
  aboutDatesLabel: 'Dates',
  aboutHoursLabel: 'Hours',
  aboutVenueLabel: 'Venue',
  aboutAudienceLabel: 'Target Audience',
  aboutDates: 'Saturday to Monday, 26–28 September 2026',
  aboutHours: '9:00 am – 2:00 pm',
  aboutVenue: 'Bibliotheca Alexandrina, Plaza',
  backHome: '← Back to Home',
}

export const languages = { ar, en }