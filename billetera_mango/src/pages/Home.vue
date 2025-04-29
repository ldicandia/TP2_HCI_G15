<template>
  <v-app class="bg-dark">
    <!-- Menú lateral -->
    <v-navigation-drawer permanent color="surface" class="navigation-drawer">
      <v-list>
        <!-- Logo -->
        <v-list-item class="logo-container">
          <v-img src="/mango-logo.png" max-width="120" class="logo" />
        </v-list-item>
        <!-- Botón Inicio (seleccionado) -->
        <v-list-item>
          <v-btn block class="menu-button-selected" flat>
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
          <v-btn block class="menu-button" flat>
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
      <v-btn block class="logout-button" color="button" flat>Cerrar Sesión</v-btn>
    </v-navigation-drawer>

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
                  <h1>$1.234.567,89</h1>
                  <p>CVU:</p>
                </v-card>
              </v-col>
              <v-col cols="6">
                <v-card class="tarjetas-card" color="surface">
                  <h3>Tarjetas</h3>
                  <v-btn color="button" class="vincular-button">Vincular</v-btn>
                  <v-btn color="button" class="desvincular-button">Desvincular</v-btn>
                </v-card>
              </v-col>
            </v-row>
            <!-- Fila inferior: Botones de acción y Movimientos -->
            <v-row class="actions-row">
              <v-col cols="6" class="text-center">
                <v-btn block class="action-button" color="button">Enviar Dinero</v-btn>
                <v-btn block class="action-button" color="button">Ingresar Dinero</v-btn>
                <v-btn block class="action-button" color="button">Enlace de pago</v-btn>
              </v-col>
              <v-col cols="6">
                <v-card class="movimientos-card" color="surface">
                  <h3>Movimientos</h3>
                  <p>Steam: <span class="text-error">- $1.234,09</span></p>
                  <p>Juan: <span class="text-success">$12.234,09</span></p>
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
import { useRouter } from 'vue-router';

// Inicializamos el router para manejar la navegación
const router = useRouter();

// Función para navegar a la página de Cobros
function goToCobros() {
  router.push('/cobros');
}

// Función para navegar a la página de Pago de Servicios
function goToPagoServicios() {
  router.push('/pago-servicios');
}
</script>

<style scoped src="@/styles/Home.css"></style>