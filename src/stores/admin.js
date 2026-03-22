import { defineStore } from 'pinia'
import { ref } from 'vue'

//admin是这个仓库的id名
export const useAdminStore = defineStore('admin', () => {
  //定义响应式状态
  const isCollapse = ref(false)

  const toggleCollapse = () => {
    isCollapse.value = !isCollapse.value
  }
  //返回一个值
  return { isCollapse, toggleCollapse }
})