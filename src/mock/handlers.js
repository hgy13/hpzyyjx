// src/mocks/handlers.js
import { http, HttpResponse } from 'msw'

// Mock用户数据
const mockUsers = [
  {
    id: 1,
    username: 'admin',
    password: '123456',
    role: 'admin',
    department: '系统管理部',
    name: '系统管理员',
    permissions: ['dashboard', 'user_manage', 'system_config']
  },
  {
    id: 2,
    username: 'finance001',
    password: '123456',
    role: 'finance',
    department: '财务科',
    name: '张会计',
    permissions: ['finance_view', 'finance_edit', 'data_audit']
  },
  {
    id: 3,
    username: 'dept001',
    password: '123456',
    role: 'department_head',
    department: '外科',
    name: '李主任',
    permissions: ['dept_view', 'dept_edit', 'approval']
  },
  {
    id: 4,
    username: 'nurse001',
    password: '123456',
    role: 'nurse_head',
    department: '护理部',
    name: '王护士长',
    permissions: ['nurse_view', 'nurse_edit', 'approval']
  },
  {
    id: 5,
    username: 'staff001',
    password: '123456',
    role: 'staff',
    department: '内科',
    name: '赵医生',
    permissions: ['self_view', 'task_view']
  }
]

export const handlers = [
  // 登录接口
  http.post('/api/auth/login', async ({ request }) => {
    const { username, password } = await request.json()
    
    // 模拟网络延迟
    await new Promise(resolve => setTimeout(resolve, 800))
    
    const user = mockUsers.find(u => u.username === username && u.password === password)
    
    if (!user) {
      return HttpResponse.json({
        code: 401,
        message: '用户名或密码错误',
        data: null
      }, { status: 401 })
    }
    
    // 模拟账户锁定检查
    if (username === 'locked_user') {
      return HttpResponse.json({
        code: 403,
        message: '账户已被锁定，请联系管理员',
        data: null
      }, { status: 403 })
    }
    
    return HttpResponse.json({
      code: 200,
      message: '登录成功',
      data: {
        token: `mock-jwt-token-${user.id}-${Date.now()}`,
        userId: user.id,
        username: user.username,
        role: user.role,
        department: user.department,
        name: user.name,
        permissions: user.permissions,
        loginTime: new Date().toISOString()
      }
    })
  }),

  // 登出接口
  http.post('/api/auth/logout', async () => {
    await new Promise(resolve => setTimeout(resolve, 300))
    
    return HttpResponse.json({
      code: 200,
      message: '登出成功',
      data: null
    })
  }),

  // 获取用户信息
  http.get('/api/user/profile', async ({ request }) => {
    const token = request.headers.get('Authorization')?.replace('Bearer ', '')
    
    if (!token) {
      return HttpResponse.json({
        code: 401,
        message: '未授权',
        data: null
      }, { status: 401 })
    }
    
    await new Promise(resolve => setTimeout(resolve, 500))
    
    // 从token中解析用户ID
    const userId = parseInt(token.split('-')[3])
    const user = mockUsers.find(u => u.id === userId)
    
    if (!user) {
      return HttpResponse.json({
        code: 404,
        message: '用户不存在',
        data: null
      }, { status: 404 })
    }
    
    return HttpResponse.json({
      code: 200,
      message: '获取成功',
      data: {
        id: user.id,
        username: user.username,
        role: user.role,
        department: user.department,
        name: user.name
      }
    })
  })
]