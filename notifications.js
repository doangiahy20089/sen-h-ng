/**
 * notifications.js — Hệ thống thông báo
 */

function addNotification(text) {
  notifications.unshift({ id: Date.now(), text, time: 'Vừa xong', read: false });
  saveNotifications();
  const dot = document.getElementById('notif-dot');
  if (dot) dot.style.display = 'block';
}

function openNotifications() {
  const list = document.getElementById('notif-list');
  if (!notifications.length) {
    list.innerHTML = '<p class="text-center text-sm text-muted py-8">Không có thông báo mới</p>';
  } else {
    list.innerHTML = notifications.map(n => `
      <div class="p-4 rounded-xl ${n.read ? 'bg-stone-50' : 'bg-primary-soft/40'} flex items-start gap-3">
        <div class="w-2 h-2 rounded-full ${n.read ? 'bg-stone-300' : 'bg-primary'} mt-2 flex-shrink-0"></div>
        <div><p class="text-sm leading-relaxed">${n.text}</p><p class="text-xs text-muted mt-1">${n.time}</p></div>
      </div>
    `).join('');
  }
  notifications = notifications.map(n => ({ ...n, read: true }));
  saveNotifications();
  document.getElementById('notif-dot').style.display = 'none';
  openModal('modal-notifications');
}

function clearNotifications() {
  notifications = [];
  saveNotifications();
  closeModal('modal-notifications');
  toast('🗑️ Đã xóa tất cả thông báo');
}
