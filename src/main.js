import { createApp } from 'vue'
import './style.css'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import App from './App.vue'
import router from './router'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import { createPinia } from 'pinia'

const app = createApp(App)
//Pinia 是 Vue.js 官方推荐的状态管理库，可以把它理解为一个专门用来存放和管理应用“全局数据”的仓库。
const pinia = createPinia()
//将 Element Plus 提供的所有图标组件注册为全局组件，可以在任何模板中直接使用 <Search /> 或 <el-icon><Search /></el-icon>
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}
//.mount('#app')：将 Vue 应用挂载到 HTML 中 id 为 app 的元素上（即 index.html 中的 <div id="app"></div>）
app.use(ElementPlus).use(router).use(pinia).mount('#app')