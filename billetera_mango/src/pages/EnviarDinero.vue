<template>
  <v-app class="bg-dark">
    <!-- Main Content -->
    <v-main>
      <v-container>
        <v-row>
          <v-col cols="12">
            <v-btn icon @click="goBack">
              <v-icon>mdi-arrow-left</v-icon>
            </v-btn>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12" md="6">
            <v-card class="pa-4" color="surface">
              <h3 class="mb-4">Enviar Dinero</h3>
              <v-text-field
                v-model="cvu"
                label="Ingresar CVU o CBU"
                variant="outlined"
                density="compact"
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
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const cvu = ref('')
const history = ref([
  { description: 'Pago a Juan', amount: '- $500' },
  { description: 'Transferencia recibida', amount: '+ $1000' },
])

function sendMoney() {
  console.log('Enviando dinero a:', cvu.value)
}

function viewMore() {
  console.log('Ver más historial')
}

function goBack() {
  router.push('/home')
}
</script>

<style scoped src="@/styles/Home.css"></style>