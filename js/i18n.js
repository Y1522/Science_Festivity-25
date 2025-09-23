window.currentLang = 'ar';

const STRINGS = {
  ar: {
    brand: 'احتفالية العلوم 2025',
    'home.title': 'احتفالية العلوم 2025\nالعلماء العرب في العصر الذهبي للإسلام',
    'home.subtitle': 'اكتشف خريطة الفاعليات والأجنحة والألعاب التعليمية',
    'nav.map': 'الخريطة الرئيسية',
    'nav.tent1': 'خيمة ابن الهيثم',
    'nav.tent2': 'خيمة ابن سينا',
    'nav.tent3': 'خيمة الإدريسي',
    'nav.tent4': 'خيمة ورش القبة',
    'nav.psc': 'PSC Tent',
    'nav.conference': 'مركز المؤتمرات',
    'nav.outdoor': 'المسرح الخارجي',
    'nav.games': 'الألعاب',
    'map.welcome': 'مرحبا بكم',
    'map.prompt': 'اضغط على اللفيفة و اكتشف',
    'map.prompt.en': 'Click on the scroll and discover',
    'map.bookLoading': 'جارٍ التحميل...',
    'games.title': 'الألعاب التعليمية',
    'games.matching': 'لعبة الخريطة التفاعلية',
    'games.quiz': 'لعبة الأسئلة الذكية',
    'games.pingpong': 'لعبة تنس سريع',
    'games.pingpong.desc': 'لعبة تفاعلية سريعة ومثيرة لتنمية ردود الأفعال والتركيز مع العلماء العرب',
    'games.matching.desc': 'رحلة تعليمية حول العالم الإسلامي مع لعبة الذاكرة المتطورة ونظام النقاط والتحفيز',
    'games.quiz.desc': 'اختبار ذكي متدرج الصعوبة لقياس معرفتك عن العلماء العرب مع شرح مفصل للإجابات',
    'game.score': 'النقاط',
    'game.time': 'الوقت',
    'game.attempts': 'المحاولات',
    'home.btn': 'الرئيسية',
    'back.btn': 'رجوع'
  },
  en: {
    brand: 'Science Festivity 2025',
    'home.title': 'Science Festivity 2025\nArab Scientists of the Golden Age of Islam',
    'home.subtitle': 'Explore the map, tents, and educational games',
    'nav.map': 'Main Map',
    'nav.tent1': 'Ibn al-Haytham Tent',
    'nav.tent2': 'Ibn Sina Tent',
    'nav.tent3': 'Al-Idrisi Tent',
    'nav.tent4': 'Planetarium Booth Tent',
    'nav.psc': 'PSC Tent',
    'nav.conference': 'Conference Center',
    'nav.outdoor': 'Outdoor Stage',
    'nav.games': 'Games',
    'map.welcome': 'Welcome to',
    'map.prompt': 'Click on the scroll and discover',
    'map.bookLoading': 'Loading...',
    'games.title': 'Educational Games',
    'games.matching': 'Interactive Map Game',
    'games.quiz': 'Smart Quiz Game',
    'games.pingpong': 'Fast Ping Pong Game',
    'games.pingpong.desc': 'Fast and exciting interactive game to develop reflexes and focus with Arab scientists',
    'games.matching.desc': 'Educational journey around the Islamic world with advanced memory game and scoring system',
    'games.quiz.desc': 'Smart progressive difficulty test to measure your knowledge of Arab scientists with detailed explanations',
    'game.score': 'Score',
    'game.time': 'Time',
    'game.attempts': 'Attempts',
    'home.btn': 'Home',
    'back.btn': 'Back'
  }
};

function applyI18n(){
  const dict = STRINGS[window.currentLang] || {};
  document.documentElement.lang = window.currentLang;
  document.documentElement.dir = window.currentLang === 'ar' ? 'rtl' : 'ltr';
  document.querySelectorAll('[data-i18n]').forEach(function(el){
    if (el.closest('[data-no-i18n="true"]') || el.getAttribute('data-no-i18n') === 'true') {
      return; // skip elements opted-out from i18n
    }
    const key = el.getAttribute('data-i18n');
    const val = dict[key];
    if (val){
      if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA'){
        el.setAttribute('placeholder', val);
      } else {
        el.innerText = val;
      }
    }
  });
}

window.toggleLanguage = function(state){
  if (typeof state === 'string') window.currentLang = state;
  else window.currentLang = window.currentLang === 'ar' ? 'en' : 'ar';
  
  // Update checkbox state
  const checkbox = document.getElementById('lang-toggle');
  if (checkbox) {
    checkbox.checked = window.currentLang === 'en';
  }
  
  applyI18n();
  
  // Trigger language change event for other components
  document.dispatchEvent(new CustomEvent('languageChanged', { 
    detail: { language: window.currentLang } 
  }));
}

document.addEventListener('DOMContentLoaded', applyI18n);


