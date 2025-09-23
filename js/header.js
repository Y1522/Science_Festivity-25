(function(){
  const header = document.getElementById('site-header');
  if(!header) return;

  // Resolve header image path for all pages
  function getHeaderImagePath(){
    const path = location.pathname;
    if (path.includes('/pages/')) return '../../assets/newbk.jpg';
    if (path.includes('/GAME') || path.includes('/game')) return '../assets/newbk.jpg';
    return 'assets/newbk.jpg';
  }
  
  // Resolve asset path for all pages
  function getAssetPath(assetName){
    const path = location.pathname;
    if (path.includes('/pages/')) return '../../assets/' + assetName;
    if (path.includes('/GAME') || path.includes('/game')) return '../assets/' + assetName;
    return 'assets/' + assetName;
  }

  // Function to get responsive positioning
  function getResponsivePositioning() {
    const width = window.innerWidth;
    if (width <= 360) {
      return { bottom: '-60px', left: '3px', right: '3px', imgWidth: '70px' };
    } else if (width <= 480) {
      return { bottom: '-70px', left: '5px', right: '5px', imgWidth: '80px' };
    } else if (width <= 768) {
      return { bottom: '-90px', left: '10px', right: '10px', imgWidth: '95px' };
    } else {
      return { bottom: '-120px', left: '20px', right: '20px', imgWidth: '120px' };
    }
  }

  const pos = getResponsivePositioning();

  // Check if this is the main page (index.html)
  const isMainPage = location.pathname === '/' || location.pathname === '/index.html' || location.pathname.endsWith('/index.html') || location.pathname === '';
  
  header.innerHTML = `
    <div class="header-bar" style="background-image:url('${getHeaderImagePath()}');background-size:cover;background-position:center center;background-repeat:no-repeat; position: relative; z-index: 0;">
      ${isMainPage ? `
      <!-- Header 2 Images at Bottom of Header - Only on Main Page -->
      <div class="header2-left" style="position: absolute; bottom: ${pos.bottom}; left: ${pos.left}; z-index: -1;">
        <img src="${getAssetPath('WhatsApp_Image_2025-09-18_at_12.48.42_97bf26d4-removebg-preview.png')}" 
             alt="Header Decorative Element" 
             style="width: ${pos.imgWidth}; height: auto; animation: floatGentle 4s ease-in-out infinite; filter: drop-shadow(0 6px 12px rgba(0,0,0,0.4));">
      </div>
      <div class="header2-right" style="position: absolute; bottom: ${pos.bottom}; right: ${pos.right}; z-index: -1;">
        <img src="${getAssetPath('WhatsApp_Image_2025-09-18_at_12.48.42_97bf26d4-removebg-preview.png')}" 
             alt="Header Decorative Element" 
             style="width: ${pos.imgWidth}; height: auto; animation: floatGentle 4s ease-in-out infinite; filter: drop-shadow(0 6px 12px rgba(0,0,0,0.4));">
      </div>
      ` : ''}
      
      <div class="header-actions-left" style="position:fixed; top:120px; left:10px; z-index:1100;">
        <label class="lang-switch" title="Language" data-no-i18n="true" style="width:100px;height:42px;display:inline-block;direction:ltr;">
          <input id="lang-toggle" type="checkbox" aria-label="Switch language">
          <span class="slider"><span class="label-ar" data-no-i18n="true">عربي</span><span class="label-en" data-no-i18n="true">ENG</span></span>
        </label>
      </div>
      <div class="header-actions-right" style="position:fixed; top:120px; right:10px; display:flex; gap:12px; z-index:1100; direction:ltr;">
        <button class="btn header-btn" id="go-home" aria-label="Home" data-i18n="home.btn" style="padding: 8px 16px; font-size: 16px;">الرئيسية</button>
        <button class="btn header-btn" id="go-back" aria-label="Back" data-i18n="back.btn" style="padding: 8px 16px; font-size: 16px;">رجوع</button>
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
  fab.style.padding='6px 10px';
  fab.style.fontSize='12px';
  fab.style.fontWeight='600';
  fab.style.boxShadow='0 2px 8px rgba(82, 138, 199, 0.4)';
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

  // Function to update header2 positioning on window resize
  function updateHeader2Positioning() {
    const newPos = getResponsivePositioning();
    const leftImg = document.querySelector('.header2-left');
    const rightImg = document.querySelector('.header2-right');
    
    if (leftImg) {
      leftImg.style.bottom = newPos.bottom;
      leftImg.style.left = newPos.left;
      const img = leftImg.querySelector('img');
      if (img) img.style.width = newPos.imgWidth;
    }
    
    if (rightImg) {
      rightImg.style.bottom = newPos.bottom;
      rightImg.style.right = newPos.right;
      const img = rightImg.querySelector('img');
      if (img) img.style.width = newPos.imgWidth;
    }
  }

  // Add resize listener
  window.addEventListener('resize', updateHeader2Positioning);

  // Add CSS animations for header 2 images
  const style = document.createElement('style');
  style.textContent = `
    @keyframes floatGentle {
      0%, 100% { transform: translateY(0px) rotate(0deg); }
      25% { transform: translateY(-8px) rotate(2deg); }
      50% { transform: translateY(-12px) rotate(0deg); }
      75% { transform: translateY(-8px) rotate(-2deg); }
    }
    
    .header2-left img,
    .header2-right img {
      transition: all 0.3s ease;
    }
    
    .header2-left img:hover,
    .header2-right img:hover {
      transform: scale(1.15);
      filter: drop-shadow(0 8px 16px rgba(0,0,0,0.6));
    }
    
    /* Ensure header2 images don't interfere with header actions */
    .header2-left { pointer-events: none; }
    .header2-right { pointer-events: none; }
    .header2-left img, .header2-right img { pointer-events: auto; }
  `;
  document.head.appendChild(style);

  // Map helper removed per request
  
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
    location.href = rootPath('pages/main.html');
  });
  document.getElementById('go-back')?.addEventListener('click', function(){
    if (history.length > 1) history.back(); else location.href = rootPath('index.html');
  });
})();


