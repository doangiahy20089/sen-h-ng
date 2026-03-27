/**
 * patients.js — Quản lý danh sách thai phụ (Trang Bác sĩ)
 */

let currentStatusFilter = 'all';
let currentPage = 1;
const PAGE_SIZE = 10;

function getStatusBadge(s) {
  if (s === 'normal') return '<span class="bg-accent-bg text-accent text-xs font-black px-3 py-1.5 rounded-full">✅ BÌNH THƯỜNG</span>';
  if (s === 'warn')   return '<span class="bg-danger-bg text-danger text-xs font-black px-3 py-1.5 rounded-full pulse-soft">⚠️ CẢNH BÁO</span>';
  if (s === 'soon')   return '<span class="bg-blue-50 text-blue-700 text-xs font-black px-3 py-1.5 rounded-full">🤱 SẮP SINH</span>';
  return '';
}

function getFilteredPatients() {
  const q    = (document.getElementById('search-input')?.value || '').toLowerCase();
  const dist = document.getElementById('filter-district')?.value || '';
  const eth  = document.getElementById('filter-ethnic')?.value || '';
  return patients.filter(p => {
    const matchQ      = !q || p.name.toLowerCase().includes(q) || p.phone.includes(q);
    const matchDist   = dist === 'Tất cả địa điểm' || !dist || p.district === dist;
    const matchEth    = eth  === 'Tất cả'           || !eth  || p.ethnic   === eth;
    const matchStatus = currentStatusFilter === 'all' || p.status === currentStatusFilter;
    return matchQ && matchDist && matchEth && matchStatus;
  });
}

function renderPatients() {
  const filtered = getFilteredPatients();
  const start    = (currentPage - 1) * PAGE_SIZE;
  const paged    = filtered.slice(start, start + PAGE_SIZE);
  const tbody    = document.getElementById('patient-tbody');
  if (!tbody) return;

  tbody.innerHTML = paged.map(p => `
    <tr class="hover:bg-primary-soft/30 transition-colors">
      <td class="px-6 py-5">
        <div class="flex items-center gap-3">
          <div class="w-11 h-11 rounded-full bg-primary-soft flex items-center justify-center text-primary font-bold text-sm">
            ${p.name.split(' ').slice(-2).map(w => w[0]).join('')}
          </div>
          <div><p class="font-bold text-base">${p.name}</p><p class="text-sm text-muted">${p.phone}</p></div>
        </div>
      </td>
      <td class="px-6 py-5"><span class="font-bold text-base">Tuần ${p.week}</span><br/><span class="text-xs text-muted">Dự sinh: ${p.due}</span></td>
      <td class="px-6 py-5 text-base text-muted">${p.district}</td>
      <td class="px-6 py-5 text-base ${p.ethnic !== 'Kinh' ? 'font-semibold text-primary' : 'text-muted'}">${p.ethnic}</td>
      <td class="px-6 py-5 text-base ${p.lastVisit.includes('10') || p.lastVisit.includes('5') ? 'text-warn font-semibold' : 'text-muted'}">${p.lastVisit}</td>
      <td class="px-6 py-5">${getStatusBadge(p.status)}</td>
      <td class="px-6 py-5">
        <div class="flex gap-1">
          <button onclick="viewPatient(${p.id})" class="p-2 hover:bg-primary-soft rounded-lg transition" title="Xem hồ sơ">
            <span class="material-symbols-outlined mso-o text-primary text-lg">visibility</span>
          </button>
          <button onclick="callPatient('${p.name}','${p.phone}')" class="p-2 hover:bg-accent-bg rounded-lg transition" title="Gọi điện">
            <span class="material-symbols-outlined mso-o text-accent text-lg">phone</span>
          </button>
        </div>
      </td>
    </tr>
  `).join('');

  const countEl = document.getElementById('patient-count');
  if (countEl) countEl.textContent = `Hiển thị ${Math.min(start + 1, filtered.length)}–${Math.min(start + PAGE_SIZE, filtered.length)} trên ${filtered.length} thai phụ`;

  renderPagination(filtered.length);

  const totalEl = document.getElementById('doc-total');
  const riskEl  = document.getElementById('doc-risk');
  if (totalEl) totalEl.textContent = patients.length.toLocaleString('vi-VN');
  if (riskEl)  riskEl.textContent  = patients.filter(p => p.status === 'warn').length;
}

function renderPagination(total) {
  const pages = Math.ceil(total / PAGE_SIZE);
  const pg    = document.getElementById('pagination');
  if (!pg) return;
  if (pages <= 1) { pg.innerHTML = ''; return; }

  let html = `<button onclick="changePage(${Math.max(1, currentPage - 1)})" class="p-2 rounded-full hover:bg-stone-100"><span class="material-symbols-outlined text-lg">chevron_left</span></button>`;
  for (let i = 1; i <= Math.min(pages, 5); i++) {
    html += `<button onclick="changePage(${i})" class="w-9 h-9 rounded-full ${i === currentPage ? 'bg-primary text-white' : 'hover:bg-stone-100'} text-sm font-bold flex items-center justify-center">${i}</button>`;
  }
  html += `<button onclick="changePage(${Math.min(pages, currentPage + 1)})" class="p-2 rounded-full hover:bg-stone-100"><span class="material-symbols-outlined text-lg">chevron_right</span></button>`;
  pg.innerHTML = html;
}

function changePage(p) { currentPage = p; renderPatients(); }
function filterPatients() { currentPage = 1; renderPatients(); }

function setStatusFilter(f) {
  currentStatusFilter = f;
  ['all', 'normal', 'warn'].forEach(x => {
    const b = document.getElementById('filter-' + x);
    if (b) b.className = x === f
      ? 'bg-primary text-white text-sm font-bold px-5 py-3 rounded-xl'
      : 'bg-stone-100 text-stone-600 text-sm font-bold px-5 py-3 rounded-xl hover:bg-accent-bg transition';
  });
  filterPatients();
}

function openAddPatient() { openModal('modal-add-patient'); }

function savePatient() {
  const name     = document.getElementById('p-name').value.trim();
  const phone    = document.getElementById('p-phone').value.trim();
  const week     = document.getElementById('p-week').value;
  const due      = document.getElementById('p-due').value;
  const district = document.getElementById('p-district').value;
  const ethnic   = document.getElementById('p-ethnic').value;
  if (!name || !phone || !week) { toast('⚠️ Vui lòng điền đầy đủ thông tin'); return; }

  patients.push({ id: Date.now(), name, phone, week: parseInt(week), due: due || '—', district, ethnic, lastVisit: 'Hôm nay', status: 'normal' });
  savePatients();
  renderPatients();
  closeModal('modal-add-patient');
  addNotification(`👩 Thai phụ mới: ${name} (Tuần ${week}) vừa được thêm vào hệ thống`);
  toast('✅ Đã thêm hồ sơ thai phụ!');
  ['p-name', 'p-phone', 'p-week', 'p-due'].forEach(id => { document.getElementById(id).value = ''; });
}

function viewPatient(id) {
  const p = patients.find(x => x.id === id);
  if (!p) return;
  toast(`👁 Xem hồ sơ: ${p.name}`);
}

function callPatient(name, phone) {
  toast(`📞 Đang gọi ${name} — ${phone}`);
  addNotification(`📞 Đã gọi điện cho ${name} lúc ${new Date().toLocaleTimeString('vi-VN')}`);
}

function exportCSV() {
  const rows = [['Họ tên', 'SĐT', 'Tuần thai', 'Dự sinh', 'Địa chỉ', 'Dân tộc', 'Khám cuối', 'Tình trạng']];
  patients.forEach(p => rows.push([p.name, p.phone, p.week, p.due, p.district, p.ethnic, p.lastVisit, p.status]));
  const csv  = rows.map(r => r.map(c => `"${c}"`).join(',')).join('\n');
  const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href = url; a.download = 'sen-hong-thai-phu.csv'; a.click();
  URL.revokeObjectURL(url);
  toast('📥 Đã xuất CSV!');
}

function dismissAlert(btn) {
  btn.closest('[class*="bg-danger-bg"], [class*="bg-warn-bg"]').style.display = 'none';
  toast('✅ Đã bỏ qua cảnh báo');
}

function sendReminder2(name) {
  toast(`📩 Đã gửi nhắc nhở lần 3 cho ${name}`);
  addNotification(`📩 Gửi nhắc khám lần 3 cho ${name}`);
}
