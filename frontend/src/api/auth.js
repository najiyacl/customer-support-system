import api from './axios'

export const authApi = {
  me: () => api.get('/auth/me').then(r => r.data),
  login: (username, password) => api.post('/auth/login', { username, password }).then(r => r.data),
  logout: () => api.post('/auth/logout'),
}
