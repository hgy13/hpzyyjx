<!-- src/pages/DashboardPage.vue -->
<template>
  <div class="dashboard-container">
    <!-- 顶部导航栏 -->
    <header class="navbar">
      <div class="navbar-brand">
        <h2>医院绩效管理系统</h2>
      </div>
      <div class="navbar-menu">
        <nav>
          <router-link to="/dashboard">首页</router-link>
          <router-link to="/dashboard/personal">个人中心</router-link>
          <router-link to="/dashboard/notifications">
            消息通知
            <span v-if="unreadCount > 0" class="badge">{{ unreadCount }}</span>
          </router-link>
        </nav>
        <div class="user-info">
          <span>欢迎，{{ userName }}</span>
          <button @click="handleLogout" class="logout-btn">退出登录</button>
        </div>
      </div>
    </header>

    <div class="main-content">
      <!-- 左侧边栏菜单 -->
      <aside class="sidebar">
        <h3>系统功能</h3>
        <ul>
          <li v-for="menu in menus" :key="menu.path">
            <router-link :to="menu.path">{{ menu.title }}</router-link>
          </li>
        </ul>
      </aside>

      <!-- 主内容区 -->
      <main class="content">
        <router-view />
      </main>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../stores/user'
import axios from '../utils/axios'

const router = useRouter()
const userStore = useUserStore()

// 获取用户信息
const userName = computed(() => userStore.user?.name || '用户')

// 模拟菜单数据（实际应从后端接口获取）
const menus = ref([
  { path: '/dashboard/financial', title: '绩效数据管理' },
  { path: '/dashboard/approval', title: '分配审核' },
  { path: '/dashboard/report', title: '报表统计' },
  { path: '/dashboard/system', title: '系统管理' }
])

// 未读消息数
const unreadCount = ref(0)

// 登出
const handleLogout = async () => {
  try {
    await axios.post('/api/auth/logout')
  } catch (error) {
    console.error('登出失败:', error)
  } finally {
    userStore.logout()
    router.push('/login')
  }
}

// 获取未读消息数
const fetchUnreadCount = async () => {
  try {
    const response = await axios.get('/api/notifications/unread-count')
    unreadCount.value = response.data.count || 0
  } catch (error) {
    console.error('获取未读消息数失败:', error)
  }
}

onMounted(() => {
  fetchUnreadCount()
  // 定时刷新未读消息数
  setInterval(fetchUnreadCount, 30000)
})
</script>

<style scoped>
.dashboard-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
  height: 60px;
  background-color: #2c3e50;
  color: white;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.navbar-brand h2 {
  margin: 0;
  font-size: 20px;
  font-weight: 500;
}

.navbar-menu {
  display: flex;
  align-items: center;
  gap: 30px;
}

.navbar-menu nav {
  display: flex;
  gap: 20px;
}

.navbar-menu nav a {
  color: white;
  text-decoration: none;
  padding: 8px 12px;
  border-radius: 4px;
  transition: background-color 0.2s;
  position: relative;
}

.navbar-menu nav a:hover {
  background-color: rgba(255,255,255,0.1);
}

.navbar-menu nav a.router-link-active {
  background-color: rgba(255,255,255,0.2);
}

.badge {
  position: absolute;
  top: -5px;
  right: -5px;
  background-color: #ff5252;
  color: white;
  font-size: 12px;
  padding: 2px 6px;
  border-radius: 10px;
  min-width: 18px;
  text-align: center;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 15px;
}

.logout-btn {
  padding: 6px 12px;
  background-color: #e74c3c;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 13px;
  transition: background-color 0.2s;
}

.logout-btn:hover {
  background-color: #c0392b;
}

.main-content {
  display: flex;
  flex: 1;
}

.sidebar {
  width: 200px;
  background-color: #f8f9fa;
  border-right: 1px solid #dee2e6;
  padding: 20px;
}

.sidebar h3 {
  margin: 0 0 20px 0;
  color: #495057;
  font-size: 16px;
  font-weight: 600;
}

.sidebar ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.sidebar li {
  margin-bottom: 8px;
}

.sidebar li a {
  display: block;
  padding: 10px 12px;
  color: #495057;
  text-decoration: none;
  border-radius: 4px;
  transition: all 0.2s;
}

.sidebar li a:hover {
  background-color: #e9ecef;
  color: #42b983;
}

.sidebar li a.router-link-active {
  background-color: #42b983;
  color: white;
}

.content {
  flex: 1;
  padding: 20px;
  background-color: #f8f9fa;
  overflow-y: auto;
}
</style>