<template>
  <v-navigation-drawer permanent color="surface" class="navigation-drawer">
    <v-list>
      <v-list-item
        class="logo-container"
        pa-0
        d-flex
        justify-right
        @click="goToHome"
      >
        <v-img :src="mangoLogo" max-width="120" class="logo mx-auto" />
      </v-list-item>
      <v-list-item>
        <v-btn block class="menu-button-selected" flat @click="goToHome">
          <v-icon class="icon">mdi-home</v-icon>
          <span>Inicio</span>
        </v-btn>
      </v-list-item>
      <v-list-item>
        <v-btn block class="menu-button" flat @click="goToTarjetas">
          <v-icon class="icon">mdi-credit-card</v-icon>
          <span>Tarjetas</span>
        </v-btn>
      </v-list-item>
      <v-list-item>
        <v-btn block class="menu-button" flat @click="goToPagoServicios">
          <v-icon class="icon">mdi-receipt</v-icon>
          <span>Pago de Servicios</span>
        </v-btn>
      </v-list-item>
    </v-list>
    <v-btn block @click="goToLogin" class="logout-button" color="button" flat>Cerrar Sesión</v-btn>
  </v-navigation-drawer>
</template>

<script setup>
import { useRouter } from "vue-router";
import mangoLogo from "@/assets/mango-logo.png";
import { useSecurityStore } from "@/stores/useAuth";

const router = useRouter();
const securityStore = useSecurityStore();

function goToHome() {
  router.push("/Home");
}

function goToTarjetas() {
  router.push("/Tarjetas");
}

function goToPagoServicios() {
  router.push("/pago-servicios");
}

function goToLogin() {
  securityStore.logout();
  router.push("/login");
}

</script>

<style scoped>
.navigation-drawer {
  text-align: left; 
  padding: 16px 12px;
}

.logo-container {
  justify-content: flex-start; 
}

.menu-button,
.menu-button-selected {
  justify-content: flex-start; 
}

.logout-button {
  justify-content: center;
}
.icon {
  margin-right: 8px;
}
</style>
