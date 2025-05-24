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
                  <v-list>
                    <v-list-item
                      v-for="(mov, idx) in payments"
                      :key="idx"
                    >
                      <v-list-item-content>
                        <v-list-item-title>
                          {{ mov.description ?? mov.type }}
                        </v-list-item-title>
                        <v-list-item-subtitle
                          :class="mov.amount < 0 ? 'text-error' : 'text-success'"
                        >
                          {{ mov.amount != null
                              ? `${mov.amount < 0 ? '-' : '+'} $${Math.abs(Number(mov.amount))
                                  .toLocaleString('es-AR',{ minimumFractionDigits: 2 })}`
                              : '' }}
                        </v-list-item-subtitle>
                      </v-list-item-content>
                    </v-list-item>
                  </v-list>
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
import { usePaymentsStore } from '@/stores/usePayments'
import { onMounted } from 'vue'
import { storeToRefs } from 'pinia'

const router         = useRouter()
const accountStore   = useAccountStore()
const securityStore  = useSecurityStore()
const paymentsStore  = usePaymentsStore()
const { account }    = storeToRefs(accountStore)
const { payments }   = storeToRefs(paymentsStore)

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
    await paymentsStore.getAll({
      page: 1,
      direction: 'DESC',    // 'ASC' o 'DESC'
      range: 'THREE_DAYS',  // 'THREE_DAYS' | 'LAST_WEEK' | 'LAST_MONTH'
    })

    console.log('payments', paymentsStore.payments)

  } catch (e) {
    console.error('No pudo cargar datos:', e)
  }
  if (!securityStore.isLoggedIn) {
    router.push('/login')
  }
})
</script>

<style scoped src="@/styles/Home.css"></style>
