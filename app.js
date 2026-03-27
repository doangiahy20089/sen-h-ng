/**
 * app.js — Khởi động ứng dụng & các hàm dùng chung
 */

// ─── Page switching ───────────────────────────────────────────────
function switchPage(role) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.role-tab').forEach(t => { t.classList.remove('active'); t.classList.add('text-stone-500'); });
  document.getElementById('page-' + role).classList.add('active');
  const tab = document.getElementById('tab-' + role);
  tab.classList.add('active');
  tab.classList.remove('text-stone-500');
}

// ─── Modal helpers ────────────────────────────────────────────────
function openModal(id) { document.getElementById(id).classList.add('open'); }
function closeModal(id) { document.getElementById(id).classList.remove('open'); }

// ─── Toast ────────────────────────────────────────────────────────
function toast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2500);
}

// ─── Care actions (Trang Người thân) ─────────────────────────────
function markCareDone(btn, label) {
  btn.textContent = '✅ Đã hoàn thành!';
  btn.className   = 'w-full py-3 bg-accent-bg text-accent font-bold rounded-xl text-base cursor-default';
  btn.disabled    = true;
  toast(`✅ Đã ghi nhận: ${label}`);
  addNotification(`💪 Người thân đã thực hiện: "${label}"`);
}

function saveReminder(text) {
  const reminders = DB.get('reminders', []);
  reminders.push({ text, time: new Date().toLocaleString('vi-VN') });
  DB.set('reminders', reminders);
  toast('💡 Đã lưu nhắc nhở!');
  addNotification(`🔔 Nhắc nhở mới: ${text}`);
}

// ─── Emotion (Trang Mẹ bầu) ──────────────────────────────────────
async function selectEmotion(btn, emotion) {
  document.querySelectorAll('.emotion-btn').forEach(b => b.classList.remove('selected', 'bg-primary', 'text-white', 'border-primary'));
  btn.classList.add('selected', 'bg-primary', 'text-white', 'border-primary');

  const tipBox  = document.getElementById('emotion-ai-tip');
  const tipText = document.getElementById('emotion-ai-text');
  tipBox.classList.remove('hidden');
  tipText.textContent = '...';

  try {
    const reply = await aiEmotionAdvice(emotion, 12); // tuần 12
    tipText.textContent = reply;
  } catch {
    tipText.textContent = 'Cảm ơn mẹ đã chia sẻ! Bé yêu đang cảm nhận được tình yêu từ mẹ mỗi ngày 💕';
  }
  addNotification(`❤️ Mẹ ghi nhận cảm xúc: ${emotion}`);
}

// ─── AI-powered modals ────────────────────────────────────────────
async function openMealPlan() {
  openModal('modal-meal');
  document.getElementById('meal-content').innerHTML = '<div class="flex items-center gap-3 text-sm text-muted"><div class="spinner"></div><span>Đang tải thực đơn từ AI...</span></div>';
  try {
    const text = await aiMealPlan(28);
    document.getElementById('meal-content').innerHTML = `<div class="text-sm leading-relaxed whitespace-pre-wrap text-stone-700">${text}</div>`;
  } catch {
    document.getElementById('meal-content').innerHTML = '<p class="text-sm text-danger">Không thể kết nối AI. Vui lòng thử lại.</p>';
  }
}

async function openBirthPlan() {
  openModal('modal-birthplan');
  document.getElementById('birthplan-content').innerHTML = '<div class="flex items-center gap-3 text-sm text-muted"><div class="spinner"></div><span>Đang tải...</span></div>';
  try {
    const text = await aiBirthPlan('BV Đồng Nai', 28);
    document.getElementById('birthplan-content').innerHTML = `<div class="text-sm leading-relaxed whitespace-pre-wrap text-stone-700">${text}</div>`;
  } catch {
    document.getElementById('birthplan-content').innerHTML = '<p class="text-sm text-danger">Không thể kết nối. Thử lại sau.</p>';
  }
}

async function openWeekDetail() {
  openModal('modal-week-detail');
  document.getElementById('week-detail-content').innerHTML = '<div class="flex items-center gap-3 text-sm text-muted"><div class="spinner"></div></div>';
  try {
    const text = await aiWeekDetail(12);
    document.getElementById('week-detail-content').innerHTML = `<div class="text-sm leading-relaxed whitespace-pre-wrap text-stone-700">${text}</div>`;
  } catch {
    document.getElementById('week-detail-content').innerHTML = '<p class="text-sm text-danger">Không thể kết nối. Thử lại sau.</p>';
  }
}

// ─── Misc ─────────────────────────────────────────────────────────
function openAddAppointment() { openModal('modal-add-appointment'); }

function saveAppointment() {
  const name = document.getElementById('appt-name').value.trim();
  const date = document.getElementById('appt-date').value;
  const time = document.getElementById('appt-time').value;
  const loc  = document.getElementById('appt-loc').value.trim();
  if (!name) { toast('⚠️ Vui lòng nhập tên lịch hẹn'); return; }
  closeModal('modal-add-appointment');
  toast(`📅 Đã lưu lịch hẹn: ${name}`);
  addNotification(`📅 Lịch hẹn mới: ${name} — ${date} ${time} tại ${loc}`);
  ['appt-name', 'appt-date', 'appt-time', 'appt-loc'].forEach(id => { document.getElementById(id).value = ''; });
}

function openProfile()    { toast('👤 Trang cá nhân đang phát triển'); }
function openSchedule()   { toast('📅 Xem lịch khám đầy đủ'); }
function openClassInfo()  { toast('📹 Lớp học tiền sản: CN 13/04 lúc 9:00 sáng — Nền tảng Sen Hồng'); }
function openAllSuggestions() { toast('📋 Đang tải thêm gợi ý...'); }
function openVitalDetail(t)   { openAddVital(); }

// ─── Boot ─────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  // Close modal khi click overlay
  document.querySelectorAll('.modal-overlay').forEach(m => {
    m.addEventListener('click', e => { if (e.target === m) m.classList.remove('open'); });
  });

  renderTasks();
  renderPatients();

  // Ẩn dot nếu không có unread
  if (!notifications.some(n => !n.read)) {
    const dot = document.getElementById('notif-dot');
    if (dot) dot.style.display = 'none';
  }
});
