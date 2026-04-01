<!-- src/pages/NotificationCenterPage.vue -->
<template>
  <div class="notification-center">
    <div class="header">
      <h2>消息通知中心</h2>
      <div class="header-actions">
        <button @click="markAllAsRead" :disabled="!unreadCount">全部标记为已读</button>
        <button @click="deleteAllRead" class="delete-btn">删除已读</button>
      </div>
    </div>

    <!-- 统计信息 -->
    <div class="stats">
      <span>未读消息：<strong>{{ unreadCount }}</strong> 条</span>
      <span>总消息数：<strong>{{ notifications.length }}</strong> 条</span>
    </div>

    <!-- 消息列表 -->
    <div v-if="loading" class="loading">加载中...</div>
    <div v-else-if="notifications.length === 0" class="empty-state">
      暂无消息通知
    </div>
    <div v-else class="notification-list">
      <div 
        v-for="item in notifications" 
        :key="item.id" 
        :class="['notification-item', { unread: !item.isRead }]"
      >
        <div class="notification-content">
          <div class="notification-header">
            <h4>{{ item.title }}</h4>
            <span class="badge" :class="item.priority">{{ item.priority }}</span>
            <span class="time">{{ formatTime(item.createTime) }}</span>
          </div>
          <p class="content">{{ item.content }}</p>
          <div class="notification-footer">
            <span class="type">类型：{{ item.businessType }}</span>
            <div class="actions">
              <button 
                v-if="!item.isRead" 
                @click="markAsRead(item.id)" 
                class="read-btn"
              >
                标记已读
              </button>
              <button @click="deleteNotification(item.id)" class="delete-btn">删除</button>
              <button 
                v-if="item.linkUrl" 
                @click="goToDetail(item.linkUrl)" 
                class="link-btn"
              >
                查看详情
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import axios from '../utils/axios'

// 消息数据
const notifications = ref([])
const loading = ref(false)

// 计算未读数量
const unreadCount = computed(() => {
  return notifications.value.filter(item => !item.isRead).length
})

// 获取消息列表
const fetchNotifications = async () => {
  loading.value = true
  try {
    const response = await axios.get('/api/todo-tasks')
    notifications.value = response.data
  } catch (error) {
    console.error('获取消息失败:', error)
  } finally {
    loading.value = false
  }
}

// 标记单个为已读
const markAsRead = async (id) => {
  try {
    await axios.put(`/api/notifications/${id}/read`)
    // 更新本地状态
    const index = notifications.value.findIndex(item => item.id === id)
    if (index !== -1) {
      notifications.value[index].isRead = true
    }
  } catch (error) {
    console.error('标记已读失败:', error)
  }
}

// 标记全部为已读
const markAllAsRead = async () => {
  try {
    const unreadIds = notifications.value
      .filter(item => !item.isRead)
      .map(item => item.id)
    
    if (unreadIds.length > 0) {
      await axios.put('/api/notifications/read-batch', { ids: unreadIds })
      notifications.value.forEach(item => {
        if (!item.isRead) item.isRead = true
      })
    }
  } catch (error) {
    console.error('批量标记已读失败:', error)
  }
}

// 删除单个消息
const deleteNotification = async (id) => {
  if (!confirm('确定删除这条消息吗？')) return
  
  try {
    await axios.delete(`/api/notifications/${id}`)
    notifications.value = notifications.value.filter(item => item.id !== id)
  } catch (error) {
    console.error('删除消息失败:', error)
  }
}

// 删除所有已读消息
const deleteAllRead = async () => {
  const readIds = notifications.value
    .filter(item => item.isRead)
    .map(item => item.id)
  
  if (readIds.length === 0) {
    alert('没有已读消息可删除')
    return
  }
  
  if (!confirm(`确定删除 ${readIds.length} 条已读消息吗？`)) return
  
  try {
    await axios.delete('/api/notifications/batch', { data: { ids: readIds } })
    notifications.value = notifications.value.filter(item => !item.isRead)
  } catch (error) {
    console.error('批量删除失败:', error)
  }
}

// 跳转到详情页面
const goToDetail = (url) => {
  window.location.href = url
}

// 时间格式化
const formatTime = (timeString) => {
  return new Date(timeString).toLocaleString('zh-CN')
}

onMounted(() => {
  fetchNotifications()
  // 可选：设置轮询或WebSocket实时更新
  // setInterval(fetchNotifications, 30000) // 每30秒刷新一次
})
</script>

<style scoped>
.notification-center {
  max-width: 900px;
  margin: 20px auto;
  padding: 20px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 2px solid #42b983;
}

.header-actions button {
  margin-left: 10px;
  padding: 8px 15px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 13px;
}

.header-actions button:first-child {
  background-color: #42b983;
  color: white;
}

.header-actions button:first-child:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.delete-btn {
  background-color: #ff5252;
  color: white;
}

.stats {
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
  padding: 10px;
  background-color: #f5f5f5;
  border-radius: 4px;
  font-size: 14px;
}

.stats strong {
  color: #42b983;
}

.loading, .empty-state {
  text-align: center;
  padding: 40px;
  color: #999;
  font-size: 16px;
}

.notification-list {
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  overflow: hidden;
}

.notification-item {
  padding: 20px;
  border-bottom: 1px solid #eee;
  background-color: white;
  transition: background-color 0.2s;
}

.notification-item.unread {
  background-color: #f0f9ff;
  border-left: 4px solid #42b983;
}

.notification-item:hover {
  background-color: #f9f9f9;
}

.notification-header {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
  gap: 10px;
}

.notification-header h4 {
  margin: 0;
  flex: 1;
  color: #333;
}

.badge {
  padding: 3px 8px;
  border-radius: 10px;
  font-size: 12px;
  color: white;
}

.badge.high {
  background-color: #ff5252;
}

.badge.medium {
  background-color: #ff9800;
}

.badge.low {
  background-color: #4caf50;
}

.time {
  font-size: 12px;
  color: #999;
}

.content {
  margin: 10px 0;
  color: #666;
  line-height: 1.6;
}

.notification-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 15px;
  padding-top: 10px;
  border-top: 1px dashed #eee;
}

.type {
  font-size: 12px;
  color: #666;
  background-color: #f0f0f0;
  padding: 3px 8px;
  border-radius: 3px;
}

.actions {
  display: flex;
  gap: 10px;
}

.actions button {
  padding: 5px 12px;
  border: 1px solid #ddd;
  border-radius: 3px;
  background-color: white;
  cursor: pointer;
  font-size: 12px;
  transition: all 0.2s;
}

.read-btn {
  background-color: #2196f3;
  color: white;
  border: none;
}

.read-btn:hover {
  background-color: #0d8bf2;
}

.link-btn {
  background-color: #42b983;
  color: white;
  border: none;
}

.link-btn:hover {
  background-color: #3aa876;
}

.delete-btn {
  background-color: #ffebee;
  color: #f44336;
  border-color: #ffcdd2;
}

.delete-btn:hover {
  background-color: #ffcdd2;
}
</style>