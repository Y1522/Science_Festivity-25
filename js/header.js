(function(){
  const header = document.getElementById('site-header');
  if(!header) return;

  header.innerHTML = `
    <div class="header-bar" style="background-image:url('${getHeaderImagePath()}');background-size:cover;background-position:center center;background-repeat:no-repeat;">
      <div class="header-actions-left" style="position:fixed; top:20px; left:20px; z-index:1100;">
        <label class="lang-switch" title="Language" data-no-i18n="true" style="width:86px;height:36px;display:inline-block;direction:ltr;">
          <input id="lang-toggle" type="checkbox" aria-label="Switch language">
          <span class="slider"><span class="label-ar" data-no-i18n="true">عربي</span><span class="label-en" data-no-i18n="true">ENG</span></span>
        </label>
      </div>
      <div class="header-actions-right" style="position:fixed; top:20px; right:20px; display:flex; gap:10px; z-index:1100; direction:ltr;">
        <button class="btn header-btn" id="go-home" aria-label="Home" data-i18n="home.btn">الرئيسية</button>
        <button class="btn header-btn" id="go-back" aria-label="Back" data-i18n="back.btn">رجوع</button>
      </div>
    </div>`;

  document.getElementById('lang-toggle')?.addEventListener('click', function(){
    const checked = /** @type {HTMLInputElement} */(this).checked;
    window.toggleLanguage?.(checked ? 'en' : 'ar');
  });

  // Ensure language switch labels remain correct and directional
  function enforceLangSwitchLabels(){
    document.querySelectorAll('.label-ar').forEach(function(lAr){
      lAr.textContent = 'عربي';
      lAr.setAttribute('dir','rtl');
      lAr.style.direction = 'rtl';
      lAr.style.unicodeBidi = 'plaintext';
    });
    document.querySelectorAll('.label-en').forEach(function(lEn){
      lEn.textContent = 'ENG';
      lEn.setAttribute('dir','ltr');
      lEn.style.direction = 'ltr';
      lEn.style.unicodeBidi = 'plaintext';
    });
  }
  enforceLangSwitchLabels();
  document.addEventListener('languageChanged', enforceLangSwitchLabels);

  // Guard against any script overriding the labels
  // Remove heavy MutationObserver for performance

  // Floating إيشو AI button
  const fab = document.createElement('button');
  fab.className = 'btn ai-fab';
  fab.innerHTML = '🧠 إيشو';
  fab.setAttribute('aria-label','إيشو - مساعدك الذكي');
  fab.setAttribute('title','اسأل إيشو عن العلماء العرب!');
  fab.style.position='fixed';
  fab.style.right='16px';
  fab.style.bottom='16px';
  fab.style.zIndex='1200';
  fab.style.background='linear-gradient(135deg, #528AC7, #2b6aa1)';
  fab.style.color='white';
  fab.style.border='none';
  fab.style.borderRadius='50px';
  fab.style.padding='12px 16px';
  fab.style.fontSize='16px';
  fab.style.fontWeight='600';
  fab.style.boxShadow='0 4px 15px rgba(82, 138, 199, 0.4)';
  fab.style.cursor='pointer';
  fab.style.transition='all 0.3s ease';
  fab.style.fontFamily='Cairo, sans-serif';
  
  // Add hover effects
  fab.addEventListener('mouseenter', function() {
    fab.style.transform = 'translateY(-2px) scale(1.05)';
    fab.style.boxShadow = '0 6px 20px rgba(82, 138, 199, 0.6)';
  });
  fab.addEventListener('mouseleave', function() {
    fab.style.transform = 'translateY(0) scale(1)';
    fab.style.boxShadow = '0 4px 15px rgba(82, 138, 199, 0.4)';
  });
  
  document.body.appendChild(fab);
  fab.addEventListener('click', function(){ window.toggleChat?.(); });

  // Map helper removed per request
  
  // Resolve header image path for all pages
  function getHeaderImagePath(){
    const path = location.pathname;
    if (path.includes('/pages/')) return '../../assets/newbk.jpg';
    if (path.includes('/GAME') || path.includes('/game')) return '../assets/newbk.jpg';
    return 'assets/newbk.jpg';
  }
  
  // Validate header image exists; fallback to solid color if not
  (function ensureHeaderImage(){
    const el = document.querySelector('.header-bar');
    if (!el) return;
    const img = new Image();
    const src = getHeaderImagePath();
    img.onload = function(){ el.style.backgroundImage = `url('${src}')`; };
    img.onerror = function(){ el.style.backgroundImage = 'none'; };
    img.src = src;
  })();
  
  // Updated navigation functions
  function rootPath(rel){
    const path = location.pathname;
    if (path.includes('/pages/')) {
      return '../../' + rel;
    } else if (path.includes('/GAME') || path.includes('/game')) {
      return '../' + rel;
    } else {
      return rel;
    }
  }

  // Navigation buttons
  document.getElementById('go-home')?.addEventListener('click', function(){
    location.href = rootPath('index.html');
  });
  document.getElementById('go-back')?.addEventListener('click', function(){
    if (history.length > 1) history.back(); else location.href = rootPath('index.html');
  });
})();


