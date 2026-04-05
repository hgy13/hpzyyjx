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

// 模拟登录
export const login = (username, password) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const user = mockUsers.find(u => u.username === username && u.password === password)
      
      if (user) {
        // 模拟锁定检查
        if (username === 'locked_user') {
          resolve({
            code: 403,
            message: '账户已被锁定，请联系管理员',
            data: null
          })
          return
        }
        
        resolve({
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
      } else {
        resolve({
          code: 401,
          message: '用户名或密码错误',
          data: null
        })
      }
    }, 800) // 模拟网络延迟
  })
}

// 模拟登出
export const logout = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        code: 200,
        message: '登出成功',
        data: null
      })
    }, 300)
  })
}

// 模拟获取用户信息
export const getUserProfile = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}')
      resolve({
        code: 200,
        message: '获取成功',
        data: userInfo
      })
    }, 500)
  })
}