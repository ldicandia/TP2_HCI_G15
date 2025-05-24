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
              <h3 class="mb-4">Enviar Dinero</h3>

              <!-- NUEVO: Campo Descripción -->
              <v-text-field
                v-model="description"
                label="Descripción"
                variant="outlined"
                density="compact"
                class="mb-4"
                hide-details
                color="cyan"
              />

              <!-- Selector de método -->
              <v-radio-group v-model="method" row class="mb-4">
                <v-radio label="CVU" value="cvu" />
                <v-radio label="Email" value="email" />
                <v-radio label="Alias" value="alias" />
              </v-radio-group>

              <!-- Campo para CVU/Email/Alias -->
              <v-text-field
                v-model="recipient"
                :label="`Ingresar ${method.toUpperCase()}`"
                variant="outlined"
                density="compact"
                class="mb-4"
                hide-details
                color="cyan"
              />

              <!-- Campo para cantidad -->
              <v-text-field
                v-model="amount"
                label="Cantidad"
                variant="outlined"
                density="compact"
                type="number"
                class="mb-4"
                hide-details
                color="cyan"
              />

              <v-btn block color="button" @click="sendMoney">Enviar</v-btn>
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
  </v-app>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useSecurityStore } from '@/stores/useAuth'
import { usePaymentsStore } from '@/stores/usePayments'

const router = useRouter()
const securityStore = useSecurityStore()
const paymentsStore = usePaymentsStore()

const recipient = ref('')
const amount = ref('')
const method = ref('cvu')
const description = ref('')      // <--- nueva ref
const history = ref([])

// Al montar, carga el historial desde la API
onMounted(async () => {
  await securityStore.initialize()
  await paymentsStore.getAll()
})

async function sendMoney() {
  try {
    // incluimos description
    const paymentData = {
      amount: Number(amount.value),
      description: description.value || `Pago a ${recipient.value}`
    }

    let result
    if (method.value === 'cvu') {
      result = await paymentsStore.transferByCvu(recipient.value, paymentData)
    }
    else if (method.value === 'email') {
      result = await paymentsStore.transferByEmail(recipient.value, paymentData)
    }
    else {
      result = await paymentsStore.transferByAlias(recipient.value, paymentData)
    }

    // limpia campos
    recipient.value = ''
    amount.value = ''
    description.value = ''    // <---- limpiar descripción
  }
  catch (error) {
    console.error('Error enviando dinero:', error)
  }
}

function viewMore() {
  // Navegar a una página de historial completo o cargar más
  router.push('/historial-pagos')
}

function goBack() {
  router.push('/home')
}
</script>

<style scoped src="@/styles/Home.css"></style>