/**
 * tasks.js — Quản lý việc cần làm (Trang Mẹ bầu)
 */

function renderTasks() {
  const list = document.getElementById('task-list');
  if (!list) return;
  list.innerHTML = tasks.map(t => `
    <div class="bg-card p-5 rounded-2xl flex items-center gap-4 border border-border card-hover ${t.done ? 'opacity-50' : ''}">
      <div onclick="toggleTask(${t.id})"
           class="w-7 h-7 rounded-lg border-2 ${t.done ? 'bg-accent border-accent flex items-center justify-center' : 'border-primary'} flex-shrink-0 cursor-pointer">
        ${t.done ? '<span class="material-symbols-outlined text-white text-sm">check</span>' : ''}
      </div>
      <div class="flex-1 ${t.done ? 'line-through' : ''}">
        <p class="font-bold text-base">${t.text}</p>
        <p class="text-sm text-muted">${t.note}</p>
      </div>
      <button onclick="deleteTask(${t.id})" class="text-stone-300 hover:text-danger transition">
        <span class="material-symbols-outlined mso-o text-xl">delete</span>
      </button>
    </div>
  `).join('');
}

function toggleTask(id) {
  tasks = tasks.map(t => t.id === id ? { ...t, done: !t.done } : t);
  saveTasks();
  renderTasks();
  toast('✅ Đã cập nhật!');
}

function deleteTask(id) {
  tasks = tasks.filter(t => t.id !== id);
  saveTasks();
  renderTasks();
}

function openAddTask() { openModal('modal-add-task'); }

function addTask() {
  const name = document.getElementById('task-name').value.trim();
  const time = document.getElementById('task-time').value.trim();
  if (!name) { toast('⚠️ Vui lòng nhập tên việc cần làm'); return; }
  tasks.push({ id: Date.now(), text: name, note: time || 'Hôm nay', done: false });
  saveTasks();
  renderTasks();
  closeModal('modal-add-task');
  toast('✅ Đã thêm việc cần làm!');
  document.getElementById('task-name').value = '';
  document.getElementById('task-time').value = '';
}
