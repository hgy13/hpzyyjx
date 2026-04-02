// src/stores/user.js
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { login as mockLogin, logout as mockLogout } from '@/api/mock'
import router from '@/router'

export const useUserStore = defineStore('user', () => {
  // 状态
  const token = ref(localStorage.getItem('token') || '')
  const userInfo = ref(JSON.parse(localStorage.getItem('userInfo') || '{}'))
  const permissions = ref(JSON.parse(localStorage.getItem('permissions') || '[]'))
  
  // Getter
  const isLoggedIn = computed(() => !!token.value)
  const userRole = computed(() => userInfo.value.role || '')
  const userName = computed(() => userInfo.value.username || '')
  const department = computed(() => userInfo.value.department || '')
  const displayName = computed(() => userInfo.value.name || '')
  
  // 根据角色获取首页路由
  const getHomeRouteByRole = (role) => {
    const roleRoutes = {
      'admin': '/admin/dashboard',
      'finance': '/finance/performance',
      'department_head': '/department/approval',
      'nurse_head': '/department/approval',
      'staff': '/staff/dashboard'
    }
    return roleRoutes[role] || '/dashboard'
  }
  
  // 登录
  const login = async (username, password) => {
    try {
      const response = await mockLogin(username, password)
      
      if (response.code === 200) {
        // 存储token
        token.value = response.data.token
        localStorage.setItem('token', response.data.token)
        
        // 存储用户信息
        userInfo.value = {
          id: response.data.userId,
          username: response.data.username,
          name: response.data.name,
          role: response.data.role,
          department: response.data.department
        }
        localStorage.setItem('userInfo', JSON.stringify(userInfo.value))
        
        // 存储权限列表
        permissions.value = response.data.permissions || []
        localStorage.setItem('permissions', JSON.stringify(permissions.value))
        
        // 跳转到首页
        const homeRoute = getHomeRouteByRole(response.data.role)
        router.push(homeRoute)
        
        return { success: true, message: '登录成功' }
      } else {
        return { 
          success: false, 
          message: response.message || '登录失败',
          code: response.code 
        }
      }
    } catch (error) {
      console.error('登录错误:', error)
      return { 
        success: false, 
        message: error.message || '网络错误，请检查服务器连接',
        code: 500
      }
    }
  }
  
  // 登出
  const logout = async () => {
    try {
      await mockLogout()
    } catch (error) {
      console.warn('登出API调用失败:', error)
    } finally {
      clearUserData()
      router.push('/login')
    }
  }
  
  // 清除用户数据
  const clearUserData = () => {
    token.value = ''
    userInfo.value = {}
    permissions.value = []
    localStorage.removeItem('token')
    localStorage.removeItem('userInfo')
    localStorage.removeItem('permissions')
  }
  
  // 更新用户信息
  const updateUserProfile = async (profileData) => {
    userInfo.value = { ...userInfo.value, ...profileData }
    localStorage.setItem('userInfo', JSON.stringify(userInfo.value))
    return { success: true, message: '更新成功' }
  }
  
  // 修改密码
  const changePassword = async (oldPassword, newPassword) => {
    console.log('修改密码请求:', { oldPassword, newPassword })
    return { success: true, message: '密码修改成功' }
  }
  
  return {
    // 状态
    token,
    userInfo,
    permissions,
    
    // Getter
    isLoggedIn,
    userRole,
    userName,
    department,
    displayName,
    
    // Actions
    login,
    logout,
    clearUserData,
    updateUserProfile,
    changePassword
  }
})