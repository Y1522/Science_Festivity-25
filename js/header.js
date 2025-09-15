(function(){
  const header = document.getElementById('site-header');
  if(!header) return;

  header.innerHTML = `
    <div class="header-bar">
      <div class="brand">
        <img id="brand-logo" alt="PSC">
      </div>
      <div class="header-center">
        <h1 class="main-title" data-i18n="brand">احتفالية العلوم 2025</h1>
      </div>
      <div class="header-actions">
        <button class="btn header-btn" id="go-home" aria-label="Home" data-i18n="home.btn">الرئيسية</button>
        <button class="btn header-btn" id="go-back" aria-label="Back" data-i18n="back.btn">رجوع</button>
        <label class="lang-switch" title="Language">
          <input id="lang-toggle" type="checkbox" aria-label="Switch language">
          <span class="slider"><span class="label-ar">ENG</span><span class="label-en">ENG</span></span>
        </label>
      </div>
    </div>`;

  document.getElementById('lang-toggle')?.addEventListener('click', function(){
    const checked = /** @type {HTMLInputElement} */(this).checked;
    window.toggleLanguage?.(checked ? 'en' : 'ar');
  });

  // Floating نيشو AI button
  const fab = document.createElement('button');
  fab.className = 'btn ai-fab';
  fab.innerHTML = '🧠 نيشو';
  fab.setAttribute('aria-label','نيشو - مساعدك الذكي');
  fab.setAttribute('title','اسأل نيشو عن العلماء العرب!');
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

  // Smart logo path resolution
  function getLogoPath() {
    const path = location.pathname;
    
    // Check if we're in a subdirectory
    if (path.includes('/pages/')) {
      return '../../assets/psc logo.svg'; // Two levels up from pages/subfolder/
    } else if (path.includes('/GAME') || path.includes('/game')) {
      return '../assets/psc logo.svg'; // One level up from game folders
    } else {
      return 'assets/psc logo.svg'; // Root level
    }
  }
  
  const brandLogo = document.getElementById('brand-logo');
  if (brandLogo){ 
    const logoPath = getLogoPath();
    brandLogo.src = logoPath;
    console.log('🖼️ PSC Logo path resolved to:', logoPath);
    
    // Fallback: if image fails to load, try alternative paths
    brandLogo.onerror = function() {
      console.log('❌ Logo failed to load, trying fallback...');
      if (logoPath.startsWith('../../')) {
        brandLogo.src = '../assets/psc logo.svg';
      } else if (logoPath.startsWith('../')) {
        brandLogo.src = 'assets/psc logo.svg';
      } else {
        brandLogo.src = './assets/psc logo.svg';
      }
    };
  }
  
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


