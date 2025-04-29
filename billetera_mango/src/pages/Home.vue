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
                  <h1>$1.234.567,89</h1>
                  <p>CVU:</p>
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
import { useRouter } from 'vue-router'

const router = useRouter()

function goEnviarDinero() {
  router.push('/enviar-dinero')
}

function goIngresarDinero() {
  router.push('/ingresar-dinero')
}
</script>

<style scoped src="@/styles/Home.css"></style>
