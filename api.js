/**
 * api.js — Sen Hồng AI Backend
 * Toàn bộ giao tiếp với Claude API nằm ở file này.
 *
 * 🌐 Endpoint: https://api.anthropic.com/v1/messages
 * 🔑 API Key: Trong môi trường Claude.ai sandbox, key được xử lý tự động.
 *             Khi host ra ngoài, đổi API_BASE thành URL backend proxy của bạn
 *             và thêm header Authorization tại proxy (KHÔNG để key ở frontend).
 *
 * Ví dụ proxy (Node/Express):
 *   app.post('/api/chat', (req, res) => {
 *     fetch('https://api.anthropic.com/v1/messages', {
 *       headers: { 'x-api-key': process.env.ANTHROPIC_API_KEY, ... },
 *       body: JSON.stringify(req.body)
 *     }).then(r => r.json()).then(d => res.json(d))
 *   })
 *   → Đổi API_BASE = '/api/chat'
 */

const API_BASE = 'https://api.anthropic.com/v1/messages';
const API_MODEL = 'claude-sonnet-4-20250514';
const API_MAX_TOKENS = 1000;

/**
 * Hàm gọi API cơ bản
 * @param {Array} messages - mảng { role, content }
 * @param {string} systemPrompt - system prompt
 * @param {number} maxTokens
 * @returns {Promise<string>} - text response
 */
async function callClaude(messages, systemPrompt = '', maxTokens = API_MAX_TOKENS) {
  const body = {
    model: API_MODEL,
    max_tokens: maxTokens,
    messages,
  };
  if (systemPrompt) body.system = systemPrompt;

  const res = await fetch(API_BASE, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (!res.ok) throw new Error(`API error: ${res.status}`);
  const data = await res.json();
  return data.content?.[0]?.text || '';
}

// ─── Các hàm AI cụ thể ───────────────────────────────────────────

/**
 * Trả lời cảm xúc mẹ bầu
 * @param {string} emotion - cảm xúc đã chọn
 * @param {number} week - tuần thai
 */
async function aiEmotionAdvice(emotion, week = 12) {
  return callClaude([
    {
      role: 'user',
      content: `Mẹ bầu tuần ${week} vừa ghi nhận cảm xúc: "${emotion}". Hãy viết 2-3 câu lời khuyên ngắn gọn, ấm áp bằng tiếng Việt. Không cần tiêu đề.`,
    },
  ], '', 200);
}

/**
 * Tạo thực đơn theo tuần thai
 * @param {number} week
 */
async function aiMealPlan(week = 28) {
  return callClaude([
    {
      role: 'user',
      content: `Tạo thực đơn 3 ngày cho mẹ bầu tuần ${week} tại Việt Nam. Mỗi ngày gồm: sáng, trưa, tối, bữa phụ. Ưu tiên Omega-3, sắt, canxi. Định dạng đơn giản, không markdown.`,
    },
  ], '', 600);
}

/**
 * Tạo kế hoạch sinh
 * @param {string} hospital - tên bệnh viện
 * @param {number} week - tuần thai hiện tại
 */
async function aiBirthPlan(hospital = 'BV Đồng Nai', week = 28) {
  return callClaude([
    {
      role: 'user',
      content: `Tạo kế hoạch sinh cho mẹ bầu tuần ${week} tại ${hospital}. Bao gồm: chuẩn bị trước sinh, danh sách đồ cần mang, lưu ý quan trọng. Viết tiếng Việt, dễ hiểu, không markdown.`,
    },
  ], '', 500);
}

/**
 * Mô tả phát triển thai nhi theo tuần
 * @param {number} week
 */
async function aiWeekDetail(week = 12) {
  return callClaude([
    {
      role: 'user',
      content: `Mô tả sự phát triển của thai nhi tuần ${week} và những thay đổi của mẹ bầu. Viết bằng tiếng Việt, ấm áp, dễ hiểu, khoảng 200 từ. Không dùng markdown.`,
    },
  ], '', 400);
}

/**
 * Chat đa lượt — trợ lý AI Sen Hồng
 * @param {Array} history - lịch sử hội thoại [{ role, content }]
 * @param {string} userMessage - tin nhắn mới của user
 */
async function aiChat(history, userMessage) {
  const messages = [...history, { role: 'user', content: userMessage }];
  return callClaude(
    messages,
    'Bạn là trợ lý AI của ứng dụng Sen Hồng — chuyên về chăm sóc sức khỏe mẹ bầu và thai nhi tại Việt Nam. Trả lời bằng tiếng Việt, ngắn gọn, ấm áp, dễ hiểu. Không dùng markdown nhiều. Ưu tiên tư vấn thực tế.',
    400
  );
}
