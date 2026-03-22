<template>
  <div class="backend-layout">
    <el-container class="main-container">
      <Sidebar></Sidebar>
      <el-container>
        <el-header>
          <Navbar></Navbar>
        </el-header>
        <el-main>
          <router-view class="content-container"></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script setup>
import Sidebar from "./Sidebar.vue";
import Navbar from "./Navbar.vue";
</script>

<!--sass是一个css的预处理器，它可以在css的基础上添加一些功能，比如变量、混合、函数等-->
<style lang="scss" scoped>
// 满屏样式
.backend-layout {
  height: 100vh;
  .el-header {
    height: 74px !important; // 强制设置高度为74px，覆盖默认高度
  }
  .main-container {
    height: 100%;
    .content-container {
      padding: 20px;
      background-color: #fff;
      min-height: calc(100% - 74px); // 减去header的高度
    }
  }
}
</style>
