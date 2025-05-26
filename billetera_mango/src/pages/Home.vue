<template>
  <v-app class="bg-dark">
    <v-main>
      <v-container>
        <v-row>
          <v-col cols="12" class="content">
            <!-- Fila superior: Solo Saldo -->
            <v-row>
              <v-col cols="12">
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
                  <p>
                    Alias:
                    {{ account && account.alias
                      ? account.alias
                      : 'Cargando...' }}
                  </p>
                </v-card>
              </v-col>
            </v-row>
            <!-- Fila inferior: Botones de acción y Movimientos -->
            <v-row class="actions-row">
              <v-col cols="6" class="text-center">
                <v-btn block @click="goEnviarDinero" class="action-button" color="button">
                  <v-icon>mdi-send</v-icon>
                  Enviar Dinero
                </v-btn>
                <v-btn block @click="goIngresarDinero" class="action-button" color="button">
                  <v-icon>mdi-cash-plus</v-icon>
                  Ingresar Dinero
                </v-btn>
                <v-btn block class="action-button" color="button">
                  <v-icon>mdi-link-variant</v-icon>
                  Enlace de pago
                </v-btn>
              </v-col>
              <v-col cols="6">
                <v-card class="movimientos-card" color="surface">
                  <h3>Movimientos</h3>
                  <div v-if="payments.length">
                    <div v-for="mov in payments" :key="mov.id">
                      <p>
                        {{ mov.date }} – {{ mov.type }}:
                        <span :class="mov.amount < 0 ? 'text-error' : 'text-success'">
                          {{ formatCurrency(mov.amount) }}
                        </span>
                      </p>
                    </div>
                  </div>
                  <p v-else>Cargando movimientos...</p>
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
import { onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useAccountStore } from '@/stores/useAccount.js'
import { useSecurityStore } from '@/stores/useAuth'
import { usePaymentsStore } from '@/stores/usePayments'

const router         = useRouter()
const accountStore   = useAccountStore()
const securityStore  = useSecurityStore()
const paymentsStore  = usePaymentsStore()

const { account }   = storeToRefs(accountStore)
const { payments }  = storeToRefs(paymentsStore)

function formatCurrency(value) {
  const sign = value < 0 ? '-' : ''
  const abs  = Math.abs(value)
  return `${sign}$${Number(abs).toLocaleString('es-AR', { minimumFractionDigits: 2 })}`
}

function goEnviarDinero()   { router.push('/enviar-dinero') }
function goIngresarDinero() { router.push('/ingresar-dinero') }

onMounted(async () => {
  securityStore.initialize()
  try {
    await accountStore.getAccountDetails()
    await paymentsStore.getAll()       // carga el historial
  } catch (e) {
    console.error('Error al cargar datos:', e)
  }
  if (!securityStore.isLoggedIn) {
    router.push('/login')
  }
})
</script>

<style scoped src="@/styles/Home.css"></style>
