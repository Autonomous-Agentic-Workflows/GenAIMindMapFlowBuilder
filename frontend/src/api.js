import axios from 'axios'

const API_BASE = 'http://localhost:8000'

const api = axios.create({
  baseURL: API_BASE,
  timeout: 10000,
})

export const flowsAPI = {
  list: () => api.get('/flows'),
  get: (id) => api.get(`/flows/${id}`),
  create: (data) => api.post('/flows', data),
  update: (id, data) => api.put(`/flows/${id}`, data),
  delete: (id) => api.delete(`/flows/${id}`),
  getNodes: (id) => api.get(`/flows/${id}/nodes`),
}

export const qaAPI = {
  ask: (question) => api.post('/qa/ask', { question }),
  chat: (messages, context) => api.post('/qa/chat', { messages, context }),
  conversations: () => api.get('/qa/conversations'),
  getConversation: (id) => api.get(`/qa/conversations/${id}`),
}

export const ingestionAPI = {
  upload: (file) => {
    const formData = new FormData()
    formData.append('file', file)
    return api.post('/ingestion/upload', formData)
  },
  process: (documentId) => api.post(`/ingestion/process/${documentId}`),
  documents: () => api.get('/ingestion/documents'),
}

export const healthAPI = {
  check: () => api.get('/health'),
  root: () => api.get('/'),
}

export default api
