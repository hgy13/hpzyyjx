<!-- src/views/NotFound.vue -->
<template>
  <div class="not-found-container">
    <div class="not-found-content">
      <div class="error-code">404</div>
      <h1 class="error-title">页面未找到</h1>
      <p class="error-description">
        抱歉，您访问的页面不存在或已被移动。
      </p>
      <div class="action-buttons">
        <el-button type="primary" @click="goBack" size="large">
          返回上一页
        </el-button>
        <el-button @click="goHome" size="large">
          返回首页
        </el-button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const goBack = () => {
  if (window.history.length > 1) {
    router.go(-1)
  } else {
    goHome()
  }
}

const goHome = () => {
  router.push('/dashboard')
}
</script>

<style scoped>
.not-found-container {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
}

.not-found-content {
  text-align: center;
  background: white;
  padding: 60px 40px;
  border-radius: 12px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  max-width: 500px;
  width: 100%;
}

.error-code {
  font-size: 120px;
  font-weight: bold;
  color: #409eff;
  line-height: 1;
  margin-bottom: 20px;
  text-shadow: 4px 4px 0 rgba(64, 158, 255, 0.1);
}

.error-title {
  font-size: 32px;
  color: #303133;
  margin-bottom: 16px;
  font-weight: 600;
}

.error-description {
  font-size: 16px;
  color: #606266;
  margin-bottom: 40px;
  line-height: 1.6;
}

.action-buttons {
  display: flex;
  gap: 20px;
  justify-content: center;
  flex-wrap: wrap;
}

.action-buttons .el-button {
  min-width: 120px;
  height: 46px;
  font-size: 16px;
  border-radius: 8px;
}

@media (max-width: 640px) {
  .not-found-content {
    padding: 40px 20px;
  }
  
  .error-code {
    font-size: 80px;
  }
  
  .error-title {
    font-size: 24px;
  }
  
  .action-buttons {
    flex-direction: column;
  }
  
  .action-buttons .el-button {
    width: 100%;
  }
}
</style>