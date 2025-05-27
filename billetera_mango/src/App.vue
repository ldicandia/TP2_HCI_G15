<template>
  <v-app>
    <!-- el sidebar no se agrega si estoy en las ventanas register o login-->
    <Sidebar v-if="!isAuthRoute" />
    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script setup>
import { computed } from "vue";
import { useRoute } from "vue-router";
import Sidebar from "@/components/SideBar.vue"; 

const route = useRoute();

const authRouteNames = ["Login", "Register", "Verify"]; 

const isAuthRoute = computed(() => {
  return route.name && authRouteNames.includes(route.name);
});
</script>

<style>

</style>
