<template>
    <v-app class="bg-dark">
      <v-main>
        <v-container>
          <h1 class="text-center mb-4">Cobros</h1>
          <v-card class="pa-6" color="surface">
            <h3>Realizar un Cobro</h3>
            <v-text-field label="Monto" variant="outlined" class="mt-4" />
            <v-text-field label="Descripción" variant="outlined" class="mt-4" />
            <v-btn color="button" class="mt-4">Realizar Cobro</v-btn>
          </v-card>
          <v-card class="pa-6 mt-6" color="surface">
            <h3>Cobros Recientes</h3>
            <p>Cobro 1: $1000 - Descripción ejemplo</p>
            <p>Cobro 2: $500 - Otro cobro</p>
          </v-card>
        </v-container>
      </v-main>
    </v-app>
  </template>
  
  <script setup>
  </script>