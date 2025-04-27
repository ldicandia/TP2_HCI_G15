<template>
  <v-app class="bg-dark">
    <v-navigation-drawer permanent color="surface" class="pa-1">
      <v-list>
        <v-list-item class="mb-4">
          <v-img src="/mango-logo.png" max-width="120" class="mx-auto" />
        </v-list-item>
        <v-list-item>
          <v-btn block class="mb-2" flat>
            <v-icon class="me-2">mdi-home</v-icon>
            <span>Inicio</span>
          </v-btn>
        </v-list-item>
        <v-list-item>
          <v-btn block class="mb-2" flat>
            <v-icon class="me-2">mdi-swap-horizontal</v-icon>
            <span>Movimientos</span>
          </v-btn>
        </v-list-item>
        <v-list-item>
          <v-btn block class="mb-2" flat>
            <v-icon class="me-2">mdi-credit-card</v-icon>
            <span>Tarjetas</span>
          </v-btn>
        </v-list-item>
        <v-list-item>
          <v-btn block class="mb-2" flat>
            <v-icon class="me-2">mdi-chart-line</v-icon>
            <span>Inversión y Rescate</span>
          </v-btn>
        </v-list-item>
      </v-list>
      <v-btn block class="mt-4" color="button" flat>Cerrar Sesión</v-btn>
    </v-navigation-drawer>

    <v-main>
      <v-container>
        <v-row>
          <v-col cols="12" class="pa-4">
            <v-row>
              <v-col cols="6">
                <v-card class="pa-8" color="surface">
                  <h3>Saldo Disponible</h3>
                  <h1>$1.234.567,89</h1>
                  <p>CVU:</p>
                </v-card>
              </v-col>
              <v-col cols="6">
                <v-card class="pa-12" color="surface">
                  <h3>Tarjetas</h3>
                  <v-btn color="button" class="me-2">Vincular</v-btn>
                  <v-btn color="button">Desvincular</v-btn>
                </v-card>
              </v-col>
            </v-row>
            <v-row class="mt-4">
              <v-col cols="6">
                <v-btn block class="mb-8" color="button">Enviar Dinero</v-btn>
                <v-btn block class="mb-8" color="button">Ingresar Dinero</v-btn>
                <v-btn block color="button">Enlace de pago</v-btn>
              </v-col>
              <v-col cols="6">
                <v-card class="pa-4" color="surface">
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
// No se requiere lógica adicional para esta página
</script>

<style scoped src="@/styles/Login.css"></style>