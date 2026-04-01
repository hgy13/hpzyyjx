<!-- src/pages/LoginPage.vue -->
<template>
  <div class="login-container">
    <h2>系统登录</h2>
    <form @submit.prevent="handleLogin">
      <div class="form-group">
        <label>用户名</label>
        <input v-model="username" type="text" required />
      </div>
      <div class="form-group">
        <label>密码</label>
        <input v-model="password" type="password" required />
      </div>
      <button type="submit" :disabled="loading">登录</button>
      <p v-if="error" class="error">{{ error }} </p>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../stores/user'

const router = useRouter()
const userStore = useUserStore()

const username = ref('')
const password = ref('')
const loading = ref(false)
constror = ref('')
 er
const handleLogin = async () => {
  loading.value = true
  error.value = ''
  try {
    const success = await userStore.login(username.value, password.value)
    if (success) {
      // 根据角色跳转
      if (userStore.role === '财务科') {
        router.push('/dashboard')
      } else {
        router.push('/dashboard') // 其他角色也可跳转
      }
    }
  } catch (err) {
    error.value = err.message
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.login-container {
  max-width: 400px;
  margin: 100px auto;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 8px;
  background: #f9f9f9;
}
.form-group {
  margin-bottom: 15px;
}
label {
  display: block;
  margin-bottom: 5px;
}
input {
  width: 100%;
  padding: 8px;
  box-sizing: border-box;
}
button {
  width: 100%;
  padding: 10px;
  background: #42b983;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
button:disabled {
  background: #ccc;
}
.error {
  color: red;
  margin-top: 10px;
}
</style>