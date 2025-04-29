<template>
    <v-app class="bg-dark">
      <v-main>
        <v-container>
          <h1 class="text-center mb-4">Pago de Servicios</h1>
          <v-card class="pa-6" color="surface">
            <h3>Pagar un Servicio</h3>
            <v-select label="Servicio" :items="['Luz', 'Gas', 'Agua']" variant="outlined" class="mt-4" />
            <v-text-field label="Monto" variant="outlined" class="mt-4" />
            <v-btn color="button" class="mt-4">Pagar Servicio</v-btn>
          </v-card>
          <v-card class="pa-6 mt-6" color="surface">
            <h3>Servicios Pagados Recientemente</h3>
            <p>Luz: $200 - 01/10/2023</p>
            <p>Gas: $150 - 15/09/2023</p>
          </v-card>
        </v-container>
      </v-main>
    </v-app>
  </template>
  
  <script setup>
  </script>