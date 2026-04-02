<!-- src/views/LoginPage.vue -->
<template>
  <div class="login-container">
    <div class="login-box">
      <div class="login-header">
        <h2>绩效管理系统</h2>
        <p>用户登录</p>
      </div>
      
      <el-form
        ref="loginFormRef"
        :model="loginForm"
        :rules="loginRules"
        class="login-form"
        @submit.prevent="handleLogin"
      >
        <el-form-item prop="username">
          <el-input
            v-model="loginForm.username"
            placeholder="请输入用户名"
            :prefix-icon="User"
            size="large"
            @keyup.enter="handleLogin"
          />
        </el-form-item>
        
        <el-form-item prop="password">
          <el-input
            v-model="loginForm.password"
            type="password"
            placeholder="请输入密码"
            :prefix-icon="Lock"
            size="large"
            show-password
            @keyup.enter="handleLogin"
          />
        </el-form-item>
        
        <el-form-item>
          <el-button
            type="primary"
            size="large"
            :loading="loading"
            @click="handleLogin"
            class="login-btn"
          >
            登录
          </el-button>
        </el-form-item>
        
        <div class="login-tips">
          <p><strong>测试账号：</strong></p>
          <div class="account-list">
            <div v-for="user in testAccounts" :key="user.username" class="account-item">
              <div class="account-info">
                <span class="label">用户名:</span>
                <span class="value">{{ user.username }}</span>
              </div>
              <div class="account-info">
                <span class="label">密码:</span>
                <span class="value">{{ user.password }}</span>
              </div>
              <div class="account-info">
                <span class="label">角色:</span>
                <span class="value">{{ user.roleText }}</span>
              </div>
              <el-button
                type="primary"
                size="small"
                plain
                @click="fillTestAccount(user)"
                class="fill-btn"
              >
                一键填充
              </el-button>
            </div>
          </div>
        </div>
      </el-form>
      
      <div v-if="errorMessage" class="error-message">
        <el-alert
          :title="errorMessage"
          type="error"
          show-icon
          :closable="false"
        />
      </div>
    </div>
    
    <div class="footer">
      <p>© 2024 绩效管理系统 - 测试环境</p>
      <p class="mock-notice">⚠️ 当前为Mock数据测试模式，无需后端服务</p>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { User, Lock } from '@element-plus/icons-vue'
import { useUserStore } from '@/stores/user'

const router = useRouter()
const userStore = useUserStore()

// 表单数据
const loginForm = reactive({
  username: '',
  password: ''
})

// 表单验证规则
const loginRules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, max: 20, message: '用户名长度3-20个字符', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, max: 20, message: '密码长度6-20个字符', trigger: 'blur' }
  ]
}

// 状态
const loading = ref(false)
const errorMessage = ref('')
const loginFormRef = ref(null)

// 测试账号
const testAccounts = [
  { username: 'admin', password: '123456', roleText: '系统管理员' },
  { username: 'finance001', password: '123456', roleText: '财务科' },
  { username: 'dept001', password: '123456', roleText: '科室主任' },
  { username: 'nurse001', password: '123456', roleText: '护士长' },
  { username: 'staff001', password: '123456', roleText: '普通员工' }
]

// 登录处理
const handleLogin = async () => {
  if (!loginFormRef.value) return
  
  try {
    // 表单验证
    await loginFormRef.value.validate()
    
    loading.value = true
    errorMessage.value = ''
    
    // 调用登录
    const result = await userStore.login(loginForm.username, loginForm.password)
    
    if (!result.success) {
      errorMessage.value = result.message || '登录失败'
    }
  } catch (error) {
    console.error('登录错误:', error)
    errorMessage.value = '表单验证失败，请检查输入'
  } finally {
    loading.value = false
  }
}

// 填充测试账号
const fillTestAccount = (account) => {
  loginForm.username = account.username
  loginForm.password = account.password
  errorMessage.value = ''
  
  // 自动聚焦到密码输入框
  setTimeout(() => {
    const passwordInput = document.querySelector('input[type="password"]')
    if (passwordInput) {
      passwordInput.focus()
    }
  }, 100)
}

// 监听键盘事件
const handleKeyPress = (e) => {
  if (e.key === 'Enter') {
    handleLogin()
  }
}

onMounted(() => {
  window.addEventListener('keypress', handleKeyPress)
  // 自动填充第一个测试账号
  if (testAccounts.length > 0) {
    fillTestAccount(testAccounts[0])
  }
})

onUnmounted(() => {
  window.removeEventListener('keypress', handleKeyPress)
})
</script>

<style scoped>
.login-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
  position: relative;
}

.login-box {
  width: 100%;
  max-width: 480px;
  padding: 40px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  z-index: 1;
}

.login-header {
  text-align: center;
  margin-bottom: 40px;
}

.login-header h2 {
  color: #333;
  font-size: 28px;
  margin-bottom: 8px;
  font-weight: 600;
}

.login-header p {
  color: #666;
  font-size: 16px;
  margin: 0;
}

.login-form {
  margin-bottom: 20px;
}

.login-btn {
  width: 100%;
  height: 50px;
  font-size: 16px;
  margin-top: 10px;
  font-weight: 500;
}

.login-tips {
  margin-top: 30px;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 8px;
  border-left: 4px solid #409eff;
}

.login-tips p {
  margin: 0 0 12px 0;
  color: #333;
  font-weight: 500;
  font-size: 14px;
}

.account-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.account-item {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: white;
  border-radius: 6px;
  border: 1px solid #e4e7ed;
  font-size: 12px;
  transition: all 0.3s;
}

.account-item:hover {
  border-color: #409eff;
  box-shadow: 0 2px 8px rgba(64, 158, 255, 0.1);
}

.account-info {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.account-info .label {
  color: #999;
  font-size: 10px;
  margin-bottom: 2px;
}

.account-info .value {
  color: #333;
  font-weight: 500;
  font-size: 12px;
}

.fill-btn {
  width: 100%;
  font-size: 11px;
  padding: 4px 8px;
}

.error-message {
  margin-top: 20px;
  animation: slideDown 0.3s ease;
}

.footer {
  position: fixed;
  bottom: 20px;
  left: 0;
  right: 0;
  text-align: center;
  color: rgba(255, 255, 255, 0.8);
  font-size: 14px;
  z-index: 0;
}

.footer p {
  margin: 4px 0;
  line-height: 1.5;
}

.mock-notice {
  color: #ffd700;
  font-weight: bold;
  animation: pulse 2s infinite;
  margin-top: 8px;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.7;
  }
}

@media (max-width: 640px) {
  .login-box {
    padding: 30px 20px;
    margin: 20px;
  }
  
  .account-item {
    grid-template-columns: 1fr;
    gap: 8px;
  }
  
  .account-info {
    flex-direction: row;
    justify-content: space-between;
  }
  
  .fill-btn {
    margin-top: 8px;
  }
}
</style>