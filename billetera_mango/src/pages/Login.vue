<template>
  <v-app color="background">
    <v-main class="d-flex align-center justify-center">
      <v-card class="pa-6 login-card" color="surface">
        <div class="text-center mb-6">
          <div class="logo-container" color="surface">
            <v-img src="/mango-logo.png" class="logo-image" />
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
        <v-btn class="login-button" block @click="login" color="button">Ingresar</v-btn>
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

const router = useRouter()

const email = ref('')
const password = ref('')

function login() {
  console.log('Intentando login con', email.value, password.value)
  router.push('/home') // Redirige a la página de inicio
}

function goToRegister() {
  router.push('/register') // Redirige a la página de registro
}
</script>

<style scoped src="@/styles/Login.css"></style>
