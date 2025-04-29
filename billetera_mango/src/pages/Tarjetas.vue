<!-- ventana que me muestra la lista de mis tarjetas, con una opcion para desvincular cada una
 tmn hay una opcion para vincular una nueva tarjeta

 los botones "vincular" y "desvincular" de la pagina de inicio tmbn deberia entrar directamente a esas opciones-->

<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <h2 class="mb-4">Mis Tarjetas</h2>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12">
        <v-btn color="button" @click="dialog = true" class="mb-4">
          <v-icon left>mdi-plus-circle-outline</v-icon>
          Vincular Nueva Tarjeta
        </v-btn>
      </v-col>
    </v-row>

    <v-row v-if="cards.length > 0">
      <v-col
        v-for="(card, index) in cards"
        :key="index"
        cols="12"
        sm="6"
        md="4"
      >
        <v-card class="mb-4 card-display" elevation="2">
          <v-img
            :src="getCardImage(card.type)"
            :alt="`${card.type || 'Tarjeta'} logo`"
            height="180px"
            cover
            class="card-image"
          >
            <div class="card-overlay-text">Terminada en {{ card.last4 }}</div>
          </v-img>

          <v-card-actions class="card-actions">
            <span class="card-type-text">{{ card.type }}</span>
            <v-spacer></v-spacer>
            <v-btn
              color="error"
              icon="mdi-delete"
              variant="text"
              size="small"
              @click="removeCard(index)"
              aria-label="Desvincular tarjeta"
            ></v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
    <v-row v-else>
      <v-col cols="12">
        <v-alert type="info" variant="tonal">
          Aún no tienes tarjetas vinculadas.
        </v-alert>
      </v-col>
    </v-row>

    <!-- Dialogo para agregar nueva tarjeta -->
    <v-dialog v-model="dialog" persistent max-width="600px">
      <v-card>
        <v-card-title class="d-flex align-center">
          <!-- --- Back Arrow Button --- -->
          <v-btn
            icon="mdi-arrow-left"
            variant="text"
            @click="closeDialog"
            class="mr-2"
            aria-label="Cancelar y cerrar diálogo"
            color="button"
          ></v-btn>

          <!-- --- Title --- -->
          <span class="text-h5">Vincular Nueva Tarjeta</span>
        </v-card-title>
        <v-card-text>
          <!-- Image Preview Row -->
          <v-row justify="center" class="mb-4">
            <v-col cols="auto">
              <v-img
                :src="getCardImage(newCard.type)"
                :alt="`${newCard.type || 'Tarjeta'} logo preview`"
                height="150px"
                width="180px"
                contain
                class="card-preview-image"
              ></v-img>
            </v-col>
          </v-row>

          <v-container>
            <v-form ref="form">
              <v-row>
                <v-col cols="12">
                  <v-select
                    label="Tipo de Tarjeta*"
                    v-model="newCard.type"
                    :items="[
                      'Visa Débito',
                      'Visa Crédito',
                      'Mastercard Débito',
                      'Mastercard Crédito',
                      'American Express',
                      'Otra',
                    ]"
                    required
                    :rules="[rules.required]"
                  ></v-select>
                </v-col>
                <v-col cols="12">
                  <v-text-field
                    label="Número de Tarjeta*"
                    v-model="newCard.number"
                    required
                    :rules="[rules.required, rules.cardNumber]"
                    maxlength="19"
                    placeholder="XXXX XXXX XXXX XXXX"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="6">
                  <v-text-field
                    label="Fecha de Vencimiento*"
                    v-model="newCard.expiry"
                    required
                    :rules="[rules.required, rules.expiryDate]"
                    placeholder="MM/AA"
                    maxlength="5"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="6">
                  <v-text-field
                    label="Código de Seguridad (CVV)*"
                    v-model="newCard.cvv"
                    required
                    :rules="[rules.required, rules.cvv]"
                    type="password"
                    maxlength="4"
                    placeholder="XXX o XXXX"
                  ></v-text-field>
                </v-col>
                <v-col cols="12">
                  <v-text-field
                    label="Nombre del Titular*"
                    v-model="newCard.name"
                    required
                    :rules="[rules.required]"
                  ></v-text-field>
                </v-col>
              </v-row>
            </v-form>
          </v-container>
          <small>*Campos obligatorios</small>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn color="button" variant="text" @click="addCard">
            Guardar Tarjeta
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup>
// Import the composable function
import { useTarjetasLogic } from "@/composables/Tarjetas.js"; // Adjust path if needed

// Call the composable and destructure the returned state and methods
const {
  dialog,
  form, // Destructure the ref
  cards,
  newCard,
  rules,
  getCardImage,
  addCard,
  removeCard,
  closeDialog,
} = useTarjetasLogic();

// No other JavaScript needed here unless you have component-specific logic
// that doesn't belong in the composable.
</script>

<style scoped src="@/styles/Tarjetas.css"></style>
