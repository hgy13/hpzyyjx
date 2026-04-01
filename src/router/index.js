// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'

// 导入组件
import LoginPage from '../pages/LoginPage.vue'
import DashboardPage from '../pages/DashboardPage.vue'
import PersonalCenterPage from '../pages/PersonalCenterPage.vue'
import NotificationCenterPage from '../pages/NotificationCenterPage.vue'

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: LoginPage,
    meta: { requiresAuth: false }
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: DashboardPage,
    meta: { requiresAuth: true },
    children: [
      {
        path: '',
        name: 'DashboardHome',
        component: () => import('../pages/DashboardHome.vue')
      },
      {
        path: 'personal',
        name: 'PersonalCenter',
        component: PersonalCenterPage
      },
      {
        path: 'notifications',
        name: 'NotificationCenter',
        component: NotificationCenterPage
      }
    ]
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/login'
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// 路由守卫
router.beforeEach((to, from, next) => {
  const isAuthenticated = !!localStorage.getItem('token')
  
  if (to.meta.requiresAuth && !isAuthenticated) {
    // 需要登录但未登录，跳转到登录页
    next('/login')
  } else if (to.path === '/login' && isAuthenticated) {
    // 已登录但访问登录页，跳转到首页
    next('/dashboard')
  } else {
    // 其他情况正常放行
    next()
  }
})

export default router