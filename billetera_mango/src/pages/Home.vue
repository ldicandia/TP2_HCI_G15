<template>
  <v-app class="bg-dark">
    <!-- Área principal -->
    <v-main>
      <v-container>
        <v-row>
          <v-col cols="12" class="content">
            <!-- Fila superior: Saldo y Tarjetas -->
            <v-row>
              <v-col cols="6">
                <v-card class="saldo-card" color="surface">
                  <h3>Saldo Disponible</h3>
                  <h1>
                    {{ account && account.balance != null
                      ? `$${Number(account.balance).toLocaleString('es-AR', { minimumFractionDigits: 2 })}`
                      : 'Cargando...' }}
                  </h1>
                  <p>
                    CVU:
                    {{ account && account.cvu
                      ? account.cvu
                      : 'Cargando...' }}
                  </p>
                  <!-- Nuevo campo Alias -->
                  <p>
                    Alias:
                    {{ account && account.alias
                      ? account.alias
                      : 'Cargando...' }}
                  </p>
                </v-card>
              </v-col>
              <v-col cols="6">
                <v-card class="tarjetas-card" color="surface">
                  <h3>Tarjetas</h3>
                  <v-btn
                    color="button"
                    class="vincular-button"
                    @click="goToTarjetas"
                    >Vincular
                  </v-btn>
                  <v-btn
                    color="button"
                    class="desvincular-button"
                    @click="goToTarjetas"
                    >Desvincular</v-btn
                  >
                </v-card>
              </v-col>
            </v-row>
            <!-- Fila inferior: Botones de acción y Movimientos -->
            <v-row class="actions-row">
              <v-col cols="6" class="text-center">
                <v-btn block @click="goEnviarDinero" class="action-button" color="button" >Enviar Dinero</v-btn>
                <v-btn block @click="goIngresarDinero" class="action-button" color="button">Ingresar Dinero</v-btn>
                <v-btn block class="action-button" color="button">Enlace de pago</v-btn>
              </v-col>
              <v-col cols="6">
                <v-card class="movimientos-card" color="surface">
                  <h3>Movimientos</h3>
                  <p>Steam: <span class="text-error">- $1.234,09</span></p>
                  <p>Juan: <span class="text-success">$12.234,09</span></p>
                </v-card>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useAccountStore } from '@/stores/useAccount.js'
import { useSecurityStore } from '@/stores/useAuth'
import { onMounted } from 'vue'
import { storeToRefs } from 'pinia'

const router       = useRouter()
const accountStore = useAccountStore()
const securityStore = useSecurityStore()
// extrae account como ref reactivo
const { account } = storeToRefs(accountStore)

function goEnviarDinero() {
  router.push('/enviar-dinero')
}

function goIngresarDinero() {
  router.push('/ingresar-dinero')
}

function goToTarjetas() {
  router.push('/tarjetas')
}

onMounted(async () => {
  securityStore.initialize()
  try {
    await accountStore.getAccountDetails()
  } catch (e) {
    console.error('No pudo cargar la cuenta:', e)
  }
  if (!securityStore.isLoggedIn) {
    router.push('/login')
  }
})
</script>

<style scoped src="@/styles/Home.css"></style>
