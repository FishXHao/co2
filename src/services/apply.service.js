import api from './api'

// ⚠ ASSUMPTION/MOCK: There is NO apply API defined in swagger.json.
// POST /api/apply and GET /api/apply/:serviceId/result are mock/assumption
// implementations to support the application flow UI.
function delay(ms = 500) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

const MOCK_MODE = import.meta.env.VITE_MOCK_MODE !== 'false'

function makeReference() {
  return 'CO2-' + Date.now().toString(36).toUpperCase()
}

export const applyService = {
  // ⚠ ASSUMPTION/MOCK: POST /api/apply is not in swagger.
  async submit(serviceId, payload) {
    if (MOCK_MODE) {
      await delay()
      return {
        success: true,
        serviceId: String(serviceId),
        reference: makeReference(),
        status: 'received',
        submittedAt: new Date().toISOString(),
        applicant: payload
      }
    }
    const { data } = await api.post('/apply', { serviceId, ...payload })
    return data
  },

  // ⚠ ASSUMPTION/MOCK: GET /api/apply/:serviceId/result is not in swagger.
  async getResult(serviceId) {
    if (MOCK_MODE) {
      await delay()
      return {
        serviceId: String(serviceId),
        status: 'processing',
        message: '您的申辦已受理，正在處理中。'
      }
    }
    const { data } = await api.get(`/apply/${serviceId}/result`)
    return data
  }
}

export default applyService
