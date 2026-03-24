<template>
  <el-form ref="ruleFormRef" :model="formData">
    <!-- 栅格布局是 Element Plus 提供的一种布局方式，用于将页面分为多个列，每个列可以包含不同的组件。 -->
    <el-row :gutter="24">
      <template v-for="item in formItemAttrs" :key="item.prop">
        <!-- v-bind="item.col"将 item.col 对象中的所有属性和值，全部作为 el-col 的属性绑定上去。-->
        <el-col v-bind="item.col">
          <!-- prop 是表单组件内部实现数据绑定、校验和重置功能的“身份证” -->
          <el-form-item :label="item.label" :prop="item.prop">
            <!--  <component:is="xxx"> is属性值是哪个组件，就渲染哪个组件 -->
            <!-- v-model="formData[item.prop]"无论循环到哪个表单项，都能准确地将用户输入的值存入 formData 对应的属性中。
            例如，item.prop='name' 时，数据就会自动绑定到 formData.name-->
            <component
              v-model="formData[item.prop]"
              :is="isComp(item.comp)"
              :placeholder="item.placeholder"
            >
              <template v-if="item.comp === 'select'">
                <el-option label="全部" value="" />
                <el-option
                  v-for="opt in item.options"
                  :key="opt.value"
                  :label="opt.label"
                  :value="opt.value"
                />
              </template>
            </component>
          </el-form-item>
        </el-col>
      </template>
    </el-row>
    <el-row>
      <el-button type="primary" @click="handleSearch">查询</el-button>
      <el-button @click="handleReset(ruleFormRef)">重置</el-button></el-row
    >
  </el-form>
</template>

<script setup>
import { ref, reactive, computed } from "vue";

const props = defineProps({
  formItem: {
    type: Array,
    default: () => [],
  },
});

const formItemAttrs = computed(() => {
  return props.formItem.map((item) => ({
    ...item,
    col: { xs: 24, sm: 12, md: 8, lg: 6, xl: 6 },
  }));
});

const emit = defineEmits(["search"]);

// 映射函数：将配置中的字符串（如 'input'）转换为 Element Plus 组件的真实标签名（如 'el-input'）
const isComp = (comp) => {
  return {
    input: "elInput",
    select: "elSelect",
  }[comp];
};

const formData = reactive({});
const ruleFormRef = ref(null);

const handleSearch = () => {
  emit("search", formData);
};
const handleReset = (formEl) => {
  if (!formEl) return;
  formEl.resetFields();
  emit("search", formData);
};
</script>
