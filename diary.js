/**
 * diary.js — Nhật ký thai kỳ
 */

function openDiary() {
  renderDiary();
  openModal('modal-diary');
}

function renderDiary() {
  const list = document.getElementById('diary-entries');
  if (!diaryEntries.length) {
    list.innerHTML = '<p class="text-sm text-muted text-center py-4">Chưa có nhật ký nào. Hãy ghi lại kỷ niệm đầu tiên! 💕</p>';
    return;
  }
  list.innerHTML = diaryEntries.slice().reverse().map(e => `
    <div class="bg-primary-soft/40 rounded-xl p-4">
      <p class="text-xs text-muted font-semibold mb-1">${e.date}</p>
      <p class="text-sm leading-relaxed">${e.text}</p>
    </div>
  `).join('');
}

function saveDiaryEntry() {
  const txt = document.getElementById('diary-input').value.trim();
  if (!txt) { toast('⚠️ Vui lòng nhập nội dung'); return; }
  diaryEntries.push({ text: txt, date: new Date().toLocaleString('vi-VN') });
  saveDiary();
  document.getElementById('diary-input').value = '';
  renderDiary();
  toast('💾 Đã lưu nhật ký!');
  addNotification('📖 Nhật ký mới vừa được ghi lại');
}
