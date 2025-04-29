<!-- Side bar para dejar fija en cada ventana de la web-->

<template>
  <!-- Menú lateral -->
  <v-navigation-drawer permanent color="surface" class="navigation-drawer">
    <v-list>
      <!-- Logo -->
      <v-list-item
        class="logo-container"
        pa-0
        d-flex
        justify-right
        @click="goToHome"
      >
        <v-img src="/mango-logo.png" max-width="120" class="logo mx-auto" />
      </v-list-item>
      <!-- Botón Inicio (seleccionado) -->
      <v-list-item>
        <v-btn block class="menu-button-selected" flat @click="goToHome">
          <v-icon class="icon">mdi-home</v-icon>
          <span>Inicio</span>
        </v-btn>
      </v-list-item>
      <!-- Botón Movimientos -->
      <v-list-item>
        <v-btn block class="menu-button" flat>
          <v-icon class="icon">mdi-swap-horizontal</v-icon>
          <span>Movimientos</span>
        </v-btn>
      </v-list-item>
      <!-- Botón Tarjetas -->
      <v-list-item>
        <v-btn block class="menu-button" flat @click="goToTarjetas">
          <v-icon class="icon">mdi-credit-card</v-icon>
          <span>Tarjetas</span>
        </v-btn>
      </v-list-item>
      <!-- Botón Inversión y Rescate -->
      <v-list-item>
        <v-btn block class="menu-button" flat>
          <v-icon class="icon">mdi-chart-line</v-icon>
          <span>Inversión y Rescate</span>
        </v-btn>
      </v-list-item>
      <!-- Botón Cobros -->
      <v-list-item>
        <v-btn block class="menu-button" flat @click="goToCobros">
          <v-icon class="icon">mdi-currency-usd</v-icon>
          <span>Cobros</span>
        </v-btn>
      </v-list-item>
      <!-- Botón Pago de Servicios -->
      <v-list-item>
        <v-btn block class="menu-button" flat @click="goToPagoServicios">
          <v-icon class="icon">mdi-receipt</v-icon>
          <span>Pago de Servicios</span>
        </v-btn>
      </v-list-item>
    </v-list>
    <!-- Botón Cerrar Sesión -->
    <v-btn block @click="goToLogin" class="logout-button" color="button" flat>Cerrar Sesión</v-btn>
  </v-navigation-drawer>
</template>

<script setup>
import { useRouter } from "vue-router";

// Inicializamos el router para manejar la navegación
const router = useRouter();

// Función para navegar a la página de Inicio
function goToHome() {
  router.push("/Home");
}

// Función para navegar a la página de Tarjetas
function goToTarjetas() {
  router.push("/Tarjetas");
}

// Función para navegar a la página de Cobros
function goToCobros() {
  router.push("/cobros");
}

// Función para navegar a la página de Pago de Servicios
function goToPagoServicios() {
  router.push("/pago-servicios");
}

function goToLogin() {
  router.push("/login");
}

</script>

<style scoped>
.navigation-drawer {
  text-align: left; /* Asegura que el texto esté alineado a la izquierda */
}

.logo-container {
  justify-content: flex-start; /* Alinea el logo a la izquierda */
}

.menu-button,
.menu-button-selected {
  justify-content: flex-start; /* Alinea los botones a la izquierda */
}

.logout-button {
  justify-content: flex-start; /* Alinea el botón de cerrar sesión a la izquierda */
}
</style>
