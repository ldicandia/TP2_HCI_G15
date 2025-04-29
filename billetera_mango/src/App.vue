// filepath: src/App.vue (or your main layout file)
<template>
  <v-app>
    <Sidebar />
    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script setup>
import Sidebar from "@/components/Sidebar.vue"; // Adjust path if needed
</script>

<style>
/* Global styles or layout-specific styles */
</style>
