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
          <span class="slider"><span class="label-ar">AR</span><span class="label-en">EN</span></span>
        </label>
      </div>
    </div>`;

  document.getElementById('lang-toggle')?.addEventListener('click', function(){
    const checked = /** @type {HTMLInputElement} */(this).checked;
    window.toggleLanguage?.(checked ? 'en' : 'ar');
  });

  // Floating AI button
  const fab = document.createElement('button');
  fab.className = 'btn ai-fab';
  fab.textContent = 'AI';
  fab.setAttribute('aria-label','Assistant');
  fab.style.position='fixed';
  fab.style.right='16px';
  fab.style.bottom='16px';
  fab.style.zIndex='1200';
  document.body.appendChild(fab);
  fab.addEventListener('click', function(){ window.toggleChat?.(); });

  // Map helper removed per request

  // Dynamically resolve asset root and set logo src
  function rootPath(rel){
    const p = location.pathname.replace(/\\/g,'/');
    const marker = "sf'25";
    const idx = p.indexOf(marker);
    if (idx === -1) return rel; // fallback
    const base = p.slice(0, idx + marker.length + 1);
    return base + rel;
  }
  function assetPath(rel){ return rootPath(rel); }
  const brandLogo = document.getElementById('brand-logo');
  if (brandLogo){ brandLogo.src = assetPath('assets/psc logo.svg'); }

  // Navigation buttons
  document.getElementById('go-home')?.addEventListener('click', function(){
    location.href = rootPath('index.html');
  });
  document.getElementById('go-back')?.addEventListener('click', function(){
    if (history.length > 1) history.back(); else location.href = rootPath('index.html');
  });
})();


