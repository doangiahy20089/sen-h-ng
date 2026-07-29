export interface CamXuc {
  id: string;
  ten: string;
  icon: string;
  loiKhuyen: string[];
}

export const DANH_SACH_CAM_XUC: CamXuc[] = [
  {
    id: "vui_ve",
    ten: "Vui vẻ",
    icon: "sentiment_very_satisfied",
    loiKhuyen: [
      "Tuyệt vời! Tâm trạng tốt giúp bé phát triển khỏe mạnh hơn. Hãy duy trì bằng cách nghe nhạc nhẹ và đi bộ mỗi sáng.",
      "Mẹ vui là bé vui! Hãy ghi lại khoảnh khắc này vào nhật ký thai kỳ để nhớ mãi.",
      "Năng lượng tích cực của mẹ đang truyền đến bé. Hãy chia sẻ niềm vui với người thân nhé!",
    ],
  },
  {
    id: "met_moi",
    ten: "Mệt mỏi",
    icon: "sentiment_neutral",
    loiKhuyen: [
      "Mệt mỏi khi mang thai là hoàn toàn bình thường. Hãy nghỉ ngơi khi có thể, đừng ép bản thân quá sức.",
      "Thử nằm nghiêng trái, kê gối giữa hai chân để ngủ ngon hơn. Mẹ xứng đáng được nghỉ ngơi!",
      "Uống đủ nước và ăn nhẹ mỗi 2-3 giờ sẽ giúp mẹ bớt mệt. Nếu mệt kéo dài, hãy liên hệ cô đỡ.",
    ],
  },
  {
    id: "nhay_cam",
    ten: "Nhạy cảm",
    icon: "sentiment_sad",
    loiKhuyen: [
      "Hormone thay đổi khiến mẹ dễ xúc động. Điều này hoàn toàn bình thường và sẽ qua đi.",
      "Hãy cho phép bản thân khóc nếu cần. Chia sẻ cảm xúc với người thân sẽ giúp mẹ nhẹ lòng hơn.",
      "Nếu cảm thấy buồn kéo dài hơn 2 tuần, đừng ngần ngại gọi cho chuyên gia tâm lý. Mẹ không đơn độc!",
    ],
  },
  {
    id: "hao_huc",
    ten: "Háo hức",
    icon: "sentiment_excited",
    loiKhuyen: [
      "Sự háo hức của mẹ là món quà tuyệt vời cho bé! Hãy chuẩn bị đồ đón bé dần dần nhé.",
      "Năng lượng tích cực này rất tốt! Thử viết thư cho bé tương lai, bé sẽ cảm nhận được tình yêu.",
      "Hãy biến sự háo hức thành hành động: học lớp tiền sản, chuẩn bị phòng cho bé!",
    ],
  },
];

export interface BaiTapThuGian {
  id: string;
  ten: string;
  icon: string;
  moTa: string;
  buoc: string[];
}

export const BAI_TAP_THU_GIAN: BaiTapThuGian[] = [
  {
    id: "breathing",
    ten: "Thở 4-7-8",
    icon: "air",
    moTa: "Giảm lo âu, giúp ngủ ngon",
    buoc: [
      "Hít vào bằng mũi trong 4 giây",
      "Giữ hơi thở trong 7 giây",
      "Thở ra từ từ bằng miệng trong 8 giây",
      "Lặp lại 4 lần",
    ],
  },
  {
    id: "body_scan",
    ten: "Quét cơ thể",
    icon: "self_improvement",
    moTa: "Thả lỏng toàn thân, giảm căng cơ",
    buoc: [
      "Nhắm mắt, nằm thoải mái",
      "Tập trung vào đỉnh đầu, thả lỏng dần",
      "Di chuyển chú ý xuống vai, tay, bụng",
      "Tiếp tục xuống chân, thả lỏng hoàn toàn",
    ],
  },
  {
    id: "gratitude",
    ten: "Lòng biết ơn",
    icon: "volunteer_activism",
    moTa: "Tăng cảm xúc tích cực mỗi ngày",
    buoc: [
      "Nghĩ về 3 điều khiến mẹ biết ơn hôm nay",
      "Có thể là: sức khỏe, gia đình, bữa ăn ngon",
      "Viết ra hoặc nói thành lời",
      "Cảm nhận sự ấm áp lan tỏa trong lòng",
    ],
  },
];

export const HOTLINE_TAM_LY = "1900-9095";
export const GIO_LAM_VIEC = "Thứ 2 - Thứ 7, 7:30 - 17:00";
