// src/api/mock.js
// 模拟用户数据库
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

// 模拟延迟
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

// 模拟登录
export const login = async (username, password) => {
  await delay(800) // 模拟网络延迟
  
  const user = mockUsers.find(u => u.username === username && u.password === password)
  
  if (!user) {
    return {
      code: 401,
      message: '用户名或密码错误',
      data: null
    }
  }
  
  // 模拟账户锁定检查
  if (username === 'locked_user') {
    return {
      code: 403,
      message: '账户已被锁定，请联系管理员',
      data: null
    }
  }
  
  return {
    code: 200,
    message: '登录成功',
    data: {
      token: `mock-jwt-token-${user.id}-${Date.now()}`,
      userId: user.id,
      username: user.username,
      name: user.name,
      role: user.role,
      department: user.department,
      permissions: user.permissions,
      loginTime: new Date().toISOString()
    }
  }
}

// 模拟登出
export const logout = async () => {
  await delay(300)
  return {
    code: 200,
    message: '登出成功',
    data: null
  }
}

// 模拟获取用户信息
export const getUserProfile = async () => {
  await delay(500)
  const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}')
  return {
    code: 200,
    message: '获取成功',
    data: userInfo
  }
}