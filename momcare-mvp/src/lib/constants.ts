/**
 * Hang so ung dung MOMCARE
 * KHONG duoc hardcode gia tri nay o noi khac
 */

// So dien thoai khan cap - Hien thi ngay khi phat hien tu khoa nguy hiem
export const SO_HOTLINE_KHAN_CAP = "1900-9095";

// Ten ung dung
export const TEN_UNG_DUNG = "Sen Hồng";

// Cac vai tro trong he thong
export const VAI_TRO = {
  THAI_PHU: "pregnant_woman",
  CO_DO: "midwife",
  TRAM_Y_TE: "commune_health",
  TTYT_HUYEN: "district_health",
  SO_Y_TE: "provincial_health",
  ADMIN: "admin",
} as const;

export type VaiTro = (typeof VAI_TRO)[keyof typeof VAI_TRO];

// Hien thi vai tro
export const VAI_TRO_LABEL: Record<VaiTro, string> = {
  [VAI_TRO.THAI_PHU]: "Thai phụ (Mẹ bầu)",
  [VAI_TRO.CO_DO]: "Cô đỡ thôn bản",
  [VAI_TRO.TRAM_Y_TE]: "Nhân viên Trạm Y tế xã",
  [VAI_TRO.TTYT_HUYEN]: "Quản lý TTYT Huyện",
  [VAI_TRO.SO_Y_TE]: "Quản lý Sở Y tế Tỉnh",
  [VAI_TRO.ADMIN]: "Quản trị hệ thống",
};

export const VAI_TRO_ICON: Record<VaiTro, string> = {
  [VAI_TRO.THAI_PHU]: "pregnant_woman",
  [VAI_TRO.CO_DO]: "vaccines",
  [VAI_TRO.TRAM_Y_TE]: "local_hospital",
  [VAI_TRO.TTYT_HUYEN]: "medical_services",
  [VAI_TRO.SO_Y_TE]: "health_and_safety",
  [VAI_TRO.ADMIN]: "admin_panel_settings",
};

// Ten collections trong Firestore
export const COLLECTIONS = {
  HO_SO_THAI_KY: "HO_SO_THAI_KY",
  CHI_SO_SUC_KHOE: "CHI_SO_SUC_KHOE",
  CHATBOT_LOGS: "CHATBOT_LOGS",
  AUDIT_LOG: "AUDIT_LOG",
  BAO_CAO_TONG_HOP: "BAO_CAO_TONG_HOP",
} as const;

// Muc do canh bao
export const MUC_DO_CANH_BAO = {
  THAP: "thap",
  TRUNG_BINH: "trung_binh",
  CAO: "cao",
} as const;

export type MucDoCanhBao =
  (typeof MUC_DO_CANH_BAO)[keyof typeof MUC_DO_CANH_BAO];

// Huyen thi diem
export const HUYEN_THI_DIEM = "Định Quán";
export const TINH_THI_DIEM = "Đồng Nai";

// Dan toc muc tieu chinh
export const DAN_TOC_MUC_TIEU = "Tày";

// Danh sach dan toc (Tày la muc tieu chinh)
export const DANH_SACH_DAN_TOC = [
  "Tày",
  "Chơ Ro",
  "Mạ",
  "Kinh",
  "Khác",
] as const;

// 1 thi tran + 13 xa thuoc Huyen Dinh Quan
export const THI_TRAN = "Thị trấn Định Quán";

export const DANH_SACH_XA = [
  "Gia Canh",
  "La Ngà",
  "Ngọc Định",
  "Phú Cường",
  "Phú Hòa",
  "Phú Lợi",
  "Phú Ngọc",
  "Phú Tân",
  "Phú Túc",
  "Phú Vinh",
  "Suối Nho",
  "Thanh Sơn",
  "Túc Trung",
] as const;

export type XaPhuong = (typeof DANH_SACH_XA)[number] | typeof THI_TRAN;
