// Lightweight client-side FAQ bot powered by a pre-extracted set of Q/A.
// Note: For security and performance, we parse only text from the PDF if available.
(function(){
  // Container
  const panel = document.createElement('div');
  panel.style.position = 'fixed';
  panel.style.bottom = '16px';
  panel.style.right = '16px';
  panel.style.zIndex = '1200';
  panel.style.width = 'min(360px, 92vw)';
  panel.style.maxHeight = '70vh';
  panel.style.background = 'rgba(255,255,255,.98)';
  panel.style.borderRadius = '14px';
  panel.style.boxShadow = '0 10px 30px rgba(0,0,0,.35)';
  panel.style.display = 'none';
  panel.style.overflow = 'hidden';
  panel.setAttribute('role','dialog');
  panel.setAttribute('aria-label','Assistant');

  panel.innerHTML = `
    <div style="background:#528AC7;color:#fff;padding:10px 12px;display:flex;align-items:center;justify-content:space-between;">
      <strong>Assistant</strong>
      <button id="chat-close" class="btn" style="background:rgba(0,0,0,.2)">×</button>
    </div>
    <div id="chat-log" style="padding:10px;overflow:auto;height:40vh"></div>
    <form id="chat-form" style="display:flex;gap:6px;padding:10px">
      <input id="chat-input" aria-label="Ask" placeholder="اسأل عن الأماكن والمواعيد" style="flex:1;padding:10px;border-radius:10px;border:1px solid #ccd;">
      <button class="btn" type="submit">Send</button>
    </form>`;

  document.body.appendChild(panel);

  const chatLog = panel.querySelector('#chat-log');
  const chatForm = panel.querySelector('#chat-form');
  const chatInput = panel.querySelector('#chat-input');
  panel.querySelector('#chat-close').addEventListener('click', function(){ panel.style.display='none'; });

  function append(role, text){
    const div = document.createElement('div');
    div.style.margin = '8px 0';
    div.innerHTML = `<strong>${role}:</strong> <span>${text}</span>`;
    chatLog.appendChild(div);
    chatLog.scrollTop = chatLog.scrollHeight;
  }

  // Bilingual knowledge base (short form). Extend as needed.
  const KB = [
    {q:['when is the event','time','schedule'], a:'Wednesday & Thursday, 24–25 Sep 2025: 9:00 am–2:00 pm. Friday, 26 Sep 2025: 2:00–7:00 pm.'},
    {q:['ما هو الموعد','المواعيد','الوقت','الجدول'], a:'الأربعاء والخميس ٢٤–٢٥ سبتمبر ٢٠٢٥ من ٩ صباحاً إلى ٢ ظهراً. والجمعة ٢٦ سبتمبر ٢٠٢٥ من ٢ ظهراً إلى ٧ مساءً.'},
    {q:['what is the theme','theme'], a:'Arab Scientists of the Golden Age of Islam.'},
    {q:['ما هو الموضوع','الثيمة','ثيم'], a:'العلماء العرب في العصر الذهبي للإسلام.'},
    {q:['where is psc','location','address'], a:'Bibliotheca Alexandrina – Planetarium Science Center (PSC).'},
    {q:['اين','المكان','PSC','موقع'], a:'مكتبة الإسكندرية – مركز القبة السماوية العلمي.'},
    {q:['registration','how to register','ticket'], a:'Free entry upon online reservation via the QR code on the poster.'},
    {q:['التسجيل','ازاي أسجل','الدخول'], a:'الدخول مجاني بعد الحجز الإلكتروني عبر رمز الاستجابة السريع الموجود على الملصق.'},
    {q:['contact','phone','email'], a:'PSC contacts: (+20) 4 8389999 Ext. 2350–2351, (+20) 4 820464, (+20) 1012307772, psc@bibalex.org.'},
    {q:['تواصل','رقم','ايميل'], a:'للتواصل مع PSC: (+20) 4 8389999 (داخلي 2350–2351)، (+20) 4 820464، (+20) 1012307772، psc@bibalex.org.'}
  ];

  function isArabic(text){ return /[\u0600-\u06FF]/.test(text); }

  function routeCommand(q){
    // Quick commands for navigation
    const mapWords = ['map','خريطة'];
    const gamesWords = ['games','ألعاب'];
    const tents = [
      {keys:['tent 1','خيمة 1','الخيمة 1'], href:'pages/tent1/index.html'},
      {keys:['tent 2','خيمة 2','الخيمة 2'], href:'pages/tent2/index.html'},
      {keys:['tent 3','خيمة 3','الخيمة 3'], href:'pages/tent3/index.html'},
      {keys:['tent 4','خيمة 4','الخيمة 4'], href:'pages/tent4/index.html'}
    ];
    if (mapWords.some(w=>q.includes(w))) return 'pages/map/index.html';
    if (gamesWords.some(w=>q.includes(w))) return 'pages/games/index.html';
    for(const t of tents){ if (t.keys.some(w=>q.includes(w))) return t.href; }
    return null;
  }

  function answer(question){
    const q = question.toLowerCase();
    const nav = routeCommand(q);
    if (nav){ setTimeout(()=>{ location.href = nav; }, 350); return isArabic(q) ? 'ثانية واحدة... جارٍ الفتح.' : 'Opening...'; }
    let best = KB.find(x => Array.isArray(x.q) ? x.q.some(k => q.includes(k)) : q.includes(x.q));
    if (!best){
      best = KB.find(x => (Array.isArray(x.q)?x.q:[x.q]).some(k => k.split(' ').some(w => q.includes(w))));
    }
    return best ? best.a : (isArabic(q) ? 'اسألني عن المواعيد، الموضوع، أو كيفية الوصول. يمكنك أيضاً أن تقول: افتح الخريطة، الألعاب، أو خيمة 1.' : 'Ask about times, theme, or how to get there. You can also say: open map, games, or tent 1.');
  }

  chatForm.addEventListener('submit', function(e){
    e.preventDefault();
    const text = chatInput.value.trim();
    if(!text) return;
    append('You', text);
    append('AI', answer(text));
    chatInput.value='';
  });

  window.toggleChat = function(){
    panel.style.display = panel.style.display === 'none' ? 'block' : 'none';
    if (panel.style.display === 'block') chatInput.focus();
  }
})();


