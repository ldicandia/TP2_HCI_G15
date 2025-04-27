<template>
  <v-app class="bg-dark">
    <v-main class="d-flex align-center justify-center">
      <v-card class="pa-6 login-card">
        <div class="text-center mb-6">
          <div class="logo-container">
            <v-img src="/public/mango-logo.png" class="logo-image" />
          </div>
        </div>
        <v-text-field
          v-model="name"
          label="Nombre completo"
          variant="outlined"
          density="compact"
          class="mb-4"
          hide-details
          color="cyan"
        />
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
          class="mb-4"
          hide-details
          color="cyan"
        />
        <v-text-field
          v-model="confirmPassword"
          label="Confirmar contraseña"
          type="password"
          variant="outlined"
          density="compact"
          class="mb-2"
          hide-details
          color="cyan"
        />
        <v-btn class="login-button" block @click="register">Registrarse</v-btn>
        <div class="mt-6 text-center">
          <span class="text-grey text-caption">¿Ya tienes cuenta? </span>
          <a @click="goToLogin" class="text-caption text-grey text-decoration-underline">Inicia sesión</a>
        </div>
      </v-card>
    </v-main>
  </v-app>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const name = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')

function register() {
  if (password.value !== confirmPassword.value) {
    console.error('Las contraseñas no coinciden')
    return
  }
  console.log('Registrando usuario:', { name: name.value, email: email.value })
  router.push('/home') 
}

function goToLogin() {
  router.push('/login') // Redirige a la página de inicio de sesión
}
</script>

<style scoped src="@/styles/Login.css"></style>