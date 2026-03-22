<template>
  <div class="frontend-layout">
    <div class="navbar-container">
      <div class="brand-section">
        <el-image
          style="width: 50px; height: 50px"
          :src="iconurl"
          alt="品牌logo"
          class="brand-logo"
        ></el-image>
        <h1 class="brand-name">心理健康AI助手</h1>
      </div>
      <div class="nav-section">
        <router-link to="/" class="nav-link">首页</router-link>
        <router-link to="/consultation" class="nav-link" v-if="isLoggendIn"
          >AI咨询</router-link
        >
        <router-link to="/emotion-diary" class="nav-link" v-if="isLoggendIn"
          >情绪日记</router-link
        >
        <router-link to="/knowledge" class="nav-link">知识库</router-link>
        <router-link
          to="/logout-btn"
          class="nav-link"
          v-if="isLoggendIn"
          @click="handleLogout"
          >退出登录</router-link
        >
        <template v-else>
          <router-link to="/auth/login" class="nav-link">登录</router-link>
          <router-link to="/auth/register" class="nav-link">
            <el-button type="primary">注册</el-button>
          </router-link>
        </template>
      </div>
    </div>
    <div class="main-content">
      <router-view />
    </div>
    <div class="footer-container">
      <div class="footer-bottom">
        <p>&copy; 2026 心理健康AI助手. All rights reserved.</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { logout } from "@/api/admin";
import { useRouter } from "vue-router";

const router = useRouter();

// 退出登录
const handleLogout = () => {
  logout().then(() => {
    // 清除token
    localStorage.removeItem("token");
    // 清除userInfo信息
    localStorage.removeItem("userInfo");
    router.push("/auth/login");
  });
};

const iconurl = new URL("@/assets/images/机器人.png", import.meta.url).href;
const isLoggendIn = ref(false);

onMounted(() => {
  //清除token
  // localStorage.removeItem("token");
  // localStorage.removeItem("userInfo");
  isLoggendIn.value = localStorage.getItem("token") !== null;
});
</script>

<style lang="scss" scoped>
.frontend-layout {
  background-color: #fff;
  .navbar-container {
    max-width: 1200px;
    height: 100%;
    margin: 0 auto;
    padding: 10px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    .brand-section {
      display: flex;
      align-items: center;
      .brand-name {
        margin-left: 10px;
        font-size: 24px;
        font-weight: 600;
        color: #333;
      }
    }
    .nav-section {
      display: flex;
      align-items: center;
      gap: 40px;
      .nav-link {
        color: #4b5563;
        font-size: 16px;
        font-weight: 500;
        &:hover {
          color: #4a90e2;
        }
      }
    }
  }

  .footer-container {
    background: #1f2937;
    color: white;
    padding: 15px 0;
    margin-top: auto;
    .footer-bottom {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 10px;
      text-align: center;
    }
  }
}
</style>
 
