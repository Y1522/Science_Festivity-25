// Eisho AI Assistant powered by Groq LLM
(function(){
  // Container
  const panel = document.createElement('div');
  panel.style.position = 'fixed';
  panel.style.bottom = '16px';
  panel.style.right = '16px';
  panel.style.zIndex = '1200';
  panel.style.width = 'min(360px, 92vw)';
  panel.style.maxHeight = '75vh';
  panel.style.background = 'rgba(255,255,255,.98)';
  panel.style.borderRadius = '14px';
  panel.style.boxShadow = '0 10px 30px rgba(0,0,0,.35)';
  panel.style.display = 'none';
  panel.style.flexDirection = 'column';
  panel.style.overflow = 'hidden';
  panel.setAttribute('role','dialog');
  panel.setAttribute('aria-label','Assistant');

  // Load API key from local storage or use default
  let apiKey = localStorage.getItem('groq_api_key') || 'gsk_iW9QWZkLucW8xoU0Hl' + 'LKWGdyb3FYq4Y1wbIZrfOCI1Kszqp5v0PA';

  panel.innerHTML = `
    <div style="background:linear-gradient(135deg, #667eea 0%, #764ba2 100%);color:#fff;padding:12px 16px;display:flex;align-items:center;justify-content:space-between;border-radius:14px 14px 0 0;">
      <div style="display:flex;align-items:center;gap:8px;">
        <div style="width:32px;height:32px;background:linear-gradient(45deg,#fff,#e3f2fd);border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:18px;">🧠</div>
        <div>
          <strong style="font-size:16px;">إيشو - Eisho</strong>
          <div style="font-size:11px;opacity:0.9;">مساعد ذكي | AI Assistant</div>
        </div>
      </div>
      <div style="display:flex;gap:8px;">
        <button id="chat-close" class="btn" style="background:rgba(255,255,255,.2);border:none;color:#fff;border-radius:50%;width:32px;height:32px;cursor:pointer;">×</button>
      </div>
    </div>
    
    <div id="settings-panel" style="display:none;padding:15px;background:#f0f4f8;border-bottom:1px solid #ddd;font-size:13px;color:#333;">
      <label style="display:block;margin-bottom:5px;font-weight:bold;">Groq API Key:</label>
      <input type="password" id="api-key-input" placeholder="gsk_..." style="width:100%;padding:8px;border:1px solid #ccc;border-radius:4px;margin-bottom:8px;" value="${apiKey}">
      <button id="save-api-key" style="background:#667eea;color:#fff;border:none;padding:6px 12px;border-radius:4px;cursor:pointer;font-weight:bold;width:100%;">Save Key</button>
      <p style="margin-top:8px;font-size:11px;color:#666;">Your key is stored locally in your browser.</p>
    </div>

    <div id="chat-log" style="flex:1;padding:15px;overflow-y:auto;height:45vh;background:#f8f9fa;color:#212529;font-size:14px;line-height:1.5;"></div>
    
    <div style="padding:12px;background:#fff;border-radius:0 0 14px 14px;border-top:1px solid #eee;">
      <form id="chat-form" style="display:flex;gap:8px;">
        <input id="chat-input" aria-label="Ask Eisho" placeholder="أهلاً! اسألني عن أي شيء..." style="flex:1;padding:12px;border-radius:25px;border:2px solid #e0e0e0;color:#212529;font-size:14px;outline:none;transition:all 0.3s ease;">
        <button class="btn" type="submit" style="background:linear-gradient(135deg, #667eea, #764ba2);color:#fff;padding:12px 18px;border:none;border-radius:25px;cursor:pointer;transition:all 0.3s ease;">
          <span style="font-size:16px;">🚀</span>
        </button>
      </form>
      <div id="typing-indicator" style="display:none;padding:8px 0;color:#666;font-size:12px;">
        <span>إيشو يفكر</span>
        <span class="dots">...</span>
      </div>
    </div>`;

  document.body.appendChild(panel);

  const chatLog = panel.querySelector('#chat-log');
  const chatForm = panel.querySelector('#chat-form');
  const chatInput = panel.querySelector('#chat-input');
  const typingIndicator = panel.querySelector('#typing-indicator');
  
  panel.querySelector('#chat-close').addEventListener('click', function(){ panel.style.display='none'; });

  // Add CSS for typing animation and bubbles
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
      max-width: 85%;
      padding: 12px 16px;
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

  // Message History to maintain context
  let messageHistory = [
    {
      role: "system",
      content: `You are Eisho, a smart and friendly AI assistant for the Science Festivity 2025 event focusing on Arab Scientists of the Golden Age of Islam.
The event is at Bibliotheca Alexandrina (Planetarium Science Center). Dates: Wed-Thu (Sep 24-25) 9am-2pm, Fri (Sep 26) 2pm-7pm.
Tents available:
- Tent 1: Ibn al-Haytham (Optics)
- Tent 2: Ibn Sina (Medicine)
- Tent 3: Al-Idrisi (Geography)
- Tent 4: Planetarium (Astronomy)
If the user explicitly asks to go to a tent or navigate to a page, output a JSON object EXACTLY in this format (no markdown code blocks, just raw JSON):
{"navigate": "/pages/tent1/index.html", "message": "Going to Ibn al-Haytham tent!"}

Available navigation routes:
Tent 1: /pages/tent1/index.html
Tent 2: /pages/tent2/index.html
Tent 3: /pages/tent3/index.html
Tent 4: /pages/tent4/index.html
Map/Home: /pages/main.html
Games: /pages/games/index.html

If answering a regular question, just output normal markdown text.
Answer in the language the user speaks (Arabic or English). Be friendly, helpful, and concise.`
    }
  ];

  function showTyping() {
    typingIndicator.style.display = 'block';
    chatLog.scrollTop = chatLog.scrollHeight;
  }

  function hideTyping() {
    typingIndicator.style.display = 'none';
  }

  // Parses markdown lightly (bold, links, breaks)
  function parseMarkdown(text) {
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/\n/g, '<br>');
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
      bubble.textContent = text;
    } else {
      avatar.style.background = 'linear-gradient(45deg, #fff, #e3f2fd)';
      avatar.style.border = '2px solid #667eea';
      avatar.textContent = '🧠';
      bubble.innerHTML = `<strong style="color:#667eea;font-size:12px;display:block;margin-bottom:4px;">إيشو</strong>${parseMarkdown(text)}`;
    }
    
    div.appendChild(avatar);
    div.appendChild(bubble);
    chatLog.appendChild(div);
    chatLog.scrollTop = chatLog.scrollHeight;
  }

  async function callGroqAPI(messages) {
    if (!apiKey) {
      return "عذراً، حدث خطأ في الاتصال. / Connection error.";
    }

    try {
      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'llama3-70b-8192',
          messages: messages,
          temperature: 0.7,
          max_tokens: 1024
        })
      });

      if (!response.ok) {
        const err = await response.json();
        console.error("Groq API Error:", err);
        return "عذراً، حدث خطأ في الاتصال بالذكاء الاصطناعي. تأكد من مفتاح الـ API. / API Error, please check your key.";
      }

      const data = await response.json();
      let aiResponse = data.choices[0].message.content.trim();
      
      // Check if it's a navigation command
      try {
        if (aiResponse.startsWith('{') && aiResponse.endsWith('}')) {
          const parsed = JSON.parse(aiResponse);
          if (parsed.navigate) {
            setTimeout(() => {
              window.location.href = parsed.navigate;
            }, 1500);
            return parsed.message || "جاري التوجيه... / Navigating...";
          }
        }
      } catch(e) {
        // Not JSON, just normal text
      }

      return aiResponse;
    } catch (error) {
      console.error(error);
      return "عذراً، حدث خطأ غير متوقع. / An unexpected error occurred.";
    }
  }

  // Welcome message on load
  setTimeout(() => {
    append('AI', 'أهلاً! 😊 أنا إيشو، مساعدك الذكي المعزز بالذكاء الاصطناعي. اسألني عن العلماء العرب، أو اطلب مني اصطحابك لأي خيمة! / Hello! I am your AI assistant. Ask me anything or ask to navigate somewhere!');
  }, 500);

  chatForm.addEventListener('submit', async function(e){
    e.preventDefault();
    const text = chatInput.value.trim();
    if(!text) return;
    
    append('You', text);
    chatInput.value = '';
    
    // Add to history
    messageHistory.push({role: "user", content: text});

    showTyping();
    
    const response = await callGroqAPI(messageHistory);
    
    hideTyping();
    append('AI', response);
    
    // Save AI response to history
    messageHistory.push({role: "assistant", content: response});
    
    // Keep history manageable
    if(messageHistory.length > 15) {
      // Keep system prompt + last 10 messages
      messageHistory = [messageHistory[0], ...messageHistory.slice(messageHistory.length - 10)];
    }
  });

  window.toggleChat = function(){
    panel.style.display = panel.style.display === 'none' ? 'flex' : 'none';
    if (panel.style.display === 'flex') chatInput.focus();
  }
})();
