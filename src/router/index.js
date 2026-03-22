import { createRouter, createWebHistory } from 'vue-router'
import BackendLayout from '@/components/BackendLayout.vue'
import FrontendLayout from '@/components/FrontendLayout.vue'
import AuthLayout from '@/components/AuthLayout.vue'

//后台路由配置
const backendRoutes = [
  {
    path: '/back',
    redirect: '/back/dashboard',
    component: BackendLayout,//后台布局组件
    children: [
      {
        path: 'dashboard',
        component: () => import('@/views/dashboard.vue'),
        meta: {
          title: '数据分析',
          icon: 'PieChart'
        }
      },
      {
        path: 'knowledge',
        component: () => import('@/views/knowledge.vue'),
        meta: {
          title: '知识文章',
          icon: 'ChatLineSquare'
        }
      },
      {
        path: 'consultations',
        component: () => import('@/views/consultations.vue'),
        meta: {
          title: '咨询记录',
          icon: 'Message'
        }
      },
      {
        path: 'emotional',
        component: () => import('@/views/emotional.vue'),
        meta: {
          title: '情感分析',
          icon: 'User'
        }
      }
    ]
  },
  {
    path: '/auth',
    component: AuthLayout,
    children: [
      {
        path: 'login',
        component: () => import('@/views/login.vue'),
        meta: {
          title: '登录'
        }
      },
      {
        path: 'register',
        component: () => import('@/views/register.vue'),
        meta: {
          title: '注册'
        }
      }
    ]
  }]

//前台路由配置
const frontendRoutes = [
  {
    path: '/',
    component: FrontendLayout,
    children: [
      {
        path: '',
        component: () => import('@/views/home.vue'),
      }, {
        path: 'consultation',
        component: () => import('@/views/consultation.vue'),
      }, {
        path: 'emotion-diary',
        component: () => import('@/views/emotionDiary.vue'),
      }, {
        path: 'knowledge',
        component: () => import('@/views/frontendKnowledge.vue'),
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes: [...frontendRoutes, ...backendRoutes]
})

//路由前置守卫
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem("token");
  if (token) {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    console.log(userInfo)
    if (userInfo.userInfo.userType == 2) {
      if (to.path.startsWith('/back')) {
        next();
      } else {
        next('/back/dashboard')
      }
    } else if (userInfo.userInfo.userType == 1) {
      // 前台用户
      if (to.path.startsWith('/back') || to.path.startsWith('/auth')) {
        next('/');
      } else {
        next()
      }
    }
  } else {
    if (to.path.startsWith('/back')) {
      next('/auth/login')
    } else {
      next()//next()表示放行，继续路由匹配
    }
  }
})

export default router