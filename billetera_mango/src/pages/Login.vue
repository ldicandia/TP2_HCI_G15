<template>
  <v-app color="background">
    <v-main class="d-flex align-center justify-center">
      <v-card class="pa-6 login-card" color="surface">
        <div class="text-center mb-6">
          <div class="logo-container" color="surface">
            <v-img :src="mangoLogo" class="logo-image" />
          </div>
        </div>
        <v-text-field
          v-model="email"
          label="Ingresar e-mail"
          variant="outlined"
          density="compact"
          class="mb-4"
          hide-details
          color="cyan"
        />
        <v-text-field
          v-model="password"
          label="Ingresar contraseña"
          type="password"
          variant="outlined"
          density="compact"
          class="mb-2"
          hide-details
          color="cyan"
        />
        <!-- Mensaje de error -->
        <div v-if="errorMessage" class="error-message text-red text-caption mb-4">
          {{ errorMessage }}
        </div>
        <v-btn class="login-button" block @click="handleLogin" color="button">Ingresar</v-btn>
        <div class="mt-6 text-center">
          <span class="text-grey text-caption">¿No tienes cuenta? </span>
          <a @click="goToRegister" class="text-caption text-grey text-decoration-underline">Regístrate</a>
        </div>
      </v-card>
    </v-main>
  </v-app>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useSecurityStore } from '@/stores/useAuth'
import mangoLogo from '@/assets/mango-logo.png'

const router = useRouter()
const securityStore = useSecurityStore()

const email = ref('')
const password = ref('')
const errorMessage = ref('')

async function handleLogin() {
  try {
    await securityStore.login({ email: email.value, password: password.value }, true)
    router.push('/home') // Redirige a la página de inicio
  } catch (error) {
    console.error('Error al iniciar sesión:', error)
    errorMessage.value = 'Credenciales inválidas. Por favor, inténtalo de nuevo.'
  }
}

function goToRegister() {
  router.push('/register') // Redirige a la página de registro
}
</script>

<style scoped src="@/styles/Login.css"></style>
