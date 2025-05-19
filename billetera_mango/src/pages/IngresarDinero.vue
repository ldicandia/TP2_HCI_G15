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
  </v-app>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const source = ref('')
const amount = ref('')
const sources = ref(['Cuenta Bancaria', 'Tarjeta de Crédito', 'Tarjeta de Débito'])
const history = ref([
  { description: 'Ingreso desde cuenta bancaria', amount: '+ $2000' },
  { description: 'Ingreso desde tarjeta de crédito', amount: '+ $1500' },
])

function depositMoney() {
  console.log('Ingresando dinero desde:', source.value, 'Monto:', amount.value)
}

function viewMore() {
  console.log('Ver más historial')
}

function goBack() {
  router.push('/home')
}
</script>

<style scoped src="@/styles/IngresarDinero.css"></style>