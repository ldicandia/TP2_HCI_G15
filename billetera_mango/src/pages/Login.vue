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
        <div class="text-right mb-4">
          <a href="#" class="text-caption text-cyan">¿Olvidaste tu contraseña?</a>
        </div>
        <v-btn class="login-button" block @click="login">Ingresar</v-btn>
        <div class="mt-6 text-center">
          <span class="text-white text-caption">¿No tienes cuenta?</span>
          <a href="#" class="text-caption text-cyan text-decoration-underline">Regístrate</a>
        </div>
      </v-card>
    </v-main>
  </v-app>
</template>

<script setup>
import { ref } from 'vue'

const email = ref('')
const password = ref('')

function login() {
  console.log('Intentando login con', email.value, password.value)
}
</script>

<style scoped src="@/styles/Login.css"></style>
