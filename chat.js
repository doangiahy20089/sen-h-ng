/**
 * chat.js — AI Chatbot (dùng aiChat từ api.js)
 */

let chatHistory = [];

function openAIChat() { openModal('modal-ai-chat'); }

function quickAsk(q) {
  document.getElementById('chat-input').value = q;
  sendChat();
}

async function sendChat() {
  const input = document.getElementById('chat-input');
  const msg   = input.value.trim();
  if (!msg) return;
  input.value = '';

  appendChatMsg(msg, 'user');

  const typing = appendTyping();
  const btn    = document.getElementById('chat-send-btn');
  btn.disabled = true;

  try {
    // Gọi hàm aiChat từ api.js
    const reply = await aiChat(chatHistory, msg);
    typing.remove();
    appendChatMsg(reply, 'ai');
    chatHistory.push({ role: 'user',      content: msg   });
    chatHistory.push({ role: 'assistant', content: reply });
    // Giới hạn context 20 lượt
    if (chatHistory.length > 40) chatHistory = chatHistory.slice(-40);
  } catch (e) {
    typing.remove();
    appendChatMsg('Có lỗi kết nối. Vui lòng thử lại! 🙏', 'ai');
  }

  btn.disabled = false;
}

function appendChatMsg(text, role) {
  const box = document.getElementById('chat-messages');
  const div = document.createElement('div');
  div.className = 'flex gap-2 items-end ' + (role === 'user' ? 'justify-end' : '');
  div.innerHTML = role === 'ai'
    ? `<div class="w-8 h-8 rounded-full bg-primary-soft flex items-center justify-center text-primary flex-shrink-0"><span class="material-symbols-outlined mso text-sm">spa</span></div><div class="chat-bubble-ai text-sm">${text}</div>`
    : `<div class="chat-bubble-user text-sm">${text}</div>`;
  box.appendChild(div);
  box.scrollTop = box.scrollHeight;
  return div;
}

function appendTyping() {
  const box = document.getElementById('chat-messages');
  const div = document.createElement('div');
  div.className = 'flex gap-2 items-end';
  div.innerHTML = `
    <div class="w-8 h-8 rounded-full bg-primary-soft flex items-center justify-center text-primary flex-shrink-0">
      <span class="material-symbols-outlined mso text-sm">spa</span>
    </div>
    <div class="chat-bubble-ai text-sm flex items-center gap-1">
      <span class="typing-dot"></span><span class="typing-dot"></span><span class="typing-dot"></span>
    </div>`;
  box.appendChild(div);
  box.scrollTop = box.scrollHeight;
  return div;
}
