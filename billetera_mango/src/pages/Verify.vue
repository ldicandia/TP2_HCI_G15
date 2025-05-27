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
import { useRouter } from 'vue-router'
import { useSecurityStore } from '@/stores/useAuth'

const securityStore = useSecurityStore()

const router = useRouter()
const verificationCode = ref('')
const errorMessage = ref('')



async function handleVerify() {
  try {
    await securityStore.verify(verificationCode.value)
    router.push('/home')
    console.log('Código de verificación exitoso')
  } catch (error) {
    console.error('Error al verificar el código:', error)
    errorMessage.value = 'El código de verificación es inválido o ha expirado.'
  }
}
</script>

<style scoped src="@/styles/Login.css"></style>