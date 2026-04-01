// src/stores/user.js
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import axios from 'axios'

export const useUserStore = defineStore('user', () => {
  const token = ref(localStorage.getItem('token') || '')
  const user = ref(null)
  const role = ref('')

  const isLoggedIn = computed(() => !!token.value)

  const login = async (username, password) => {
    try {
      const res = await axios.post('/api/auth/login', {
        username,
        password
      })
      token.value = res.data.token
      user.value = res.data.user
      role.value = res.data.role
      localStorage.setItem('token', token.value)
      return true
    } catch (err) {
      throw new Error(err.response?.data?.message || '登录失败')
    }
  }

  const logout = () => {
    token.value = ''
    user.value = null
    role.value = ''
    localStorage.removeItem('token')
    // 可选：调用后端登出接口
    // await axios.post('/api/auth/logout')
  }

  return {
    token,
    user,
    role,
    isLoggedIn,
    login,
    logout
  }
})