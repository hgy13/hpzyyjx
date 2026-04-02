<!-- src/components/layout/AppLayout.vue -->
<template>
  <div class="app-layout">
    <header v-if="!$route.meta.hideHeader" class="app-header">
      <div class="header-left">
        <h2>绩效管理系统</h2>
        <el-tag v-if="roleText" type="success" size="small" class="user-role-tag">
          {{ roleText }}
        </el-tag>
      </div>
      <div class="header-right">
        <el-dropdown trigger="click" @command="handleCommand">
          <div class="user-info">
            <el-icon class="user-icon"><User /></el-icon>
            <span class="user-name">{{ userStore.displayName }}</span>
            <span class="user-department">({{ userStore.department }})</span>
            <el-icon class="dropdown-icon"><ArrowDown /></el-icon>
          </div>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item command="profile">
                <el-icon><UserFilled /></el-icon>
                个人中心
              </el-dropdown-item>
              <el-dropdown-item command="password">
                <el-icon><Lock /></el-icon>
                修改密码
              </el-dropdown-item>
              <el-dropdown-item divided command="logout">
                <el-icon><SwitchButton /></el-icon>
                退出登录
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </header>
    
    <main class="app-main">
      <div class="main-content">
        <div class="welcome-section">
          <h1>欢迎回来，{{ userStore.displayName }}！</h1>
          <div class="user-info-cards">
            <el-card class="info-card">
              <template #header>
                <div class="card-header">
                  <el-icon><UserFilled /></el-icon>
                  <span>用户信息</span>
                </div>
              </template>
              <div class="info-list">
                <div class="info-item">
                  <span class="info-label">用户名：</span>
                  <span class="info-value">{{ userStore.userName }}</span>
                </div>
                <div class="info-item">
                  <span class="info-label">角色：</span>
                  <span class="info-value">{{ roleText }}</span>
                </div>
                <div class="info-item">
                  <span class="info-label">部门：</span>
                  <span class="info-value">{{ userStore.department }}</span>
                </div>
                <div class="info-item">
                  <span class="info-label">登录时间：</span>
                  <span class="info-value">{{ loginTime }}</span>
                </div>
              </div>
            </el-card>
            
            <el-card class="quick-card">
              <template #header>
                <div class="card-header">
                  <el-icon><Operation /></el-icon>
                  <span>快捷操作</span>
                </div>
              </template>
              <div class="quick-actions">
                <el-button 
                  v-for="(action, index) in quickActions" 
                  :key="index"
                  :type="action.type"
                  :icon="action.icon"
                  @click="handleAction(action.command)"
                  class="action-btn"
                >
                  {{ action.label }}
                </el-button>
              </div>
            </el-card>
          </div>
        </div>
        
        <div class="dashboard-section">
          <h2>功能模块</h2>
          <div class="dashboard-cards">
            <el-card 
              v-for="(card, index) in dashboardCards" 
              :key="index" 
              class="dashboard-card"
              shadow="hover"
            >
              <template #header>
                <div class="card-header">
                  <el-icon :color="card.color" :size="20">
                    <component :is="card.icon" />
                  </el-icon>
                  <span>{{ card.title }}</span>
                </div>
              </template>
              <div class="card-content">
                <p class="card-description">{{ card.description }}</p>
                <div class="card-footer">
                  <el-button 
                    type="primary" 
                    link
                    @click="card.action"
                  >
                    进入
                  </el-button>
                  <span class="card-hint">{{ card.hint }}</span>
                </div>
              </div>
            </el-card>
          </div>
        </div>
        
        <div class="logout-section">
          <el-button 
            type="danger" 
            @click="handleLogout" 
            size="large"
            plain
            class="logout-btn"
          >
            <el-icon><SwitchButton /></el-icon>
            退出登录
          </el-button>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { 
  User, 
  ArrowDown, 
  UserFilled, 
  Lock, 
  SwitchButton,
  Operation,
  Setting,
  Document,
  Money,
  PieChart,
  DataBoard
} from '@element-plus/icons-vue'

const router = useRouter()
const userStore = useUserStore()

// 计算属性
const roleText = computed(() => {
  const roleMap = {
    'admin': '系统管理员',
    'finance': '财务科',
    'department_head': '科室主任',
    'nurse_head': '护士长',
    'staff': '普通员工'
  }
  return roleMap[userStore.userRole] || '未知角色'
})

const loginTime = computed(() => {
  return new Date().toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  })
})

// 快捷操作
const quickActions = computed(() => {
  const baseActions = [
    { 
      label: '修改密码', 
      icon: Lock, 
      type: 'primary', 
      command: 'password' 
    },
    { 
      label: '个人中心', 
      icon: UserFilled, 
      type: 'info', 
      command: 'profile' 
    }
  ]
  
  if (userStore.userRole === 'admin') {
    baseActions.unshift({
      label: '系统设置',
      icon: Setting,
      type: 'warning',
      command: 'system'
    })
  }
  
  return baseActions
})

// 仪表板卡片配置
const dashboardCards = computed(() => {
  const baseCards = [
    {
      title: '绩效数据',
      icon: Document,
      color: '#409EFF',
      description: '查看和分析绩效数据，包括收入支出统计',
      hint: '财务科可编辑',
      action: () => router.push('/finance/performance')
    },
    {
      title: '数据统计',
      icon: PieChart,
      color: '#67C23A',
      description: '查看各种统计报表和数据分析',
      hint: '所有角色可见',
      action: () => alert('数据统计功能开发中...')
    },
    {
      title: '工作台',
      icon: DataBoard,
      color: '#E6A23C',
      description: '个人工作台，查看待办事项和通知',
      hint: '个性化工作空间',
      action: () => alert('工作台功能开发中...')
    }
  ]
  
  // 根据角色添加特定卡片
  if (userStore.userRole === 'admin') {
    baseCards.unshift({
      title: '系统管理',
      icon: Setting,
      color: '#F56C6C',
      description: '用户管理、权限配置、系统设置',
      hint: '管理员专用',
      action: () => router.push('/admin/dashboard')
    })
  }
  
  if (['department_head', 'nurse_head'].includes(userStore.userRole)) {
    baseCards.unshift({
      title: '审批管理',
      icon: Money,
      color: '#9B30FF',
      description: '处理科室绩效分配审批事项',
      hint: '科主任/护士长专用',
      action: () => router.push('/department/approval')
    })
  }
  
  if (userStore.userRole === 'staff') {
    baseCards.unshift({
      title: '我的绩效',
      icon: DataBoard,
      color: '#FF6B8B',
      description: '查看个人绩效数据和分析',
      hint: '员工专用',
      action: () => router.push('/staff/dashboard')
    })
  }
  
  return baseCards
})

// 事件处理
const handleCommand = (command) => {
  switch (command) {
    case 'profile':
      alert('个人中心功能开发中...')
      break
    case 'password':
      alert('修改密码功能开发中...')
      break
    case 'logout':
      handleLogout()
      break
    case 'system':
      router.push('/admin/dashboard')
      break
  }
}

const handleAction = (command) => {
  handleCommand(command)
}

const handleLogout = () => {
  userStore.logout()
}
</script>

<style scoped>
.app-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: #f5f7fa;
}

.app-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 0 24px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 1000;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 16px;
}

.header-left h2 {
  margin: 0;
  font-size: 20px;
  font-weight: 600;
  letter-spacing: 0.5px;
}

.user-role-tag {
  font-weight: 500;
  border: none;
}

.header-right {
  display: flex;
  align-items: center;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s;
  background: rgba(255, 255, 255, 0.1);
}

.user-info:hover {
  background: rgba(255, 255, 255, 0.2);
}

.user-icon {
  font-size: 18px;
}

.user-name {
  font-weight: 500;
  font-size: 14px;
}

.user-department {
  font-size: 12px;
  opacity: 0.9;
}

.dropdown-icon {
  font-size: 12px;
  margin-left: 4px;
}

.app-main {
  flex: 1;
  padding: 24px;
  overflow-y: auto;
}

.main-content {
  max-width: 1200px;
  margin: 0 auto;
}

.welcome-section {
  margin-bottom: 32px;
}

.welcome-section h1 {
  color: #303133;
  margin-bottom: 24px;
  font-size: 28px;
  font-weight: 600;
}

.user-info-cards {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
  margin-bottom: 32px;
}

.info-card .info-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.info-item {
  display: flex;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px solid #f0f0f0;
}

.info-item:last-child {
  border-bottom: none;
}

.info-label {
  color: #606266;
  font-size: 13px;
  width: 80px;
  flex-shrink: 0;
}

.info-value {
  color: #303133;
  font-weight: 500;
  font-size: 13px;
}

.quick-card .quick-actions {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.action-btn {
  min-width: 100px;
}

.dashboard-section {
  margin-bottom: 40px;
}

.dashboard-section h2 {
  color: #303133;
  margin-bottom: 20px;
  font-size: 20px;
  font-weight: 600;
}

.dashboard-cards {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 24px;
  margin-bottom: 24px;
}

.dashboard-card {
  transition: all 0.3s;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.dashboard-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
}

.dashboard-card .card-header {
  display: flex;
  align-items: center;
  gap: 10px;
  font-weight: 600;
  font-size: 16px;
  color: #303133;
  padding: 16px 20px 12px;
}

.card-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 0 20px 20px;
}

.card-description {
  color: #606266;
  font-size: 13px;
  line-height: 1.6;
  margin-bottom: 16px;
  flex: 1;
}

.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: auto;
}

.card-hint {
  color: #909399;
  font-size: 12px;
  font-style: italic;
}

.logout-section {
  text-align: center;
  padding: 40px 0 20px;
  border-top: 1px solid #e4e7ed;
}

.logout-btn {
  min-width: 150px;
  border-radius: 20px;
}

.logout-btn:hover {
  transform: scale(1.05);
}

@media (max-width: 768px) {
  .app-header {
    padding: 0 16px;
  }
  
  .header-left h2 {
    font-size: 18px;
  }
  
  .user-info {
    padding: 6px 12px;
  }
  
  .user-name, .user-department {
    display: none;
  }
  
  .app-main {
    padding: 16px;
  }
  
  .user-info-cards {
    grid-template-columns: 1fr;
  }
  
  .dashboard-cards {
    grid-template-columns: 1fr;
  }
  
  .welcome-section h1 {
    font-size: 24px;
  }
}
</style>