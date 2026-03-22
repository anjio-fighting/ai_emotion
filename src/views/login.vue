<template>
  <div class="container">
    <div class="title">
      <div class="backhome">
        <!-- <Back />是返回首页的图标组件 -->
        <el-icon><Back /></el-icon>
        <span>返回首页</span>
      </div>
      <div class="title-text">
        <h2>登录您的账户</h2>
        <p>请输入您的登录信息</p>
      </div>
    </div>
    <div class="form-container">
      <!-- :model="formData"将表单的数据对象（formData）绑定到组件上，将整个表单的数据源传递给 el-form 组件
      rules="rules"定义表单的校验规则
      label-position="top"设置表单项标签（如“用户名或邮箱”）的位置在输入框的上方 -->
      <el-form
        ref="ruleFormRef"
        :model="formData"
        :rules="rules"
        label-position="top"
      >
        <!-- label="用户名或邮箱"定义该表单项的标签文本 
        prop="username"指定该表单项对应的字段名。它必须对应 :model 对象中的属性名（即 formData.username）。
        它是连接 <el-form> 的 :rules 和具体输入框的桥梁。只有设置了 prop，Element Plus 才知道当点击提交时，应该去校验 formData 中的哪一个字段。-->
        <el-form-item label="用户名或邮箱" prop="username">
          <el-input
            v-model="formData.username"
            placeholder="请输入用户名或邮箱"
          />
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <!-- show-password在密码输入框右侧增加一个“小眼睛”图标，点击可以切换显示/隐藏密码明文。这是一个用户体验增强属性。
           placeholder输入框为空时的提示文字-->
          <el-input
            v-model="formData.password"
            type="password"
            placeholder="请输入密码"
            show-password
          />
        </el-form-item>
        <!-- @click="submitForm(ruleFormRef)" 是提交表单的方法 ，ruleFormRef 是表单的引用 -->
        <el-button
          class="btn"
          size="large"
          type="primary"
          @click="submitForm(ruleFormRef)"
          >登录</el-button
        >
      </el-form>
      <div class="footer">
        <!--<router-link to="/auth/register"></router-link>是跳转到注册页面的链接组件 -->
        <p>还没有账户？<router-link to="/auth/register">去注册</router-link></p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from "vue";
import { login } from "@/api/admin";
import { useRouter } from "vue-router";
import { ElMessage } from "element-plus";

const router = useRouter();
const ruleFormRef = ref(null); //ref引用：为了在 JS 逻辑中直接调用表单组件的方法，如validate校验
const formData = reactive({
  username: "",
  password: "",
});
const rules = reactive({
  //键名必须与 formData 中的字段名对应
  username: [
    { required: true, message: "请输入用户名或邮箱", trigger: "blur" },
  ], //required: true 表示必填项，trigger: "blur" 表示在失去焦点时触发验证，message: "请输入用户名或邮箱" 表示验证失败时的提示信息，
  password: [{ required: true, message: "请输入密码", trigger: "blur" }],
});
//formRef 是表单的引用，用于调用表单的方法，如 validate() 是验证表单的方法，返回一个 Promise，resolve 是验证通过的回调，reject 是验证不通过的回调
const submitForm = async (formRef) => {
  if (!formRef) return; //判断表单引用是否存在，不存在则直接返回
  //验证表单,formRef.validate((valid, filed) => {
  //  valid 参数： 布尔值。true 表示所有校验通过，false 表示校验失败
  // filed 参数： 校验失败的字段名数组用于定位具体是哪个字段错了）
  //  })
  await formRef.validate((valid, filed) => {
    if (valid) {
      //login(formData) 是登录接口，返回一个 Promise，resolve 是登录成功的回调，reject 是登录失败的回调
      login(formData)
        .then((data) => {
          if (!data.token) {
            ElMessage.error(data.message || "登录失败");
            return;
          }
          //登录成功后，将 token 和 userInfo信息存储到本地存储中
          localStorage.setItem("token", data.token);
          //localStorage一种本地存储机制；.setItem(key, value)用于存入数据；JSON.stringify(data)将 JavaScript 对象（或数组）转换成 JSON 格式的字符串
          localStorage.setItem("userInfo", JSON.stringify(data));
          // 根据用户类型进行路由跳转
          if (data.userInfo.userType === 2) {
            router.push("/back/dashboard");
          } else if (data.userInfo.userType === 1) {
            router.push("/");
          }
        })
        .catch((err) => {
          ElMessage.error(err?.message || "登录失败，请检查用户名和密码");
        });
    }
  });
};
</script>

<style lang="scss" scoped>
.container {
  width: 384px;
  .title {
    .backhome {
      margin-bottom: 60px;
    }
    .title-text {
      text-align: center;
      h2 {
        font-size: 36px;
        margin-bottom: 10px;
      }
      p {
        font-size: 18px;
        color: #6b7280;
      }
    }
  }
  .form-container {
    margin-top: 30px;
    .btn {
      margin-top: 40px;
      width: 100%;
    }
    .footer {
      padding: 30px;
      text-align: center;
    }
  }
}
</style>