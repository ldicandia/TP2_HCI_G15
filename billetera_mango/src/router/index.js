import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '@/pages/Login.vue'
import RegisterView from '@/pages/Register.vue'
import HomeView from '@/pages/Home.vue'

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: LoginView
  },
  {
    path: '/register',
    name: 'Register',
    component: RegisterView
  },
  {
    path: '/home', // Agrega la ruta para Home
    name: 'Home',
    component: HomeView
  },
  {
    path: '/',
    redirect: '/login'
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router
