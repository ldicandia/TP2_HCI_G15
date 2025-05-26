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
                <v-btn block @click="showDialog = true" class="action-button" color="button">
                  <v-icon>mdi-link-variant</v-icon>
                  Generar Enlace de Pago
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

    <!-- Dialog para crear enlace de pago -->
    <v-dialog v-model="showDialog" max-width="400px">
      <v-card>
        <v-card-title>Nuevo enlace de pago</v-card-title>
        <v-card-text>
          <v-form ref="form">
            <v-text-field
              v-model="paymentDescription"
              label="Descripción"
              required
            />
            <v-text-field
              v-model.number="paymentAmount"
              label="Monto"
              type="number"
              required
            />
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn text @click="onCancel">Cancelar</v-btn>
          <v-btn color="primary" @click="onConfirm">Generar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Snackbar para notificaciones -->
    <v-snackbar
      v-model="snackbar"
      timeout="3000"
      top
      color="success"
    >
      {{ snackbarText }}
      <template #action>
        <v-btn text @click="snackbar = false">Cerrar</v-btn>
      </template>
    </v-snackbar>
  </v-app>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useAccountStore } from '@/stores/useAccount.js'
import { useSecurityStore } from '@/stores/useAuth'
import { usePaymentsStore } from '@/stores/usePayments'

const router        = useRouter()
const accountStore  = useAccountStore()
const securityStore = useSecurityStore()
const paymentsStore = usePaymentsStore()

const { account }  = storeToRefs(accountStore)
const { payments } = storeToRefs(paymentsStore)

const showDialog         = ref(false)
const paymentDescription = ref('')
const paymentAmount      = ref(null)

// Estados del snackbar
const snackbar     = ref(false)
const snackbarText = ref('')

function formatCurrency(value) {
  const sign = value < 0 ? '-' : ''
  const abs  = Math.abs(value)
  return `${sign}$${Number(abs).toLocaleString('es-AR', { minimumFractionDigits: 2 })}`
}

function goEnviarDinero()   { router.push('/enviar-dinero') }
function goIngresarDinero() { router.push('/ingresar-dinero') }

function onCancel() {
  paymentDescription.value = ''
  paymentAmount.value      = null
  showDialog.value         = false
}

async function onConfirm() {
  const payment = await paymentsStore.pullPayment({
    amount:      paymentAmount.value,
    description: paymentDescription.value
  })
  if (payment && payment.uuid) {
    const url = `http://localhost:8080/api/payment/push?uuid=${payment.uuid}`
    try {
      await navigator.clipboard.writeText(url)
      // Reemplazo del alert por snackbar
      snackbarText.value = 'Enlace de pago copiado: ' + url
      snackbar.value     = true
    } catch (err) {
      console.error('Error copiando al portapapeles:', err)
    }
  }
  onCancel()
}

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
