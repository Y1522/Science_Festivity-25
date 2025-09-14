window.currentLang = 'ar';

const STRINGS = {
  ar: {
    brand: 'احتفالية العلوم 2025',
    'home.title': 'احتفالية العلوم 2025\nالعلماء العرب في العصر الذهبي للإسلام',
    'home.subtitle': 'اكتشف خريطة الفاعليات والأجنحة والألعاب التعليمية',
    'nav.map': 'الخريطة الرئيسية',
    'nav.tent1': 'الخيمة 1',
    'nav.tent2': 'الخيمة 2',
    'nav.tent3': 'الخيمة 3',
    'nav.psc': 'خيمة مركز القبة السماوية',
    'nav.conference': 'مركز المؤتمرات',
    'nav.outdoor': 'المسرح الخارجي',
    'nav.games': 'الألعاب',
    'map.welcome': 'مرحبا بكم',
    'map.prompt': 'اضغط على الكتاب و اكتشف',
    'map.bookLoading': 'جارٍ التحميل...'
  },
  en: {
    brand: 'Science Festivity 2025',
    'home.title': 'Science Festivity 2025\nArab Scientists of the Golden Age of Islam',
    'home.subtitle': 'Explore the map, tents, and educational games',
    'nav.map': 'Main Map',
    'nav.tent1': 'Tent 1',
    'nav.tent2': 'Tent 2',
    'nav.tent3': 'Tent 3',
    'nav.psc': 'PSC Tent',
    'nav.conference': 'Conference Center',
    'nav.outdoor': 'Outdoor Stage',
    'nav.games': 'Games',
    'map.welcome': 'Welcome to',
    'map.prompt': 'Press the book and explore',
    'map.bookLoading': 'Loading...'
  }
};

function applyI18n(){
  const dict = STRINGS[window.currentLang] || {};
  document.documentElement.lang = window.currentLang;
  document.documentElement.dir = window.currentLang === 'ar' ? 'rtl' : 'ltr';
  document.querySelectorAll('[data-i18n]').forEach(function(el){
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
  applyI18n();
}

document.addEventListener('DOMContentLoaded', applyI18n);


