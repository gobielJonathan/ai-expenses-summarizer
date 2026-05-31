import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth.store'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: () => import('@/modules/auth/LoginView.vue'),
      meta: { public: true },
    },
    {
      path: '/auth-callback',
      name: 'auth-callback',
      component: () => import('@/modules/auth/AuthCallbackView.vue'),
      meta: { public: true },
    },
    {
      path: '/',
      component: () => import('@/app/layouts/AppLayout.vue'),
      meta: { requiresAuth: true },
      children: [
        {
          path: '',
          redirect: '/dashboard',
        },
        {
          path: 'dashboard',
          name: 'dashboard',
          component: () => import('@/modules/dashboard/DashboardView.vue'),
        },
        {
          path: 'transactions',
          name: 'transactions',
          component: () => import('@/modules/transactions/TransactionsView.vue'),
        },
        {
          path: 'statements',
          name: 'statements',
          component: () => import('@/modules/statements/StatementsView.vue'),
        },
        {
          path: 'settings',
          name: 'settings',
          component: () => import('@/modules/settings/SettingsView.vue'),
        },
        {
          path: 'budget',
          name: 'budget',
          component: () => import('@/modules/budget/SetBudgetView.vue'),
        },
        {
          path: 'add-transaction',
          name: 'add-transaction',
          component: () => import('@/modules/transactions/AddTransactionView.vue'),
        },
      ],
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: '/',
    },
  ],
})

router.beforeEach((to) => {
  const auth = useAuthStore()
  if (to.meta.requiresAuth && !auth.isAuthenticated) {
    return { name: 'login', query: { redirect: to.fullPath } }
  }
  if (to.name === 'login' && auth.isAuthenticated) {
    return { path: '/dashboard' }
  }
})

export default router
