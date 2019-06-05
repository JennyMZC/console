import { api } from '@/setup/api'
import cookie from 'vue-cookie'

export default {
  namespaced: true,
  state: {
    accessToken: null
  },
  mutations: {
    login (state, { accessToken }) {
      state.accessToken = accessToken
    },
    logout (state) {
      state.accessToken = null
    }
  },
  getters: {
    isAuthenticated: state => !!state.accessToken
  },
  actions: {
    async login ({ commit }, { username, password }) {
      const res = await api.post('/auth/login', {
        user_name: username,
        password: password
      })
      cookie.set('accessToken', res.data.token, { expires: '30m' })
      api.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`
      commit('login', { accessToken: res.data.token })
    },
    async logout ({ commit }) {
      await api.post('/auth/logout')
      cookie.delete('accessToken')
      api.defaults.headers.common['Authorization'] = undefined
      commit('logout')
    }
  }
}