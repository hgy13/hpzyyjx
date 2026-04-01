<!-- src/pages/PersonalCenterPage.vue -->
<template>
  <div class="personal-center">
    <h2>个人中心</h2>
    
    <!-- 基本信息展示区域 -->
    <div class="info-section">
      <h3>基本信息</h3>
      <div class="info-item">
        <label>工号：</label>
        <span>{{ userInfo.employeeId || '--' }}</span>
      </div>
      <div class="info-item">
        <label>姓名：</label>
        <span>{{ userInfo.name || '--' }}</span>
      </div>
      <div class="info-item">
        <label>所属科室：</label>
        <span>{{ userInfo.department || '--' }}</span>
      </div>
      <div class="info-item">
        <label>角色：</label>
        <span>{{ userInfo.role || '--' }}</span>
      </div>
    </div>

    <!-- 密码修改区域 -->
    <div class="password-section">
      <h3>修改密码</h3>
      <form @submit.prevent="handleChangePassword">
        <div class="form-group">
          <label>原密码：</label>
          <input v-model="passwordForm.oldPassword" type="password" required />
        </div>
        <div class="form-group">
          <label>新密码：</label>
          <input v-model="passwordForm.newPassword" type="password" required />
        </div>
        <div class="form-group">
          <label>确认新密码：</label>
          <input v-model="passwordForm.confirmPassword" type="password" required />
        </div>
        <div v-if="passwordError" class="error-message">{{ passwordError }}</div>
        <button type="submit" :disabled="changingPassword">修改密码</button>
        <span v-if="passwordSuccess" class="success-message">密码修改成功！</span>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useUserStore } from '../stores/user'
import axios from '../utils/axios'

const userStore = useUserStore()

// 用户信息
const userInfo = ref({})

// 密码修改相关
const passwordForm = ref({
  oldPassword: '',
  newPassword: '',
  confirmPassword: ''
})
const changingPassword = ref(false)
const passwordError = ref('')
const passwordSuccess = ref(false)

// 获取个人信息
const fetchUserProfile = async () => {
  try {
    const response = await axios.get('/api/user/profile')
    userInfo.value = response.data
  } catch (error) {
    console.error('获取用户信息失败:', error)
  }
}

// 修改密码
const handleChangePassword = async () => {
  // 前端校验
  if (passwordForm.value.newPassword !== passwordForm.value.confirmPassword) {
    passwordError.value = '两次输入的新密码不一致'
    return
  }
  
  if (passwordForm.value.newPassword.length < 6) {
    passwordError.value = '新密码长度不能少于6位'
    return
  }
  
  changingPassword.value = true
  passwordError.value = ''
  passwordSuccess.value = false
  
  try {
    await axios.put('/api/user/password', {
      oldPassword: passwordForm.value.oldPassword,
      newPassword: passwordForm.value.newPassword
    })
    
    passwordSuccess.value = true
    passwordForm.value = { oldPassword: '', newPassword: '', confirmPassword: '' }
    
    // 可选：密码修改成功后自动登出
    setTimeout(() => {
      userStore.logout()
      window.location.href = '/login'
    }, 2000)
  } catch (error) {
    passwordError.value = error.response?.data?.message || '密码修改失败'
  } finally {
    changingPassword.value = false
  }
}

onMounted(() => {
  fetchUserProfile()
})
</script>

<style scoped>
.personal-center {
  max-width: 600px;
  margin: 20px auto;
  padding: 20px;
}

.info-section, .password-section {
  margin-bottom: 30px;
  padding: 20px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  background-color: #fff;
}

h3 {
  margin-bottom: 20px;
  color: #333;
  border-bottom: 1px solid #eee;
  padding-bottom: 10px;
}

.info-item {
  display: flex;
  margin-bottom: 15px;
  padding-bottom: 10px;
  border-bottom: 1px dashed #f0f0f0;
}

.info-item label {
  width: 100px;
  font-weight: bold;
  color: #666;
}

.info-item span {
  flex: 1;
  color: #333;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
  color: #666;
}

.form-group input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  box-sizing: border-box;
}

.form-group input:focus {
  outline: none;
  border-color: #42b983;
  box-shadow: 0 0 0 2px rgba(66, 185, 131, 0.1);
}

button[type="submit"] {
  padding: 10px 20px;
  background-color: #42b983;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}

button[type="submit"]:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

button[type="submit"]:hover:not(:disabled) {
  background-color: #3aa876;
}

.error-message {
  display: block;
  margin: 10px 0;
  padding: 10px;
  background-color: #ffebee;
  color: #c62828;
  border-radius: 4px;
  font-size: 13px;
}

.success-message {
  display: inline-block;
  margin-left: 15px;
  color: #4caf50;
  font-weight: bold;
}
</style>