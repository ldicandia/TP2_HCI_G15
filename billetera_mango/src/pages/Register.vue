<template>
  <v-app class="bg-dark">
    <v-main class="d-flex align-center justify-center">
      <v-card class="pa-6 login-card">
        <div class="text-center mb-6">
          <div class="logo-container">
            <v-img :src="mangoLogo" class="logo-image" />
          </div>
        </div>
        <v-text-field
          v-model="firstName"
          label="Nombre"
          variant="outlined"
          density="compact"
          class="mb-4"
          hide-details
          color="#6291da"
          :error="!!errors.firstName"
          :error-messages="errors.firstName"
        />
        <v-text-field
          v-model="lastName"
          label="Apellido"
          variant="outlined"
          density="compact"
          class="mb-4"
          hide-details
          color="#6291da"
          :error="!!errors.lastName"
          :error-messages="errors.lastName"
        />
        <v-text-field
          v-model="birthDate"
          label="Fecha de nacimiento (YYYY-MM-DD)"
          variant="outlined"
          density="compact"
          class="mb-4"
          hide-details
          color="#6291da"
          :error="!!errors.birthDate"
          :error-messages="errors.birthDate"
        />
        <v-text-field
          v-model="email"
          label="Ingresar e-mail"
          variant="outlined"
          density="compact"
          class="mb-4"
          hide-details
          color="#6291da"
          :error="!!errors.email"
          :error-messages="errors.email"
        />
        <v-text-field
          v-model="password"
          label="Ingresar contraseña"
          type="password"
          variant="outlined"
          density="compact"
          class="mb-4"
          hide-details
          color="#6291da"
          :error="!!errors.password"
          :error-messages="errors.password"
        />
        <v-text-field
          v-model="confirmPassword"
          label="Confirmar contraseña"
          type="password"
          variant="outlined"
          density="compact"
          class="mb-2"
          hide-details
          color="#6291da"
          :error="!!errors.confirmPassword"
          :error-messages="errors.confirmPassword"
        />
        <v-btn class="login-button" block @click="handleRegister" color="button">Registrarse</v-btn>
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
import mangoLogo from '@/assets/mango-logo.png'
import { useSecurityStore } from '@/stores/useAuth'

const router = useRouter()

const securityStore = useSecurityStore()

const firstName = ref('')
const lastName = ref('')
const birthDate = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const errors = ref({}) // Almacena los mensajes de error

function validateFields() {
  errors.value = {} // Reinicia los errores

  if (!firstName.value.trim()) {
    errors.value.firstName = 'El nombre es obligatorio.'
  }
  if (!lastName.value.trim()) {
    errors.value.lastName = 'El apellido es obligatorio.'
  }
  if (!birthDate.value.trim()) {
    errors.value.birthDate = 'La fecha de nacimiento es obligatoria.'
  } else if (!/^\d{4}-\d{2}-\d{2}$/.test(birthDate.value)) {
    errors.value.birthDate = 'La fecha de nacimiento debe tener el formato YYYY-MM-DD.'
  }
  if (!email.value.trim()) {
    errors.value.email = 'El correo electrónico es obligatorio.'
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
    errors.value.email = 'El correo electrónico no es válido.'
  }
  if (!password.value.trim()) {
    errors.value.password = 'La contraseña es obligatoria.'
  } else if (password.value.length < 6) {
    errors.value.password = 'La contraseña debe tener al menos 6 caracteres.'
  }
  if (password.value !== confirmPassword.value) {
    errors.value.confirmPassword = 'Las contraseñas no coinciden.'
  }

  return Object.keys(errors.value).length === 0 // Retorna true si no hay errores
}

async function handleRegister() {
  if (!validateFields()) {
    console.error('Errores en el formulario:', errors.value)
    return
  }

  try {
    await securityStore.register({
      firstName: firstName.value,
      lastName: lastName.value,
      birthDate: birthDate.value,
      email: email.value,
      password: password.value,
      metadata: {}
    })
    console.log('Usuario registrado exitosamente')
    router.push('/verify') // Redirige a la pantalla de verificación
  } catch (error) {
    console.error('Error al registrar usuario:', error)
  }
}

function goToLogin() {
  router.push('/login') // Redirige a la página de inicio de sesión
}
</script>

<style scoped src="@/styles/Login.css"></style>