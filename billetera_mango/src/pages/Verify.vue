<template>
  <v-app class="bg-dark">
    <v-main class="d-flex align-center justify-center">
      <v-card class="pa-6 login-card">
        <h3 class="text-center mb-4">Verificar correo</h3>
        <v-text-field
          v-model="verificationCode"
          label="Código de verificación"
          variant="outlined"
          density="compact"
          class="mb-4"
          hide-details
          color="cyan"
        />
        <v-btn class="login-button" block @click="handleVerify" color="button">Verificar</v-btn>
        <div v-if="errorMessage" class="error-message text-red text-caption mt-4">
          {{ errorMessage }}
        </div>
      </v-card>
    </v-main>
  </v-app>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useSecurityStore } from '@/stores/useAuth'

const securityStore = useSecurityStore()
const router = useRouter()
const route = useRoute()

const email = ref(route.query.email || '')
const password = ref(route.query.password || '')
const verificationCode = ref('')
const errorMessage = ref('')

async function handleVerify() {
  try {
    await securityStore.verify(verificationCode.value)
    await securityStore.login(
      { email: email.value, password: password.value },
      true
    )
    if (securityStore.isLoggedIn) {
      router.push('/home')
    } else {
      throw new Error('Token inválido o no configurado.')
    }
  } catch (error) {
    console.error('Error en verificación o login:', error)
    errorMessage.value =
      'Verificación o credenciales inválidas. Por favor, inténtalo de nuevo.'
  }
}
</script>
<style scoped src="@/styles/Login.css"></style>