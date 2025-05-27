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
          color="#6291da"
          :error="!!errors.firstName.length"
          :error-messages="errors.firstName"
        />

        <v-text-field
          v-model="lastName"
          label="Apellido"
          variant="outlined"
          density="compact"
          class="mb-4"
          color="#6291da"
          :error="!!errors.lastName.length"
          :error-messages="errors.lastName"
        />

        <v-text-field
          v-model="birthDate"
          label="Fecha de nacimiento (YYYY-MM-DD)"
          variant="outlined"
          density="compact"
          class="mb-4"
          color="#6291da"
          :error="!!errors.birthDate.length"
          :error-messages="errors.birthDate"
        />

        <v-text-field
          v-model="email"
          label="Ingresar e-mail"
          variant="outlined"
          density="compact"
          class="mb-4"
          color="#6291da"
          :error="!!errors.email.length"
          :error-messages="errors.email"
        />

        <v-text-field
          v-model="password"
          label="Ingresar contraseña"
          type="password"
          variant="outlined"
          density="compact"
          class="mb-4"
          color="#6291da"
          :error="!!errors.password.length"
          :error-messages="errors.password"
        />

        <v-text-field
          v-model="confirmPassword"
          label="Confirmar contraseña"
          type="password"
          variant="outlined"
          density="compact"
          class="mb-2"
          color="#6291da"
          :error="!!errors.confirmPassword.length"
          :error-messages="errors.confirmPassword"
        />

        <v-btn
          class="login-button"
          block
          color="button"
          @click="handleRegister"
        >
          Registrarse
        </v-btn>

        <div class="mt-6 text-center">
          <span class="text-grey text-caption">¿Ya tienes cuenta? </span>
          <a
            @click="goToLogin"
            class="text-caption text-grey text-decoration-underline"
          >
            Inicia sesión
          </a>
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

const errors = ref({
  firstName: [],
  lastName: [],
  birthDate: [],
  email: [],
  password: [],
  confirmPassword: []
})

function validateFields() {
  // Limpiar errores
  Object.keys(errors.value).forEach(key => {
    errors.value[key] = []
  })

  // Validaciones
  if (!firstName.value) {
    errors.value.firstName.push('El nombre es obligatorio.')
  }
  if (!lastName.value) {
    errors.value.lastName.push('El apellido es obligatorio.')
  }
  if (!birthDate.value) {
    errors.value.birthDate.push('La fecha de nacimiento es obligatoria.')
  } else if (!/^\d{4}-\d{2}-\d{2}$/.test(birthDate.value)) {
    errors.value.birthDate.push('La fecha debe tener formato YYYY-MM-DD.')
  }
  if (!email.value) {
    errors.value.email.push('El email es obligatorio.')
  } else if (!/\S+@\S+\.\S+/.test(email.value)) {
    errors.value.email.push('El email no es válido.')
  }
  if (!password.value) {
    errors.value.password.push('La contraseña es obligatoria.')
  } else if (password.value.length < 6) {
    errors.value.password.push('La contraseña debe tener al menos 6 caracteres.')
  }
  if (!confirmPassword.value) {
    errors.value.confirmPassword.push('La confirmación de contraseña es obligatoria.')
  } else if (confirmPassword.value !== password.value) {
    errors.value.confirmPassword.push('Las contraseñas no coinciden.')
  }

  // ¿Hay errores?
  return Object.values(errors.value).every(arr => arr.length === 0)
}

async function handleRegister() {
  if (!validateFields()) {
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
    router.push('/verify')
  } catch (err) {
    console.error('Error al registrar usuario:', err)
  }
}

function goToLogin() {
  router.push('/login')
}
</script>

<style scoped src="@/styles/Login.css"></style>
