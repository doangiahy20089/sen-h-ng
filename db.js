/**
 * db.js — Data Layer (localStorage)
 * Mọi đọc/ghi dữ liệu tập trung tại đây.
 */

const DB = {
  get(key, defaultVal) {
    try { return JSON.parse(localStorage.getItem('sh_' + key)) ?? defaultVal; } catch { return defaultVal; }
  },
  set(key, val) {
    try { localStorage.setItem('sh_' + key, JSON.stringify(val)); } catch {}
  },
};

// ─── Initial data ────────────────────────────────────────────────

let patients = DB.get('patients', [
  { id: 1, name: 'Lê Thị Phương',   phone: '0908 123 456', week: 24, due: '15/08', district: 'TP. Biên Hòa',   ethnic: 'Kinh',   lastVisit: 'Hôm qua',        status: 'normal' },
  { id: 2, name: "Ka H'Phượng",     phone: '0345 987 654', week: 12, due: '02/11', district: 'H. Trảng Bom',   ethnic: 'Chơ Ro', lastVisit: '10 ngày trước',  status: 'warn'   },
  { id: 3, name: 'Trần Tuyết Mai',  phone: '0977 444 555', week: 36, due: '20/05', district: 'H. Long Thành',  ethnic: 'Kinh',   lastVisit: '3 ngày trước',   status: 'soon'   },
  { id: 4, name: 'Nguyễn Hồng Hạnh',phone: '0912 333 444', week: 8,  due: '10/12', district: 'TP. Long Khánh', ethnic: 'Kinh',   lastVisit: '5 ngày trước',   status: 'normal' },
]);

let tasks = DB.get('tasks', [
  { id: 1, text: 'Uống Vitamin tổng hợp', note: 'Sáng sớm sau khi ăn', done: false },
  { id: 2, text: 'Đi bộ 20 phút',         note: 'Công viên gần nhà',   done: false },
  { id: 3, text: 'Uống 2L nước',           note: 'Đã hoàn thành',       done: true  },
]);

let notifications = DB.get('notifications', [
  { id: 1, text: 'Mẹ Lan cập nhật huyết áp mới: 115/75',       time: 'Vừa xong',    read: false },
  { id: 2, text: 'Nhắc nhở: Khám thai Thứ 7 này lúc 8:30',    time: '1 giờ trước', read: false },
  { id: 3, text: 'Bé đạt cột mốc phát triển tuần 28!',          time: 'Hôm qua',     read: true  },
]);

let diaryEntries = DB.get('diary', []);
let vitals       = DB.get('vitals', []);

// ─── Save helpers ─────────────────────────────────────────────────

function savePatients()      { DB.set('patients',      patients);      }
function saveTasks()         { DB.set('tasks',         tasks);         }
function saveNotifications() { DB.set('notifications', notifications); }
function saveDiary()         { DB.set('diary',         diaryEntries);  }
function saveVitals()        { DB.set('vitals',        vitals);        }
