/**
 * Du lieu checklist thai ky theo tam ca nguyet
 * Nguon: Huong dan cham soc thai ky - Bo Y Te Viet Nam
 */

export interface ChecklistItem {
  id: string;
  noiDung: string;
  hoanThanh: boolean;
}

export interface TamCaNguyet {
  ten: string;
  tuanTu: string;
  items: ChecklistItem[];
}

export const CHECKLIST_THAI_KY: TamCaNguyet[] = [
  {
    ten: "Tam cá nguyệt 1",
    tuanTu: "Tuần 1 - 13",
    items: [
      {
        id: "t1_1",
        noiDung: "Xác nhận mang thai tại cơ sở y tế",
        hoanThanh: false,
      },
      {
        id: "t1_2",
        noiDung: "Khám thai lần đầu (trước tuần 8)",
        hoanThanh: false,
      },
      { id: "t1_3", noiDung: "Siêu âm xác định tuổi thai", hoanThanh: false },
      { id: "t1_4", noiDung: "Xét nghiệm máu tổng quát", hoanThanh: false },
      { id: "t1_5", noiDung: "Bổ sung axit folic hàng ngày", hoanThanh: false },
      { id: "t1_6", noiDung: "Tiêm phòng uốn ván mũi 1", hoanThanh: false },
      {
        id: "t1_7",
        noiDung: "Đăng ký quản lý thai tại trạm y tế",
        hoanThanh: false,
      },
    ],
  },
  {
    ten: "Tam cá nguyệt 2",
    tuanTu: "Tuần 14 - 26",
    items: [
      {
        id: "t2_1",
        noiDung: "Khám thai định kỳ (mỗi 4 tuần)",
        hoanThanh: false,
      },
      {
        id: "t2_2",
        noiDung: "Siêu âm hình thái học (tuần 20-22)",
        hoanThanh: false,
      },
      {
        id: "t2_3",
        noiDung: "Xét nghiệm dung nạp đường (tuần 24-28)",
        hoanThanh: false,
      },
      { id: "t2_4", noiDung: "Tiêm phòng uốn ván mũi 2", hoanThanh: false },
      {
        id: "t2_5",
        noiDung: "Bổ sung sắt và canxi hàng ngày",
        hoanThanh: false,
      },
      { id: "t2_6", noiDung: "Theo dõi cân nặng hàng tuần", hoanThanh: false },
      { id: "t2_7", noiDung: "Đo huyết áp mỗi lần khám", hoanThanh: false },
      {
        id: "t2_8",
        noiDung: "Bắt đầu đếm cử động thai (từ tuần 20)",
        hoanThanh: false,
      },
    ],
  },
  {
    ten: "Tam cá nguyệt 3",
    tuanTu: "Tuần 27 - 40",
    items: [
      {
        id: "t3_1",
        noiDung: "Khám thai mỗi 2 tuần (tuần 28-36)",
        hoanThanh: false,
      },
      {
        id: "t3_2",
        noiDung: "Khám thai mỗi tuần (từ tuần 36)",
        hoanThanh: false,
      },
      {
        id: "t3_3",
        noiDung: "Siêu âm đánh giá ngôi thai (tuần 32-34)",
        hoanThanh: false,
      },
      {
        id: "t3_4",
        noiDung: "Xét nghiệm liên cầu khuẩn nhóm B (tuần 35-37)",
        hoanThanh: false,
      },
      { id: "t3_5", noiDung: "Chuẩn bị đồ đi sinh", hoanThanh: false },
      {
        id: "t3_6",
        noiDung: "Xác định nơi sinh và phương tiện di chuyển",
        hoanThanh: false,
      },
      { id: "t3_7", noiDung: "Nhận biết dấu hiệu chuyển dạ", hoanThanh: false },
      {
        id: "t3_8",
        noiDung: "Nhận biết dấu hiệu nguy hiểm cần cấp cứu",
        hoanThanh: false,
      },
    ],
  },
];
