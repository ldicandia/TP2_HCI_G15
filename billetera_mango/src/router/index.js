import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '@/components/Login.vue'

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: LoginView
  },
  {
    path: '/',
    redirect: '/login'  // Redirige la raíz al login
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router
