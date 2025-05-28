<template>
  <v-app class="bg-dark">
    <v-main>
      <v-container>
        <v-row>
          <v-col cols="12" class="content">
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
                  <v-icon>mdi-cached</v-icon>
                  Generar Enlace de Pago
                </v-btn>
                <v-btn block @click="showLinkDialog = true" class="action-button" color="button">
                  <v-icon>mdi-link</v-icon>
                  Pagar con Enlace
                </v-btn>
              </v-col>
              <v-col cols="6">
                <v-card class="movimientos-card" color="surface">
                  <h3>Movimientos</h3>
                  <div v-if="payments.length">
                    <div v-for="(mov, index) in displayedPayments" :key="mov.id">
                      <p class="d-flex justify-space-between">
                        <span>
                          {{ mov.receiver.firstName }} {{ mov.receiver.lastName }}
                          <br/>
                          <small class="text-caption">{{ mov.description }}</small>
                        </span>
                        <span
                          :class="mov.pending
                            ? 'text-warning'
                            : (mov.receiver.id === account.id
                               ? 'text-success'
                               : 'text-error')"
                        >
                          {{ formatCurrency(mov.amount) }}
                        </span>
                      </p>
                      <v-divider
                        v-if="index < payments.length - 1"
                        class="my-2"
                      />
                    </div>
                    <div v-if="payments.length > 5" class="text-center mt-2">
                      <v-btn text @click="showMore = !showMore" color="button">
                        {{ showMore ? 'Ver menos' : 'Ver más' }}
                      </v-btn>
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

    <v-dialog v-model="showLinkDialog" max-width="400px">
      <v-card>
        <v-card-title>Pagar enlace de pago</v-card-title>
        <v-card-text>
          <v-form>
            <v-text-field
              v-model="linkInput"
              label="Enlace de pago"
              required
            />
            <v-select
              v-model="cardId"
              :items="cardOptions"
              item-text="name"
              item-value="id"
              label="Seleccionar tarjeta (opcional)"
              clearable
            />
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer/>
          <v-btn text @click="showLinkDialog = false">Cancelar</v-btn>
          <v-btn color="primary" @click="onPayLink">Pagar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

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
import { storeToRefs } from 'pinia'
import { useAccountStore } from '@/stores/useAccount.js'
import { useSecurityStore } from '@/stores/useAuth'
import { usePaymentsStore } from '@/stores/usePayments'
import { useCardStore } from '@/stores/useCard'

const router        = useRouter()
const accountStore  = useAccountStore()
const securityStore = useSecurityStore()
const paymentsStore = usePaymentsStore()
const cardStore    = useCardStore()

const cardSelectedId = ref(null)

const { account }   = storeToRefs(accountStore)
const { payments }  = storeToRefs(paymentsStore)
const { cards }    = storeToRefs(cardStore)

const cardOptions = computed(() =>
  cards.value.map(c => {
    const last4 = c.last4 ?? (c.number?.slice(-4) ?? '0000')
    cardSelectedId.value = c.id 
    return `${c.type} **** **** **** ${last4}`
  })
)

const showMore = ref(false)
const displayedPayments = computed(() =>
  showMore.value
    ? payments.value
    : payments.value.slice(0, 5)
)

const showDialog      = ref(false)
const showLinkDialog  = ref(false)
const paymentDescription = ref('')
const paymentAmount      = ref(null)
const linkInput        = ref('')
const cardId           = ref(null)   
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
      snackbarText.value = 'Enlace de pago copiado: ' + url
      snackbar.value     = true
    } catch (err) {
      console.error('Error copiando al portapapeles:', err)
    }
  }
  onCancel()
}

async function onPayLink() {
  try {
    const urlObj = new URL(linkInput.value)
    const uuid   = urlObj.searchParams.get('uuid')
    if (uuid) {
      const cardIdValue = cardId.value?.trim() || null
      
      await paymentsStore.pushPayment({ uuid, cardId: cardSelectedId.value })
      cardSelectedId.value = ref(null)
      snackbarText.value = 'Pago con enlace realizado'
      snackbar.value     = true
      await paymentsStore.getAll()
      await accountStore.getAccountDetails()
      linkInput.value = ''
      cardId.value    = ''
    }
  } catch (err) {
    console.error('Error procesando enlace:', err)
  } finally {
    showLinkDialog.value = false
  }
}

onMounted(async () => {
  securityStore.initialize()
  try {
    await accountStore.getAccountDetails()
    await paymentsStore.getAll()       
    await cardStore.getAll()    
  } catch (e) {
    console.error('Error al cargar datos:', e)
  }
  if (!securityStore.isLoggedIn) {
    router.push('/login')
  }
})
</script>

<style scoped src="@/styles/Home.css"></style>
