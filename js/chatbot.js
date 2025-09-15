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
    <div style="background:linear-gradient(135deg, #667eea 0%, #764ba2 100%);color:#fff;padding:12px 16px;display:flex;align-items:center;justify-content:space-between;border-radius:14px 14px 0 0;">
      <div style="display:flex;align-items:center;gap:8px;">
        <div style="width:32px;height:32px;background:linear-gradient(45deg,#fff,#e3f2fd);border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:18px;">🧠</div>
        <div>
          <strong style="font-size:16px;">إيشو</strong>
          <div style="font-size:11px;opacity:0.9;">مساعد ذكي للعلماء العرب</div>
        </div>
      </div>
      <button id="chat-close" class="btn" style="background:rgba(255,255,255,.2);border:none;color:#fff;border-radius:50%;width:32px;height:32px;cursor:pointer;">×</button>
    </div>
    <div id="chat-log" style="padding:15px;overflow:auto;height:45vh;background:#f8f9fa;color:#212529;font-size:14px;line-height:1.5;"></div>
    <div style="padding:12px;background:#fff;border-radius:0 0 14px 14px;">
      <form id="chat-form" style="display:flex;gap:8px;">
        <input id="chat-input" aria-label="Ask Nesho" placeholder="أهلاً! اسألني عن أي شيء..." style="flex:1;padding:12px;border-radius:25px;border:2px solid #e0e0e0;color:#212529;font-size:14px;outline:none;transition:all 0.3s ease;">
        <button class="btn" type="submit" style="background:linear-gradient(135deg, #667eea, #764ba2);color:#fff;padding:12px 18px;border:none;border-radius:25px;cursor:pointer;transition:all 0.3s ease;">
          <span style="font-size:16px;">🚀</span>
        </button>
      </form>
      <div id="typing-indicator" style="display:none;padding:8px 0;color:#666;font-size:12px;">
        <span>إيشو يكتب</span>
        <span class="dots">...</span>
      </div>
    </div>`;

  document.body.appendChild(panel);

  const chatLog = panel.querySelector('#chat-log');
  const chatForm = panel.querySelector('#chat-form');
  const chatInput = panel.querySelector('#chat-input');
  const typingIndicator = panel.querySelector('#typing-indicator');
  
  panel.querySelector('#chat-close').addEventListener('click', function(){ panel.style.display='none'; });

  // Add CSS for typing animation
  const style = document.createElement('style');
  style.textContent = `
    .dots {
      animation: typing 1.4s infinite;
    }
    @keyframes typing {
      0%, 20% { opacity: 0; }
      50% { opacity: 1; }
      100% { opacity: 0; }
    }
    .message-bubble {
      max-width: 80%;
      padding: 10px 14px;
      border-radius: 18px;
      margin: 8px 0;
      word-wrap: break-word;
      animation: slideIn 0.3s ease-out;
    }
    .user-message {
      background: linear-gradient(135deg, #667eea, #764ba2);
      color: white;
      margin-left: auto;
      border-bottom-right-radius: 6px;
    }
    .nesho-message {
      background: #ffffff;
      color: #333;
      border: 1px solid #e0e0e0;
      border-bottom-left-radius: 6px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }
    @keyframes slideIn {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }
  `;
  document.head.appendChild(style);

  function showTyping() {
    typingIndicator.style.display = 'block';
    chatLog.scrollTop = chatLog.scrollHeight;
  }

  function hideTyping() {
    typingIndicator.style.display = 'none';
  }

  function append(role, text){
    const div = document.createElement('div');
    div.style.display = 'flex';
    div.style.flexDirection = role === 'You' ? 'row-reverse' : 'row';
    div.style.alignItems = 'flex-start';
    div.style.gap = '8px';
    div.style.margin = '12px 0';

    const avatar = document.createElement('div');
    avatar.style.cssText = `
      width: 28px;
      height: 28px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 14px;
      flex-shrink: 0;
      margin-top: 2px;
    `;
    
    const bubble = document.createElement('div');
    bubble.className = `message-bubble ${role === 'You' ? 'user-message' : 'nesho-message'}`;
    
    if (role === 'You') {
      avatar.style.background = 'linear-gradient(135deg, #667eea, #764ba2)';
      avatar.style.color = 'white';
      avatar.textContent = '👤';
      bubble.innerHTML = text;
    } else {
      avatar.style.background = 'linear-gradient(45deg, #fff, #e3f2fd)';
      avatar.style.border = '2px solid #667eea';
      avatar.textContent = '🧠';
      bubble.innerHTML = `<strong style="color:#667eea;font-size:12px;display:block;margin-bottom:4px;">إيشو</strong>${text}`;
    }
    
    div.appendChild(avatar);
    div.appendChild(bubble);
    chatLog.appendChild(div);
    chatLog.scrollTop = chatLog.scrollHeight;
  }

  // Advanced Bilingual AI Knowledge Base for إيشو
  const KB = [
    // Greetings & Personal Questions (Arabic & English)
    {q:['hello','hi','hey'], a:'Hello there! 😊 I\'m Eisho, your smart assistant for discovering the great Arab scientists! How are you today? What would you like to learn about the Science Festivity?'},
    {q:['أهلا','مرحبا','هاي','سلام','السلام عليكم'], a:'أهلاً وسهلاً! 😊 أنا إيشو، مساعدك الذكي في رحلة اكتشاف العلماء العرب العظام! إزيك النهاردة؟ عايز تعرف إيه عن احتفالية العلوم؟'},
    {q:['how are you'], a:'I\'m doing great, thank you! 🤗 I\'m ready to help you with anything about the Science Festivity or the great Arab scientists. What would you like to know today?'},
    {q:['إزيك','كيف حالك','عامل إيه','أخبارك إيه'], a:'الحمد لله، أنا كويس جداً! 🤗 مستعد أساعدك في أي حاجة تخص احتفالية العلوم أو العلماء العرب العظام. إنت عايز تعرف إيه النهاردة؟'},
    {q:['what is your name','who are you'], a:'I\'m Eisho! 🧠 Nice name, isn\'t it? I\'m a smart assistant specialized in Arab scientists and the Islamic Golden Age. I\'m called Eisho because I love being your companion in the journey of science and knowledge! 😄'},
    {q:['اسمك إيه','مين إنت'], a:'أنا إيشو! 🧠 اسم حلو مش كده؟ أنا مساعد ذكي متخصص في العلماء العرب والعصر الذهبي الإسلامي. اتسميت إيشو عشان أحب أكون صاحبك في رحلة العلم والمعرفة! 😄'},
    {q:['good morning','صباح الخير','good evening','مساء الخير'], a:'صباح النور! ☀️ يوم جميل للتعلم عن العلماء العظام اللي غيروا العالم. إيه رأيك نبدأ رحلتنا معاهم؟'},
    {q:['thank you','شكرا','thanks','متشكر'], a:'العفو! 😊 دي حاجة بسيطة. أنا هنا عشان أساعدك دايماً. لو عندك أي سؤال تاني، ماتترددش تسأل!'},
    {q:['bye','goodbye','وداعا','مع السلامة','باي'], a:'مع السلامة! 👋 كان نورتني بجد. استنى زيارتك تاني قريب عشان نكمل رحلة العلم سوا. ربنا معاك! 🌟'},

    // Event Information - Arabic
    {q:['إمتى الحفلة','مواعيد','الوقت إيه'], a:'احتفالية العلوم هتبقى أيام حلوة قوي! 🎉\n📅 الأربعاء والخميس (٢٤-٢٥ سبتمبر) من ٩ الصبح لـ٢ الضهر\n📅 الجمعة (٢٦ سبتمبر) من ٢ الضهر لـ٧ بالليل\nتعال اكتشف معانا عالم العلماء العرب!'},
    {q:['فين','مكان'], a:'الاحتفالية هتبقى في مكان رائع! 🏛️\n📍 مكتبة الإسكندرية - مركز القبة السماوية العلمي\nده مكان تاريخي جميل جداً، هتحس إنك في بيت الحكمة زي زمان! 😍'},
    {q:['المسرح الخارجي','مسرح'], a:'المسرح الخارجي هيكون فيه فعاليات رووووعة! 🎭\n⏰ مواعيد المسرح الخارجي:\n- الأربعاء والخميس: ١١ الصبح - ١ الضهر\n- الجمعة: ٤ العصر - ٦ المغرب\nهتشوف عروض تفاعلية عن العلماء العرب هتخليك تحس إنك معاهم!'},
    
    // Event Information - English
    {q:['when is the event','time','schedule'], a:'The Science Festivity will be amazing days! 🎉\n📅 Wednesday & Thursday (Sep 24-25) from 9 AM to 2 PM\n📅 Friday (Sep 26) from 2 PM to 7 PM\nCome discover the world of Arab scientists with us!'},
    {q:['where','location'], a:'The festivity will be in an amazing place! 🏛️\n📍 Bibliotheca Alexandrina - Planetarium Science Center (PSC)\nIt\'s a beautiful historic place, you\'ll feel like you\'re in the House of Wisdom! 😍'},
    {q:['outdoor stage','stage'], a:'The outdoor stage will have awesome events! 🎭\n⏰ Outdoor stage schedule:\n- Wednesday & Thursday: 11 AM - 1 PM\n- Friday: 4 PM - 6 PM\nYou\'ll see interactive shows about Arab scientists that will make you feel like you\'re with them!'},
    
    // Navigation & Pages
    {q:['tent 1','خيمة 1','خيمة ابن الهيثم','ibn haytham tent'], a:'خيمة ابن الهيثم! 🔬 دي خيمة رائعة هتتعلم فيها عن أبو البصريات الحديث. عايز أوديك عليها دلوقتي؟', nav: 'pages/tent1/index.html'},
    {q:['tent 2','خيمة 2','خيمة ابن سينا','ibn sina tent'], a:'خيمة ابن سينا! ⚕️ هنا هتاكتشف أسرار الطب القديم مع أعظم طبيب في التاريخ. يلا بينا؟', nav: 'pages/tent2/index.html'},
    {q:['tent 3','خيمة 3','خيمة الإدريسي','al-idrisi tent'], a:'خيمة الإدريسي! 🗺️ هتسافر معاه حوالين العالم وتشوف خرائطه المذهلة. مستعد للرحلة؟', nav: 'pages/tent3/index.html'},
    {q:['tent 4','خيمة 4','ورش القبة','planetarium'], a:'خيمة ورش القبة السماوية! 🌟 هنا هتشوف النجوم والكواكب زي ما شافها علماؤنا العرب. عايز تشوف السما؟', nav: 'pages/tent4/index.html'},
    {q:['games','ألعاب','العب','لعب'], a:'الألعاب التعليمية! 🎮 تعال العب وتعلم في نفس الوقت. فيه ألعاب حلوة قوي هتخليك تحب العلم أكتر!', nav: 'pages/games/index.html'},
    {q:['map','خريطة','الخريطة'], a:'الخريطة الرئيسية! 🧭 تعال أوريك كل الأماكن الحلوة في الاحتفالية. هتلاقي كل حاجة منظمة وسهلة!', nav: 'pages/map/index.html'},

    // Scientists - Arabic Responses
    {q:['ابن الهيثم','الحسن بن الهيثم'], a:'ابن الهيثم ده عبقري فشخ! 🤓 (965-1040م)\n🔬 أول واحد يخترع الكاميرا (Camera Obscura)\n👁️ شرح إزاي العين بتشوف\n📚 كتابه "المناظر" علّم كل أوروبا البصريات\n💡 هو اللي اخترع المنهج التجريبي اللي بنستعمله لحد دلوقتي!'},
    {q:['ابن سينا'], a:'ابن سينا ده أسطورة في الطب! 👨‍⚕️ (980-1037م)\n📖 كتب "القانون في الطب" اللي فضل يتدرّس في أوروبا 600 سنة!\n🧠 أول واحد يربط بين الأمراض النفسية والجسدية\n💊 وصف أمراض القلب والكلى بدقة مذهلة\n🏥 لولاه مكانش هيبقى عندنا طب حديث!'},
    {q:['الخوارزمي','خوارزمي'], a:'الخوارزمي ده أبو الرياضيات! 🧮 (780-850م)\n🔢 اخترع الأرقام العربية (0-9) اللي بنستعملها دلوقتي\n📐 مؤسس علم الجبر (Algebra)\n💻 كلمة "Algorithm" جاية من اسمه!\n🌍 لولاه مكانش هيبقى عندنا كمبيوتر أو إنترنت!'},
    {q:['ابن بطوطة','رحالة'], a:'ابن بطوطة ده مسافر العالم الأول! ✈️ (1304-1368م)\n🌍 سافر 120,000 كيلومتر في 29 سنة (أكتر من ماركو بولو بـ3 مرات!)\n🕋 راح الحج 4 مرات\n👨‍⚖️ اشتغل قاضي في الهند وسفير في الصين\n📚 كتابه "تحفة النظار" فتح عيون العالم على ثقافات جديدة'},
    
    // Scientists - English Responses  
    {q:['ibn al-haytham','alhazen'], a:'Ibn al-Haytham was a brilliant genius! 🤓 (965-1040 CE)\n🔬 First to invent the Camera Obscura\n👁️ Explained how the eye sees\n📚 His book "Optics" taught all of Europe about vision\n💡 He invented the scientific experimental method we still use today!'},
    {q:['ibn sina','avicenna'], a:'Ibn Sina was a medical legend! 👨‍⚕️ (980-1037 CE)\n📖 Wrote "The Canon of Medicine" which was taught in Europe for 600 years!\n🧠 First to connect psychological and physical diseases\n💊 Described heart and kidney diseases with amazing accuracy\n🏥 Without him, we wouldn\'t have modern medicine!'},
    {q:['al-khwarizmi','algorithm'], a:'Al-Khwarizmi was the father of mathematics! 🧮 (780-850 CE)\n🔢 Invented the Arabic numerals (0-9) we use today\n📐 Founded algebra (Algebra)\n💻 The word "Algorithm" comes from his name!\n🌍 Without him, we wouldn\'t have computers or internet!'},
    {q:['ibn battuta','traveler'], a:'Ibn Battuta was the world\'s greatest traveler! ✈️ (1304-1368 CE)\n🌍 Traveled 120,000 kilometers in 29 years (3 times more than Marco Polo!)\n🕋 Went to Hajj 4 times\n👨‍⚖️ Worked as a judge in India and ambassador in China\n📚 His book "Rihla" opened the world\'s eyes to new cultures'},

    // Fun & Conversational
    {q:['amazing','رائع','جميل','حلو','عظيم'], a:'صح كده! 🤩 العلماء العرب دول كانوا عباقرة بجد. كل واحد فيهم غيّر العالم بطريقته. عايز تعرف أكتر عن مين فيهم؟'},
    {q:['wow','واو','يا سلام','مش معقول'], a:'أيوة كده! 😄 لما تعرف إنجازاتهم هتقول "مش معقول" أكتر كمان. دول ناس فعلاً خلوا أثر في التاريخ!'},
    {q:['boring','مملّ','مش مهم'], a:'لأ خالص! 😅 العلماء دول حياتهم كانت مليانة مغامرات ومفاجآت. خلاص تعال أقولك حكايات شيقة عنهم هتخليك تغير رأيك!'},
    
    // More Scientists - Extended Knowledge
    {q:['al-biruni','البيروني','بيروني'], a:'البيروني ده عبقري في كل المجالات! 🌍 (973-1048م)\n📏 أول من حسب محيط الأرض بدقة مذهلة\n🏔️ اكتشف أن الضوء أسرع من الصوت\n📚 ألف 146 كتاب في الرياضيات والفلك والجغرافيا\n🇮🇳 أول من درس الهند وثقافتها بعمق'},
    {q:['al-kindi','الكندي','كندي'], a:'الكندي ده "فيلسوف العرب"! 🤓 (801-873م)\n🧮 أول من استخدم الأرقام الهندية في العالم العربي\n🎵 وضع نظرية الموسيقى الرياضية\n💎 اكتشف طرق تنقية المعادن والأحجار الكريمة\n📖 ألف أكثر من 260 كتاب!'},
    {q:['ibn nafis','ابن النفيس','نفيس'], a:'ابن النفيس ده أول من اكتشف الدورة الدموية! 💓 (1213-1288م)\n🫀 وصف دوران الدم في الرئتين قبل أوروبا بـ300 سنة!\n📚 كتابه "شرح تشريح القانون" ثورة في الطب\n🧠 أول من قال إن الدم لا يمر عبر القلب مباشرة\n⚕️ أسس علم وظائف الأعضاء الحديث'},
    {q:['al-jazari','الجزري','جزري'], a:'الجزري ده "أبو الروبوتات"! 🤖 (1136-1206م)\n⚙️ اخترع أول روبوتات في التاريخ\n⏰ صنع ساعات مائية معقدة ودقيقة\n🚰 اخترع نظام المضخات والصمامات\n📖 كتابه "الحيل" يحتوي على 50 اختراع مذهل!'},
    
    // Advanced Conversations & Emotions
    {q:['sad','حزين','زعلان','مضايق'], a:'إيه اللي ضايقك يا صديقي؟ 🤗 تعال نتكلم شوية عن العلماء العظام دول، هتلاقي حكاياتهم تفرحك وتديك أمل. ابن الهيثم مثلاً قضى 10 سنين في السجن وطلع منه بأعظم اكتشافاته! 💪'},
    {q:['happy','فرحان','مبسوط','سعيد'], a:'ده جميل أوي! 😄 فرحتك دي تخليني مبسوط معاك! يلا نزود الفرحة ونتعلم حاجات جديدة عن علماؤنا العظام. إيه رأيك نسافر مع ابن بطوطة أو نكتشف النجوم مع البيروني؟ ✨'},
    {q:['tired','تعبان','مرهق','نعسان'], a:'خلاص استرح شوية! 😴 بس قبل ما تنام، خد معلومة حلوة: ابن سينا كان بيشتغل بالليل ولما يتعب يقرأ شعر عشان يصحى تاني! العلماء العرب كانوا بيشتغلوا بجد بس كانوا بيعرفوا يستريحوا كمان 💤'},
    {q:['excited','متحمس','مشتاق','عايز أتعلم'], a:'دي روح حلوة أوي! 🔥 الحماس ده يفكرني بالعلماء العرب لما كانوا صغيرين. ابن الهيثم مثلاً بدأ يجرب على الضوء من وهو طفل صغير! يلا قولي عايز تتعلم إيه النهاردة؟ 🚀'},
    
    // Historical Context & Stories
    {q:['baghdad','بغداد','house of wisdom','بيت الحكمة'], a:'بغداد زمان كانت "سيليكون فالي" العالم! 🌟 (750-1258م)\n🏛️ بيت الحكمة كان أكبر جامعة في العالم\n📚 مليون كتاب ومخطوطة من كل اللغات\n🔬 مختبرات ومراصد فلكية متطورة\n🌍 علماء من كل البلاد يجوا يتعلموا هناك\nكان زي "جوجل + ناسا + هارفارد" في مكان واحد! 🤯'},
    {q:['cordoba','قرطبة','الأندلس','spain'], a:'قرطبة كانت جنة العلم في أوروبا! 🏰 (756-1236م)\n💡 أول مدينة في أوروبا بها إنارة ليلية\n📖 مكتبة قرطبة كان فيها 400,000 كتاب\n🏥 أول مستشفيات متطورة في أوروبا\n🎓 جامعة قرطبة علّمت كل أوروبا\nالناس كانت تسافر من لندن وباريس عشان تتعلم هناك! 🎭'},
    {q:['translation','ترجمة','نقل المعرفة','حركة الترجمة'], a:'حركة الترجمة دي كانت أعظم مشروع في التاريخ! 📚✨\n🏛️ بيت الحكمة ترجم آلاف الكتب اليونانية والفارسية والهندية\n👥 مترجمين من كل الأديان شتغلوا مع بعض\n💰 الخلفاء كانوا بيدفعوا وزن الكتاب ذهب للمترجم!\n🌍 بفضلهم وصلت المعرفة القديمة لأوروبا\nلولا الترجمة العربية، كان العلم اختفى من العالم! 🙏'},
    
    // Science & Discoveries
    {q:['scientific method','المنهج العلمي','تجربة','experiment'], a:'المنهج العلمي اخترعه العرب! 🔬 خصوصاً ابن الهيثم:\n1️⃣ الملاحظة والسؤال\n2️⃣ وضع الفرضية\n3️⃣ التجربة المتكررة\n4️⃣ تحليل النتائج\n5️⃣ الوصول للقانون\nده اللي بنستعمله لحد دلوقتي في كل العلوم! 🧪'},
    {q:['mathematics','رياضيات','أرقام','حساب','جبر'], a:'الرياضيات العربية غيرت العالم! 🧮\n🔢 الأرقام العربية (0-9) من الهند عبر العرب\n📐 الجبر اخترعه الخوارزمي\n📊 حساب المثلثات طوره البتاني\n∞ مفهوم اللانهاية من ابن الهيثم\n📏 الهندسة التحليلية من عمر الخيام\nبدون الرياضيات العربية مكانش هيبقى عندنا كمبيوتر! 💻'},
    {q:['medicine','طب','علاج','مرض','صحة'], a:'الطب العربي كان الأفضل في العالم! ⚕️\n🏥 أول مستشفيات منظمة (البيمارستان)\n💊 اكتشاف مئات الأدوية من النباتات\n🔬 أول عمليات جراحية معقدة\n📚 "القانون في الطب" لابن سينا\n👁️ أول عمليات العيون (ابن الهيثم)\n🧠 ربط الأمراض النفسية بالجسدية\nأطباء أوروبا كانوا يدرسوا من الكتب العربية! 👨‍⚕️'},
    
    // Fun & Interactive
    {q:['joke','نكتة','اضحكني','فكاهة'], a:'هههه، تعرف إيه؟ 😄\nابن بطوطة لما سافر 120,000 كيلومتر، أمه قالتله: "إنت فين يا ابني؟ الأكل بارد!" 🤣\nوالخوارزمي لما اخترع الصفر، الناس قالتله: "إيه الفايدة من رقم مالوش قيمة؟" ولسه مايعرفوش إن بدونه مكانش هيبقى عندنا موبايل! 📱'},
    {q:['story','حكاية','قصة','احكيلي'], a:'تعال أحكيلك حكاية حلوة! 📖✨\nابن الهيثم لما كان صغير، لاحظ إن الضوء بيدخل من شق الباب ويعمل صورة مقلوبة على الحيطة. فضل يجرب ويجرب لحد ما اكتشف سر الكاميرا! 📸\nوده اللي خلاه يقول: "الشك أول مراحل اليقين" - يعني اسأل واشك عشان توصل للحقيقة! 🤔💡'},
    {q:['wisdom','حكمة','نصيحة','كلام حلو'], a:'خد حكمة من علمائنا العظام! 💎\n\n🔬 ابن الهيثم: "الشك أول مراحل اليقين"\n⚕️ ابن سينا: "الصحة تاج على رؤوس الأصحاء"\n🧮 الخوارزمي: "العلم خير من المال، العلم يحرسك وأنت تحرس المال"\n🗺️ الإدريسي: "من لم يسافر لا يعرف قدر الرجال"\n📚 ابن خلدون: "العلم يُبنى بالتراكم جيل بعد جيل"\n\nأي حكمة عجبتك أكتر؟ 🤗'},
    
    // Registration & Contact
    {q:['registration','how to register','ticket','إزاي أسجل','حجز'], a:'التسجيل سهل جداً ومجاني كمان! 🆓\n📱 امسح الـ QR Code اللي على البوستر\n📞 أو اتصل بمركز القبة السماوية: 4 8389999 (داخلي 2350-2351)\nبسيطة أوي، مش كده؟ 😊'},
    {q:['contact','phone','email','تواصل','رقم تليفون'], a:'للتواصل معانا: 📞\n☎️ (+20) 4 8389999 (داخلي 2350-2351)\n☎️ (+20) 4 820464\n📱 (+20) 1012307772\n📧 psc@bibalex.org\nاتصل في أي وقت، الناس هناك طيبين أوي! 😊'},
    
    // Modern Connections
    {q:['modern','حديث','اليوم','دلوقتي','الآن'], a:'العلماء العرب لسه مأثرين فينا لحد النهاردة! 🌟\n📱 الموبايل: خوارزميات الخوارزمي\n📸 الكاميرا: كاميرا ابن الهيثم المظلمة\n🏥 المستشفيات: نظام البيمارستان العربي\n🗺️ GPS: خرائط الإدريسي\n💊 الأدوية: اكتشافات الرازي وابن سينا\nكل حاجة حوالينا فيها بصمة علمائنا العظام! 🙌'},
    {q:['future','مستقبل','غد','بكرة'], a:'المستقبل محتاج علماء زيك! 🚀\nالعلماء العرب ما وقفوش عند اللي لقوه، دايماً كانوا بيفكروا في اللي جاي. ابن الهيثم تخيل طيران الإنسان، والجزري حلم بالروبوتات، وابن سينا فكر في الطب النفسي.\nإنت كمان ممكن تبقى عالم عظيم وتساهم في تقدم البشرية! 💪✨'}
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

  // Normalize common Egyptian Arabic to MSA to improve matching
  function normalizeEgyptian(text){
    const map = [
      ['فين','أين'], ['دلوقتي','الآن'], ['دلوقتى','الآن'], ['عايز','أريد'], ['عاوزه','أريد'],
      ['إيه','ما'], ['ايه','ما'], ['ازاي','كيف'], ['إزاي','كيف'], ['هروح','سأذهب'], ['اروح','أذهب'],
      ['أروح','أذهب'], ['أحسن','أفضل'], ['احسن','أفضل'], ['فين اروح','أين أذهب']
    ];
    let out = text;
    for(const [src,dst] of map){ out = out.replace(new RegExp(src,'gi'), dst); }
    return out;
  }

  // Simple random jokes in AR/EN
  function randomJoke(q){
    const ar = [
      'مرة عالم قال للصفر: من غيرك المعادلة ناقصة! 😂',
      'الخوارزمي لما اخترع الصفر، الناس قالتله: القيمة فين؟ قالهم: استنوا لحد ما تشوفوا الكمبيوتر! 🤣',
      'ابن بطوطة لما رجع البيت قالوله كنت فين؟ قالهم: GPS لسه مااخترعوهش! 😅'
    ];
    const en = [
      'Why did the scientist cross the road? To peer-review the other side! 😄',
      'Al-Khwarizmi invented zero so our jokes can have 0 sense but 1 big laugh! 😂'
    ];
    const pool = /[\u0600-\u06FF]/.test(q) ? ar : en;
    return pool[Math.floor(Math.random()*pool.length)];
  }

  // Online search fallback (client-side friendly endpoints)
  async function onlineSearch(query){
    try{
      // DuckDuckGo Instant Answer API
      const url = 'https://api.duckduckgo.com/?q=' + encodeURIComponent(query) + '&format=json&no_html=1&skip_disambig=1';
      const res = await fetch(url, {headers:{'Accept':'application/json'}});
      const data = await res.json();
      if(data && (data.Abstract || (data.RelatedTopics && data.RelatedTopics.length))){
        const text = data.Abstract || (data.RelatedTopics[0] && (data.RelatedTopics[0].Text || (data.RelatedTopics[0].Topics && data.RelatedTopics[0].Topics[0] && data.RelatedTopics[0].Topics[0].Text))) || '';
        const src = data.AbstractURL || (data.RelatedTopics[0] && (data.RelatedTopics[0].FirstURL || (data.RelatedTopics[0].Topics && data.RelatedTopics[0].Topics[0] && data.RelatedTopics[0].Topics[0].FirstURL)));
        if(text){
          return (isArabic(query)?'بحث سريع على الإنترنت:\n':'Quick web search:\n') + text + (src ? ('\n' + (isArabic(query)?'المصدر: ':'Source: ') + src) : '');
        }
      }
    }catch(err){ /* ignore */ }
    return isArabic(query)? 'ملقتش نتيجة مؤكدة على الإنترنت دلوقتي، جرّب تصيغ السؤال بطريقة تانية 🙏' : 'I could not find a confident result right now, please try rephrasing 🙏';
  }

  // Rich recommendations for tents/maps when user asks where to go
  function recommendNow(){
    return 'لو عايز اقتراحات سريعة دلوقتي: \n' +
      '• خريطة الاحتفالية: هتلاقي كل الأماكن مرتّبة → افتح "الخريطة" من القائمة.\n' +
      '• خيمة ابن الهيثم (البصريات): تجارب ضوئية ممتعة 🔬\n' +
      '• خيمة ابن سينا (الطب): معلومات مدهشة عن جسم الإنسان ⚕️\n' +
      '• خيمة الإدريسي (الخرائط): رحلة حول العالم 🗺️\n' +
      '• الألعاب التعليمية: اختبر نفسك في الكويز والميموري 🎮\n' +
      'تحب أفتح لك صفحة الخريطة؟ اكتب: الخريطة أو map.';
  }

  async function answer(question){
    const qRaw = question.toLowerCase();
    const q = normalizeEgyptian(qRaw);

    // Special intents: jokes handled dynamically
    const jokeWords = ['joke','نكتة','اضحكني','فكاهة'];
    if(jokeWords.some(w=>qRaw.includes(w))){
      return randomJoke(qRaw);
    }
    // Special intents: where to go now
    const whereNow = ['اروح فين','أروح فين','ايه احسن مكان اروحه دلوقتى','ايه احسن مكان اروحه دلوقتي','فين اروح','أروح فين دلوقتي'];
    if(whereNow.some(w=>qRaw.includes(w))){
      return recommendNow();
    }

    // Check for navigation commands
    let best = KB.find(x => Array.isArray(x.q) ? x.q.some(k => q.includes(k)) : q.includes(x.q));
    if (!best){
      best = KB.find(x => (Array.isArray(x.q)?x.q:[x.q]).some(k => k.split(' ').some(w => q.includes(w))));
    }
    
    // Handle navigation
    if (best && best.nav) {
      setTimeout(() => { location.href = best.nav; }, 1500);
      return best.a + '\n\n🚀 جاري التوجيه...';
    }
    
    // Regular responses
    if (best) return best.a;
    
    // Smart fallback responses
    const greetings = ['أهلا', 'مرحبا', 'hi', 'hello'];
    const questions = ['ما', 'what', 'how', 'إزاي', 'كيف'];
    const hasGreeting = greetings.some(g => q.includes(g));
    const hasQuestion = questions.some(qw => q.includes(qw));
    
    if (hasGreeting) {
      return 'أهلاً بيك! 😊 أنا إيشو، صاحبك في رحلة اكتشاف العلماء العرب. إزاي أقدر أساعدك النهاردة؟';
    }
    
    if (hasQuestion) {
      return 'سؤال حلو! 🤔 أنا متخصص في العلماء العرب والعصر الذهبي الإسلامي. جرب تسأل عن:\n🔬 ابن الهيثم (البصريات)\n⚕️ ابن سينا (الطب)\n🧮 الخوارزمي (الرياضيات)\n🗺️ الإدريسي (الجغرافيا)\n✈️ ابن بطوطة (الرحلات)\nأو اسأل عن مواعيد ومكان الاحتفالية!';
    }
    
    // Final fallback: try online search
    return await onlineSearch(qRaw);
  }

  chatForm.addEventListener('submit', async function(e){
    e.preventDefault();
    const text = chatInput.value.trim();
    if(!text) return;
    
    // Add user message
    append('You', text);
    chatInput.value = '';
    
    // Show typing indicator
    showTyping();
    
    // Simulate thinking time and respond
    setTimeout(async () => {
      const response = await answer(text);
      hideTyping();
      append('AI', response);
    }, 800 + Math.random() * 1200); // Random delay between 0.8-2s for realism
  });

  window.toggleChat = function(){
    panel.style.display = panel.style.display === 'none' ? 'block' : 'none';
    if (panel.style.display === 'block') chatInput.focus();
  }
})();


