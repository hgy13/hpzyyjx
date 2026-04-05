// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'
import { setupAuthGuard } from './auth'

// 使用动态导入，避免循环依赖
const routes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/LoginPage.vue'),
    meta: { 
      requiresAuth: false, 
      title: '登录',
      hideHeader: true
    }
  },
  {
    path: '/',
    redirect: '/dashboard',
    meta: { requiresAuth: true }
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: () => import('@/components/layout/AppLayout.vue'),
    meta: { 
      requiresAuth: true, 
      title: '仪表板',
      roles: ['admin', 'finance', 'department_head', 'nurse_head', 'staff']
    }
  },
  {
    path: '/admin/dashboard',
    name: 'AdminDashboard',
    component: () => import('@/components/layout/AppLayout.vue'),
    meta: { 
      requiresAuth: true, 
      title: '管理员面板', 
      roles: ['admin'] 
    }
  },
  {
    path: '/finance/performance',
    name: 'FinancePerformance',
    component: () => import('@/components/layout/AppLayout.vue'),
    meta: { 
      requiresAuth: true, 
      title: '绩效数据管理', 
      roles: ['finance'] 
    }
  },
  {
    path: '/department/approval',
    name: 'DepartmentApproval',
    component: () => import('@/components/layout/AppLayout.vue'),
    meta: { 
      requiresAuth: true, 
      title: '科室审批', 
      roles: ['department_head', 'nurse_head'] 
    }
  },
  {
    path: '/staff/dashboard',
    name: 'StaffDashboard',
    component: () => import('@/components/layout/AppLayout.vue'),
    meta: { 
      requiresAuth: true, 
      title: '员工面板', 
      roles: ['staff'] 
    }
  },
  
{
  path: '/',
  component: () => import('@/layouts/DefaultLayout.vue'),
  children: [
    {
      path: 'dashboard',
      name: 'Dashboard',
      component: () => import('@/views/Dashboard.vue'),
      meta: { title: '数据看板' }
    }
    
  ]
},
  {
    path: '/404',
    name: 'NotFound',
    component: () => import('@/views/NotFound.vue'),
    meta: { requiresAuth: false, title: '页面未找到' }
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/404'
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// 设置路由守卫
setupAuthGuard(router)

export default router