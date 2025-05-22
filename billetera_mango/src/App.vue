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
import Sidebar from "@/components/SideBar.vue"; // Adjust path if needed

const route = useRoute();

// Define the names of routes where the sidebar should NOT be shown
const authRouteNames = ["Login", "Register", "Verify"]; // Add 'Register' if you have it

// Computed property to check if the current route is an authentication route
const isAuthRoute = computed(() => {
  // Check if route.name exists and is included in the authRouteNames array
  return route.name && authRouteNames.includes(route.name);
});
</script>

<style>
/* Global styles or layout-specific styles */
</style>
