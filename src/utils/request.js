//axios是一个基于 Promise 的 HTTP 库，用于浏览器和 node.js 中的请求
import axios from "axios";
import { ElMessage } from 'element-plus';
import router from '@/router';

//创建 axios 实例
const service = axios.create({
  baseURL: '/api',//请求的前缀：设置所有请求的基础路径，避免在每个接口调用处都写完整的域名和前缀，方便统一管理后端接口地址。
  timeout: 5000,//请求的超时时间
});

//请求拦截器是在请求发送到服务器之前，对请求进行 “拦截” 并做统一处理的函数
service.interceptors.request.use(
  (config) => {
    // 在发送请求之前做些什么
    const token = localStorage.getItem('token');//从本地存储中获取 token
    // 如果 token 存在，将其添加到请求头中
    if (token) {
      config.headers['token'] = token
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

//响应拦截器是在响应返回到客户端之前，对响应进行 “拦截” 并做统一处理的函数
service.interceptors.response.use(
  (response) => {
    // 对响应数据做点什么
    const { data, config } = response;//从响应中提取数据和配置信息
    //处理业务状态码
    //登录成功
    if (data.code === '200') {
      return data.data;//返回业务数据
    } else {
      //登录过期
      if (data.code === '-1') {
        //表示如果请求路径不包含 '/login'，则执行以下代码
        //"?."是可选链操作符：如果 config.url 是 undefined/null，直接返回 undefined，不会报错
        //如果是其他页面的请求返回了 -1，说明用户的登录状态失效了。
        if (!config.url?.includes('/login')) {
          //优先显示接口返回的自定义错误信息
          ElMessage.error(data.msg || '登录过期，请重新登录');
          // router.push('/auth/login');//跳转到登录页
          //清除本地存储中的 token
          localStorage.removeItem('token');
          //清除本地存储中的 userInfo
          localStorage.removeItem('userInfo');
          window.location.href = '/auth/login';//跳转到登录页
        } else {
          ElMessage.error(data.msg || '登录过期，请重新登录');
          return Promise.reject('网络请求失败...');
        }
      }
    }
    return response;
  },
  (error) => {
    // 对响应错误做点什么
    return Promise.reject(error);
  }
);

export default service;