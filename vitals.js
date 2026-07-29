/**
 * vitals.js — Quản lý chỉ số sức khỏe
 */

const VITAL_LABELS = { bp: 'Huyết áp', glucose: 'Đường huyết', weight: 'Cân nặng', sleep: 'Giấc ngủ', fetal: 'Cử động thai' };
const VITAL_UNITS  = { bp: 'mmHg', glucose: 'mg/dL', weight: 'kg', sleep: 'giờ', fetal: 'lần/giờ' };

function openAddVital() { openModal('modal-add-vital'); }

function saveVital() {
  const type  = document.getElementById('vital-type').value;
  const value = document.getElementById('vital-value').value.trim();
  const note  = document.getElementById('vital-note').value.trim();
  if (!value) { toast('⚠️ Vui lòng nhập giá trị'); return; }

  vitals.push({ type, label: VITAL_LABELS[type], value, unit: VITAL_UNITS[type], note, time: new Date().toLocaleString('vi-VN') });
  saveVitals();

  // Cập nhật stat cards
  if (type === 'bp')    document.getElementById('stat-bp').textContent    = value;
  if (type === 'sleep') document.getElementById('stat-sleep').textContent  = value + ' giờ';
  if (type === 'fetal') document.getElementById('stat-fetal-sub').textContent = value + ' lần/giờ';

  // Thêm row vào danh sách
  const list = document.getElementById('vitals-list');
  const isHigh = parseFloat(value) > 120;
  const badge  = isHigh
    ? '<span class="text-sm font-bold px-3 py-1 bg-danger-bg text-danger rounded-full">Cao</span>'
    : '<span class="text-sm font-bold px-3 py-1 bg-accent-bg text-accent rounded-full">Tốt</span>';
  const dot = (type === 'sleep' || type === 'glucose') ? 'bg-amber-500' : 'bg-accent';
  const row = document.createElement('div');
  row.className = 'flex items-center justify-between p-4 bg-surface rounded-xl';
  row.innerHTML = `
    <div class="flex items-center gap-3">
      <div class="w-3 h-3 rounded-full ${dot}"></div>
      <div>
        <p class="font-bold text-base">${VITAL_LABELS[type]}: ${value} ${VITAL_UNITS[type]}</p>
        <p class="text-sm text-muted">${new Date().toLocaleString('vi-VN')}</p>
      </div>
    </div>${badge}`;
  list.prepend(row);

  closeModal('modal-add-vital');
  toast('✅ Đã lưu chỉ số sức khỏe!');
  addNotification(`📊 Chỉ số mới: ${VITAL_LABELS[type]} ${value} ${VITAL_UNITS[type]}`);
  document.getElementById('vital-value').value = '';
  document.getElementById('vital-note').value  = '';
}
