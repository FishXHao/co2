import api from './api'

// ⚠ ASSUMPTION/MOCK: There is NO services API defined in swagger.json.
// The following data and functions are mock/assumption implementations used to
// build out the UI. When a real endpoint exists, set VITE_MOCK_MODE=false and
// implement the real calls in the marked branches below.
const MOCK_SERVICES = [
  {
    id: '1',
    name: '碳捕獲申辦服務',
    description: '提供企業碳捕獲技術申辦協助，協助評估、申請與導入碳捕獲設備。',
    category: '申辦服務',
    steps: 3,
    details:
      '本服務協助企業完成碳捕獲技術的評估、申請與導入。專業團隊將依照您的產業特性提供客製化建議，並協助處理相關法規文件。',
    stepList: [
      { title: '需求評估', description: '填寫企業基本資料與碳排放概況。' },
      { title: '方案規劃', description: '專員依評估結果提供客製化碳捕獲方案。' },
      { title: '申辦送出', description: '確認方案並送出正式申辦文件。' }
    ]
  },
  {
    id: '2',
    name: '碳排放查詢服務',
    description: '查詢企業碳排放紀錄，掌握歷年排放趨勢與減量成效。',
    category: '查詢服務',
    steps: 2,
    details:
      '透過本服務可查詢企業歷年碳排放紀錄，並以圖表方式呈現排放趨勢，協助企業掌握減碳成效。',
    stepList: [
      { title: '身分驗證', description: '登入並驗證企業身分。' },
      { title: '查詢結果', description: '檢視碳排放紀錄與趨勢分析。' }
    ]
  }
]

// ⚠ MOCK: simulate network latency.
function delay(ms = 400) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

const MOCK_MODE = import.meta.env.VITE_MOCK_MODE !== 'false'

export const servicesService = {
  // ⚠ ASSUMPTION/MOCK: GET /api/services is not in swagger.
  async list() {
    if (MOCK_MODE) {
      await delay()
      return [...MOCK_SERVICES]
    }
    const { data } = await api.get('/services')
    return data?.services ?? data
  },

  // ⚠ ASSUMPTION/MOCK: GET /api/services/:id is not in swagger.
  async getById(id) {
    if (MOCK_MODE) {
      await delay()
      return MOCK_SERVICES.find((s) => s.id === String(id)) ?? null
    }
    const { data } = await api.get(`/services/${id}`)
    return data?.service ?? data
  }
}

export default servicesService
