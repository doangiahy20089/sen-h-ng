# Sen Hong - Maternal Healthcare Platform

A mobile-first Progressive Web App (PWA) for maternal healthcare management in rural Vietnam. Sen Hong connects expecting mothers with village midwives (Co Do) through health tracking, QR-based identification, danger alerts, and mental health support.

## Overview

Sen Hong targets ethnic minority communities in Ha Giang province, Vietnam, where access to maternal healthcare is limited. The platform provides:

- **For Mothers (Thai Phu):** Track vitals (blood pressure, weight, fetal movement), follow weekly checklists, access mental health resources, and share a personal QR code with their midwife.
- **For Village Midwives (Co Do):** Monitor assigned mothers, scan QR codes for quick access, receive danger alerts, and export reports.
- **For Health Facilities:** Hierarchical oversight across 6 roles from village to provincial level.

## Tech Stack

| Layer    | Technology                                  |
| -------- | ------------------------------------------- |
| Frontend | React 19 + TypeScript                       |
| Build    | Vite 8                                      |
| Styling  | Tailwind CSS v4                             |
| Backend  | Firebase (Auth, Firestore, Cloud Functions) |
| Auth     | Firebase Phone OTP (Vietnam region)         |
| PWA      | vite-plugin-pwa + Workbox                   |
| QR       | qrcode.react + html5-qrcode                 |
| Font     | Be Vietnam Pro                              |
| Icons    | Material Symbols Outlined                   |

## Architecture

```
momcare-mvp/
├── src/
│   ├── components/     # Shared UI (AppHeader, MobileNav, Modal, Toast, StatCard, QRScanner)
│   ├── context/        # AuthContext (Firebase user + role state)
│   ├── data/           # Static data (checklist, mental health advice)
│   ├── hooks/          # useAuth (phone OTP flow)
│   ├── lib/            # Firebase config, constants, offline queue
│   ├── pages/
│   │   ├── thai-phu/   # Mother views (Dashboard, Vitals, Checklist, QR, Mental Health)
│   │   └── co-do/      # Midwife views (Dashboard, Patient Detail, QR Scan, Alerts)
│   └── App.tsx         # Router + role-based route guards
├── functions/          # Firebase Cloud Functions (CSV export, data aggregation, audit log)
├── firestore.rules     # Security rules (role-based access)
└── firestore.indexes.json
```

## Roles

| Role       | Vietnamese     | Access                                                         |
| ---------- | -------------- | -------------------------------------------------------------- |
| THAI_PHU   | Thai phu       | Personal dashboard, vitals entry, checklist, QR, mental health |
| CO_DO      | Co do thon ban | Assigned mothers, QR scan, danger alerts                       |
| TRAM_Y_TE  | Tram y te xa   | Commune health station oversight                               |
| TTYT_HUYEN | TTYT huyen     | District health center aggregation                             |
| SO_Y_TE    | So Y te        | Provincial health department                                   |
| ADMIN      | Quan tri       | System administration                                          |

## Getting Started

See [momcare-mvp/README.md](./momcare-mvp/README.md) for detailed setup instructions.

```bash
cd momcare-mvp
npm install
npm run dev
```

## Key Features

- **Offline-first:** Vitals and checklist data queue locally when offline, sync when connection returns.
- **Consent gate:** Mothers must explicitly consent before any data collection.
- **QR identification:** Each mother has a unique QR code; midwives scan to access records instantly.
- **Danger alerts:** Abnormal vitals trigger color-coded alerts (critical/warning) for midwives.
- **Mental health support:** Scripted emotional wellness advice + psychologist hotline (human-in-loop).
- **PWA installable:** Add to home screen for app-like experience on low-end Android devices.

## Design System

The UI follows the "Sen Hong" (Pink Lotus) design language:

- Primary: `#c2185b` (rose pink)
- Accent: `#2e7d32` (healthy green)
- Warning: `#e65100` / Danger: `#c62828`
- Surface: `#faf8f5` (warm off-white)
- Rounded cards (2xl/3xl radius), gradient heroes, soft shadows

## License

Private project. All rights reserved.
