<template>
  <v-app class="bg-dark">
    <v-navigation-drawer permanent color="surface" class="navigation-drawer">
      <v-list>
        <v-list-item class="logo-container">
          <v-img src="/mango-logo.png" max-width="120" class="logo" />
        </v-list-item>
        <v-list-item>
          <v-btn block class="menu-button-selected" flat>
            <v-icon class="icon">mdi-home</v-icon>
            <span>Inicio</span>
          </v-btn>
        </v-list-item>
        <v-list-item>
          <v-btn block class="menu-button" flat>
            <v-icon class="icon">mdi-swap-horizontal</v-icon>
            <span>Movimientos</span>
          </v-btn>
        </v-list-item>
        <v-list-item>
          <v-btn block class="menu-button" flat>
            <v-icon class="icon">mdi-credit-card</v-icon>
            <span>Tarjetas</span>
          </v-btn>
        </v-list-item>
        <v-list-item>
          <v-btn block class="menu-button" flat>
            <v-icon class="icon">mdi-chart-line</v-icon>
            <span>Inversión y Rescate</span>
          </v-btn>
        </v-list-item>
      </v-list>
      <v-btn block class="logout-button" color="button" flat>Cerrar Sesión</v-btn>
    </v-navigation-drawer>

    <v-main>
      <v-container>
        <v-row>
          <v-col cols="12" class="content">
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

</script>

<style scoped src="@/styles/Home.css"></style>