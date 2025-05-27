<template>
  <v-app class="bg-dark">
    <!-- Main Content -->
    <v-main>
      <v-container>
        <v-row>
          <v-col cols="12">
            <GoBackButton :to="'/home'" />
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12" md="6">
            <v-card class="pa-4" color="surface">
              <h3 class="mb-4">Ingresar Dinero</h3>
              <v-select
                v-model="source"
                :items="sources"
                label="Seleccionar fuente"
                variant="outlined"
                density="compact"
                class="mb-4"
                hide-details
                color="cyan"
              />
              <v-text-field
                v-model="amount"
                label="Ingresar monto"
                variant="outlined"
                density="compact"
                class="mb-4"
                hide-details
                color="cyan"
              />
              <v-btn block color="button" @click="depositMoney">Ingresar</v-btn>
            </v-card>
          </v-col>
          <v-col cols="12" md="6">
            <v-card class="pa-4" color="surface">
              <h3>Historial</h3>
              <v-list>
                <v-list-item v-for="(item, index) in history" :key="index">
                  <v-list-item-content>
                    <v-list-item-title>{{ item.description }}</v-list-item-title>
                    <v-list-item-subtitle>{{ item.amount }}</v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>
              </v-list>
              <v-btn block color="button" @click="viewMore">Ver más</v-btn>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-main>

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
import { useSecurityStore } from '@/stores/useAuth'
import { useAccountStore } from '@/stores/useAccount'
import { usePaymentsStore } from '@/stores/usePayments'

const router = useRouter()
const securityStore = useSecurityStore()
const accountStore = useAccountStore()
const paymentsStore = usePaymentsStore()

const source = ref('')
const amount = ref('')
const sources = ref(['Cuenta Bancaria', 'Tarjeta de Crédito', 'Tarjeta de Débito'])
const history = ref([])

// --- estados para snackbar ---
const snackbar = ref(false)
const snackbarText = ref('')

function formatHistory() {
  // history.value = paymentsStore.payments.map(p => ({
  //   description: p.description ?? `Recarga via ${source.value}`,
  //   amount: `${p.amount >= 0 ? '+' : '-'} $${p.amount}`
  // }))
}

onMounted(async () => {
  await securityStore.initialize()
  // carga detalles de cuenta (opcional si quieres mostrar saldo)
  await accountStore.getAccountDetails()
  // carga todas las transacciones
  await paymentsStore.getAll()
  formatHistory()
})

async function depositMoney() {
  try {
    // recarga saldo en la cuenta
    await accountStore.rechargeBalance(Number(amount.value))
    // refresca historial
    await paymentsStore.getAll()
    formatHistory()
    // limpia campos
    amount.value = ''
    source.value = ''
    // muestra notificación
    snackbarText.value = 'Dinero ingresado correctamente'
    snackbar.value = true
  }
  catch (error) {
    console.error('Error depositando dinero:', error)
  }
}

function viewMore() {
  router.push('/historial-ingresos') // o la ruta que definas
}

function goBack() {
  router.push('/home')
}
</script>

<style scoped src="@/styles/IngresarDinero.css"></style>