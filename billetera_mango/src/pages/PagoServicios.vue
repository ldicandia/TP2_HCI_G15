<template>
  <v-app class="bg-dark">
    <v-main>
      <v-container>
        <v-row v-if="!selectedService">
          <v-col cols="12">
            <h1 class="text-center mb-4">Pago de Servicios</h1>
          </v-col>
        </v-row>
        <v-row v-else>
          <v-col cols="12">
            <GoBackButton @click="backToSelection" :to= "'/pago-servicios'"/>
            <h1 class="text-center mb-4">Pago de Servicios</h1>
          </v-col>
        </v-row>
        
        <!-- Transición suave entre selección y formulario -->
        <v-fade-transition>
          <!-- Selección de servicios -->
          <v-row v-if="!selectedService" key="selection">
            <v-col cols="12">
              <h3 class="text-center">Seleccione un servicio para pagar</h3>
            </v-col>
            <v-col v-for="service in services" :key="service.name" cols="4">
              <v-card class="pa-4 text-center" @click="selectService(service.name)" color="surface">
                <v-icon large>{{ service.icon }}</v-icon>
                <p class="mt-2">{{ service.name }}</p>
              </v-card>
            </v-col>
          </v-row>
          
          <!-- Formulario de pago -->
          <v-card v-else key="form" class="pa-6" color="surface">
            <h3>Pagar {{ selectedService }}</h3>
            <v-text-field label="Monto" variant="outlined" class="mt-4" />
            <v-text-field label="Referencia o Identificador" variant="outlined" class="mt-4" />
            <v-btn color="button" class="mt-4">Pagar Servicio</v-btn>
          </v-card>
        </v-fade-transition>
        
        <!-- Servicios pagados recientemente -->
        <v-card class="pa-6 mt-6" color="surface">
          <h3>Servicios Pagados Recientemente</h3>
          <p>Luz: $200 - 01/10/2023</p>
          <p>Gas: $150 - 15/09/2023</p>
        </v-card>
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup>
import { ref } from 'vue'
import GoBackButton from '@/components/GoBackButton.vue'

// Lista de servicios disponibles con íconos representativos
const services = [
  { name: 'Luz', icon: 'mdi-lightbulb' },
  { name: 'Gas', icon: 'mdi-fire' },
  { name: 'Agua', icon: 'mdi-water' },
  { name: 'Telefonia', icon: 'mdi-phone' },
  { name: 'Television', icon: 'mdi-television' },
  { name: 'Internet', icon: 'mdi-web' },
  { name: 'Impuestos', icon: 'mdi-bank' },
  { name: 'Medicina prepaga', icon: 'mdi-hospital' }
]

// Variable para almacenar el servicio seleccionado
const selectedService = ref(null)

// Función para seleccionar un servicio
function selectService(service) {
  selectedService.value = service
}

// Función para volver a la selección de servicios
function backToSelection() {
  selectedService.value = null
}
</script>