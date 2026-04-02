// src/router/auth.js
import { useUserStore } from '@/stores/user'

export const setupAuthGuard = (router) => {
  router.beforeEach((to, from, next) => {
    const userStore = useUserStore()
    
    // 设置页面标题
    if (to.meta.title) {
      document.title = `${to.meta.title} - 绩效管理系统`
    }
    
    // 检查是否需要身份验证
    if (to.meta.requiresAuth === false) {
      return next()
    }
    
    // 检查登录状态
    if (!userStore.isLoggedIn) {
      // 未登录，跳转到登录页
      return next('/login')
    }
    
    // 检查角色权限
    if (to.meta.roles) {
      const userRole = userStore.userRole
      if (!to.meta.roles.includes(userRole)) {
        // 无权限，跳转到仪表板
        return next('/dashboard')
      }
    }
    
    next()
  })
}