import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

// Route-level code splitting keeps the initial bundle small.
const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import('@/views/HomeView.vue'),
    meta: { title: '首頁' }
  },
  {
    path: '/services',
    name: 'services',
    component: () => import('@/views/ServiceListView.vue'),
    meta: { title: '服務列表' }
  },
  {
    path: '/services/:id',
    name: 'service-detail',
    component: () => import('@/views/ServiceDetailView.vue'),
    props: true,
    meta: { title: '服務詳情' }
  },
  {
    path: '/info/:slug',
    name: 'info',
    component: () => import('@/views/InfoView.vue'),
    props: true,
    meta: { title: '資訊' }
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/LoginView.vue'),
    meta: { title: '登入', requiresGuest: true }
  },
  {
    // ⚠ ASSUMPTION: auth requirement is conditional; enabled here by default.
    path: '/apply/:serviceId',
    name: 'apply',
    component: () => import('@/views/ApplyView.vue'),
    props: true,
    meta: { title: '申辦', requiresAuth: true }
  },
  {
    path: '/apply/:serviceId/result',
    name: 'apply-result',
    component: () => import('@/views/ApplyResultView.vue'),
    props: true,
    meta: { title: '申辦結果', requiresAuth: true }
  },
  {
    path: '/account',
    name: 'account',
    component: () => import('@/views/AccountView.vue'),
    meta: { title: '我的帳戶', requiresAuth: true }
  },
  {
    path: '/403',
    name: 'forbidden',
    component: () => import('@/views/error/ForbiddenView.vue'),
    meta: { title: '無權限' }
  },
  {
    path: '/500',
    name: 'server-error',
    component: () => import('@/views/error/ServerErrorView.vue'),
    meta: { title: '伺服器錯誤' }
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: () => import('@/views/error/NotFoundView.vue'),
    meta: { title: '找不到頁面' }
  }
]

export function createAppRouter() {
  const router = createRouter({
    history: createWebHistory(),
    routes,
    scrollBehavior(to, from, savedPosition) {
      if (savedPosition) return savedPosition
      return { top: 0 }
    }
  })

  // Navigation guard driven by route meta flags.
  router.beforeEach((to) => {
    const auth = useAuthStore()

    if (to.meta.requiresAuth && !auth.isLoggedIn) {
      return { name: 'login', query: { redirect: to.fullPath } }
    }

    if (to.meta.requiresGuest && auth.isLoggedIn) {
      return { name: 'home' }
    }

    return true
  })

  // Keep the document title in sync.
  router.afterEach((to) => {
    const base = 'CO2 碳捕獲服務'
    document.title = to.meta.title ? `${to.meta.title}｜${base}` : base
  })

  return router
}

const router = createAppRouter()
export default router
