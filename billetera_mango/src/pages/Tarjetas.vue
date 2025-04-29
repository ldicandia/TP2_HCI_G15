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
import { ref } from "vue";

// --- Import card images (adjust paths if your structure is different) ---
import visaLogo from "@/assets/Tarjetas/Visa.png"; // Using @ alias
import mastercardLogo from "@/assets/Tarjetas/MasterCard.png";
import amexLogo from "@/assets/Tarjetas/AmericanExpress.jpg"; // Corrected extension if it's jpg
import genericCardLogo from "@/assets/Tarjetas/Generic.png"; // Fallback for 'Otra' or unknown

// --- State ---
const dialog = ref(false); // Controls the visibility of the add card dialog
const form = ref(null); // Reference to the form for validation

// Dummy data for existing cards - replace with actual data fetching later
const cards = ref([]);

// Data for the new card being added
const newCard = ref({
  number: "",
  expiry: "",
  cvv: "",
  name: "",
  type: null, // Initialize type as null
  last4: "", // Will be calculated
});

// --- Validation Rules ---
const rules = {
  required: (value) => !!value || "Campo requerido.",
  cardNumber: (value) => {
    if (!value) return true; // Don't validate if empty, required rule handles that
    const pattern = /^[0-9]{4}\s?[0-9]{4}\s?[0-9]{4}\s?[0-9]{4}$/; // Basic format check
    return pattern.test(value) || "Número de tarjeta inválido (16 dígitos).";
  },
  expiryDate: (value) => {
    if (!value) return true;
    const pattern = /^(0[1-9]|1[0-2])\/?([0-9]{2})$/; // MM/YY format
    if (!pattern.test(value)) return "Formato inválido (MM/AA).";
    // Optional: Add check for expiry date being in the future
    const [month, year] = value.split("/");
    const expiryDate = new Date(`20${year}`, month - 1); // Month is 0-indexed
    const currentDate = new Date();
    currentDate.setDate(1); // Set to first day of current month for comparison
    currentDate.setHours(0, 0, 0, 0);
    // Check if expiry month is before current month in the same year, or if year is past
    if (expiryDate < currentDate) {
      return "La tarjeta está vencida.";
    }
    return true;
  },
  cvv: (value) => {
    if (!value) return true;
    const pattern = /^[0-9]{3,4}$/; // 3 or 4 digits
    return pattern.test(value) || "CVV inválido (3 o 4 dígitos).";
  },
};

// --- Helper function to get card image ---
const getCardImage = (type) => {
  if (!type) return genericCardLogo; // Default to generic when type is null or empty
  const lowerType = type.toLowerCase();
  if (lowerType.includes("visa")) return visaLogo;
  if (lowerType.includes("mastercard")) return mastercardLogo;
  if (lowerType.includes("american express")) return amexLogo;
  return genericCardLogo; // Default for 'Otra' or if type is missing/unknown
};

// --- Methods ---
const addCard = async () => {
  if (!form.value) return; // Ensure form ref is available
  const { valid } = await form.value.validate(); // Validate the form

  if (valid) {
    // Calculate last 4 digits (remove spaces first)
    const cardNumberClean = newCard.value.number.replace(/\s/g, "");
    newCard.value.last4 = cardNumberClean.slice(-4);

    // Add the new card to the list (in a real app, send this to the backend)
    cards.value.push({ ...newCard.value });

    closeDialog(); // Close the dialog and reset the form
  }
};

const removeCard = (index) => {
  // Add confirmation dialog here if desired
  cards.value.splice(index, 1);
  // In a real app, call an API to remove the card from the backend
};

const closeDialog = () => {
  dialog.value = false;
  if (form.value) {
    // Check if form exists before resetting
    form.value.resetValidation(); // Reset validation state
    form.value.reset(); // Reset form fields
  }
  // Reset the new card object manually as well, just in case reset doesn't clear v-model
  newCard.value = {
    number: "",
    expiry: "",
    cvv: "",
    name: "",
    type: null, // Reset type to null
    last4: "",
  };
};
</script>

<style scoped>
.card-preview-image {
  border: 1px solid rgba(var(--v-border-color), 0.3); /* Optional: add a light border */
  border-radius: 8px; /* Optional: round corners */
  background-color: #eee; /* Light background for images with transparency */
}

.card-display {
  position: relative; /* Needed for absolute positioning of overlay */
}

.card-image {
  border-radius: inherit; /* Inherit border radius from v-card */
  /* You might need to adjust background properties if images have transparency */
}

.card-overlay-text {
  position: absolute;
  bottom: 8px; /* Position at the bottom */
  left: 16px; /* Add some padding */
  color: white; /* Or a contrasting color */
  background-color: rgba(0, 0, 0, 0.5); /* Semi-transparent background */
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 0.9em;
  font-weight: bold;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.7); /* Text shadow for readability */
}

.card-actions {
  padding: 8px 16px; /* Adjust padding */
  background-color: rgba(
    var(--v-theme-surface),
    0.8
  ); /* Optional: slight background */
}

.card-type-text {
  font-size: 0.9em;
  color: rgba(
    var(--v-theme-on-surface),
    var(--v-medium-emphasis-opacity)
  ); /* Use theme color */
  flex-grow: 1; /* Allow text to take available space */
  text-align: left;
}

/* Remove default list item styling if previously added */
.v-list-item {
  border: none;
  padding: 0;
  margin-bottom: 0;
}
</style>
