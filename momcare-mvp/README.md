# Sen Hong MVP (momcare-mvp)

The production frontend for Sen Hong — a maternal healthcare PWA built with React, Firebase, and Tailwind CSS.

## Prerequisites

- Node.js 20+
- npm 10+
- A Firebase project with Phone Authentication enabled (Vietnam region)

## Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment

Create a `.env` file in this directory:

```env
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abcdef
```

### 3. Run development server

```bash
npm run dev
```

Open the printed URL (default `http://localhost:5173`).

### 4. Build for production

```bash
npm run build
```

Output goes to `dist/`.

### 5. Deploy Firestore rules

```bash
firebase deploy --only firestore:rules
```

## Scripts

| Command           | Description                      |
| ----------------- | -------------------------------- |
| `npm run dev`     | Start Vite dev server with HMR   |
| `npm run build`   | Type-check + production build    |
| `npm run preview` | Preview production build locally |
| `npm run lint`    | Run Oxlint                       |

## Project Structure

```
src/
├── components/
│   ├── AppHeader.tsx       # Sticky top header (logo, notifications, profile)
│   ├── BaoVeRoute.tsx      # Role-based route guard
│   ├── ChiBaoOffline.tsx   # Offline status banner
│   ├── CongDongY.tsx       # Consent gate wrapper
│   ├── MobileNav.tsx       # Fixed bottom navigation (mobile)
│   ├── Modal.tsx           # Reusable modal overlay
│   ├── QRScanner.tsx       # html5-qrcode camera scanner
│   ├── StatCard.tsx        # Metric display card
│   └── Toast.tsx           # Toast notification (context-based)
├── context/
│   └── AuthContext.tsx     # Firebase auth state + role provider
├── data/
│   ├── checklist.ts        # Weekly pregnancy task data
│   └── loiKhuyenTinhThan.ts # Mental health scripted advice
├── hooks/
│   └── useAuth.ts          # Phone OTP authentication hook
├── lib/
│   ├── auth.ts             # Firebase Auth helpers
│   ├── constants.ts        # App constants, roles, collections
│   ├── firebase.ts         # Firebase app initialization
│   └── offlineQueue.ts     # IndexedDB offline sync queue
├── pages/
│   ├── DangNhapPage.tsx    # Login (phone + OTP)
│   ├── ChonVaiTroPage.tsx  # Role selection
│   ├── thai-phu/           # Mother pages
│   │   ├── BangDieuKhien.tsx      # Dashboard (hero, stats, actions)
│   │   ├── NhapChiSo.tsx          # Vitals entry form
│   │   ├── DanhSachKiem.tsx       # Weekly checklist
│   │   ├── MaQR.tsx               # Personal QR code
│   │   └── SucKhoeTinhThan.tsx    # Mental health support
│   └── co-do/              # Midwife pages
│       ├── BangDieuKhienCoDo.tsx  # Patient management table
│       ├── ChiTietHo.tsx          # Patient detail + vitals history
│       ├── QuetQR.tsx             # QR scanner
│       └── CanhBaoNguyHiem.tsx    # Danger alerts
├── App.tsx                 # Router configuration
├── main.tsx                # Entry point
└── index.css               # Tailwind v4 theme + utilities
```

## Firebase Cloud Functions

Located in `functions/`:

| Function        | Trigger         | Purpose                           |
| --------------- | --------------- | --------------------------------- |
| `datVaiTro`     | HTTPS callable  | Assign role to user               |
| `ghiAuditLog`   | Firestore write | Audit trail for data changes      |
| `tongHopDuLieu` | Scheduled       | Aggregate district/province stats |
| `xuatCsv`       | HTTPS callable  | Export patient data as CSV        |

## Firestore Collections

- `users` — User profiles (phone, role, commune)
- `ho_so_thai_ky` — Pregnancy records (consent, midwife assignment)
- `chi_so_suc_khoe` — Vitals (BP, weight, week, timestamp)
- `canh_bao` — Danger alerts (type, severity, status)
- `audit_logs` — System audit trail

## Design Tokens

Defined in `src/index.css` via Tailwind v4 `@theme`:

```
primary:       #c2185b
primary-light: #e91e7a
primary-soft:  #fce4ec
accent:        #2e7d32
warn:          #e65100
danger:        #c62828
surface:       #faf8f5
font:          Be Vietnam Pro
icons:         Material Symbols Outlined
```
