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
                item-title="text"
                item-value="value"
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
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useSecurityStore } from '@/stores/useAuth'
import { useAccountStore } from '@/stores/useAccount'
import { usePaymentsStore } from '@/stores/usePayments'
import { useCardStore } from '@/stores/useCard'
import { storeToRefs } from 'pinia'

const router         = useRouter()
const securityStore  = useSecurityStore()
const accountStore   = useAccountStore()
const paymentsStore  = usePaymentsStore()
const cardStore      = useCardStore()
const { cards }      = storeToRefs(cardStore)

const source         = ref('')
const amount         = ref('')
const sources        = computed(() => [
  { text: 'Cuenta Bancaria', value: 'bank' },
  ...cards.value.map(c => {
    const last4 = c.last4 ?? (c.number?.slice(-4) ?? '0000')
    return {
      text: `**** **** **** ${last4}`,
      value: c.id
    }
  })
])
const history        = ref([])

const snackbar = ref(false)
const snackbarText = ref('')

onMounted(async () => {
  await securityStore.initialize()
  await accountStore.getAccountDetails()
  await paymentsStore.getAll()
  await cardStore.getAll()
  formatHistory()
})

async function depositMoney() {
  try {
    await accountStore.rechargeBalance(Number(amount.value))
    await paymentsStore.getAll()
    formatHistory()
    amount.value = ''
    source.value = ''
    snackbarText.value = 'Dinero ingresado correctamente'
    snackbar.value = true
  }
  catch (error) {
    console.error('Error depositando dinero:', error)
  }
}
</script>

<style scoped src="@/styles/IngresarDinero.css"></style>