// Custom minimal header for GAME 1 - only essential buttons with glass effect
(function(){
  const header = document.getElementById('site-header');
  if(!header) return;

  function getAssetPath(assetName){
    return '../assets/' + assetName;
  }

  function getHeaderImagePath(){
    return getAssetPath('bk.png');
  }

  header.innerHTML = `
    <div class="header-bar" style="background:rgba(0,0,0,0.8);backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px);position: relative;">
      
      <div class="header-actions" style="position:fixed; top:20px; left:20px; z-index:1100; display:flex; gap:8px; align-items:center;">
        <button class="btn" onclick="history.back()" title="رجوع" style="background:rgba(255,255,255,.2);border:none;color:#fff;padding:8px 12px;border-radius:8px;cursor:pointer;backdrop-filter:blur(6px);-webkit-backdrop-filter:blur(6px);">
          <span style="font-size:16px;">رجوع</span>
        </button>
        <button class="btn" onclick="location.href='../index.html'" title="الرئيسية" style="background:rgba(255,255,255,.2);border:none;color:#fff;padding:8px 12px;border-radius:8px;cursor:pointer;backdrop-filter:blur(6px);-webkit-backdrop-filter:blur(6px);">
          <span style="font-size:16px;">الرئيسية</span>
        </button>
      </div>
      
      <div class="game-controls" style="position:fixed; top:20px; right:20px; z-index:1100; display:flex; gap:8px; align-items:center;">
        <button id="pauseBtn" class="btn" title="Pause/Resume" style="background:rgba(255,255,255,.2);border:none;color:#fff;padding:8px 12px;border-radius:8px;cursor:pointer;backdrop-filter:blur(6px);-webkit-backdrop-filter:blur(6px);">
          <span style="font-size:16px;">Pause</span>
        </button>
        <button id="restartBtn" class="btn" title="Restart" style="background:rgba(255,255,255,.2);border:none;color:#fff;padding:8px 12px;border-radius:8px;cursor:pointer;backdrop-filter:blur(6px);-webkit-backdrop-filter:blur(6px);">
          <span style="font-size:16px;">Restart</span>
        </button>
      </div>
    </div>`;

  // Add CSS for the glass header effect
  const style = document.createElement('style');
  style.textContent = `
    .header-bar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 8px;
      background: rgba(0,0,0,0.8) !important;
      border: 1px solid rgba(255,255,255,.18);
      backdrop-filter: blur(10px);
      -webkit-backdrop-filter: blur(10px);
      border-radius: 10px;
      margin: 6px 6px;
      box-shadow: 0 2px 12px rgba(0,0,0,.25);
      padding: 2px 6px;
    }
    
    .header-actions .btn,
    .game-controls .btn {
      background: rgba(255,255,255,.2);
      color: #fff;
      border: none;
      backdrop-filter: blur(6px);
      -webkit-backdrop-filter: blur(6px);
      padding: 8px 12px;
      border-radius: 8px;
      font-size: 16px;
      cursor: pointer;
      transition: all 0.3s ease;
    }
    
    .header-actions .btn:hover,
    .game-controls .btn:hover {
      background: rgba(255,255,255,.3);
      transform: translateY(-1px);
    }
    
    .header-actions .btn:active,
    .game-controls .btn:active {
      transform: scale(.98);
    }
    
    /* Hide original pause/restart buttons since they're now in the header */
    #pauseBtn:not(.btn),
    #restartBtn:not(.btn) {
      display: none;
    }
  `;
  document.head.appendChild(style);
})();
