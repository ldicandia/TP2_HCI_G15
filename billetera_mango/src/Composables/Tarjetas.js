import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router"; // Import useRouter if needed for navigation/replace
import { useSecurityStore } from "@/stores/useAuth";

// --- Import card images ---
import visaLogo from "@/assets/Tarjetas/Visa.png";
import mastercardLogo from "@/assets/Tarjetas/MasterCard.png";
import amexLogo from "@/assets/Tarjetas/AmericanExpress.jpg";
import genericCardLogo from "@/assets/Tarjetas/Generic.png";

export function useTarjetasLogic() {
  // --- State ---
  const dialog = ref(false);
  const form = ref(null); // This ref needs to be connected in the component template
  const cards = ref([]);
  const newCard = ref({
    number: "",
    expiry: "",
    cvv: "",
    name: "",
    type: null,
    last4: "",
  });

  const securityStore = useSecurityStore(); // Assuming this is a Pinia store for authentication/security
  const route = useRoute();
  const router = useRouter(); // Get router instance if needed for replace

  // --- Lifecycle Hook ---
  onMounted(async () => {
    securityStore.initialize(); // Initialize security store if needed
    if (route.query.action === "add") {
      dialog.value = true;
      // Optional: Remove query param
      // router.replace({ query: { ...route.query, action: undefined } });
    }
    // Fetch actual cards logic would go here
  });

  // --- Validation Rules ---
  const rules = {
    required: (value) => !!value || "Campo requerido.",
    cardNumber: (value) => {
      if (!value) return true;
      const pattern = /^[0-9]{4}\s?[0-9]{4}\s?[0-9]{4}\s?[0-9]{4}$/;
      return pattern.test(value) || "Número de tarjeta inválido (16 dígitos).";
    },
    expiryDate: (value) => {
      if (!value) return true;
      const pattern = /^(0[1-9]|1[0-2])\/?([0-9]{2})$/;
      if (!pattern.test(value)) return "Formato inválido (MM/AA).";
      const [month, year] = value.split("/");
      const expiryDate = new Date(`20${year}`, month - 1);
      const currentDate = new Date();
      currentDate.setDate(1);
      currentDate.setHours(0, 0, 0, 0);
      if (expiryDate < currentDate) {
        return "La tarjeta está vencida.";
      }
      return true;
    },
    cvv: (value) => {
      if (!value) return true;
      const pattern = /^[0-9]{3,4}$/;
      return pattern.test(value) || "CVV inválido (3 o 4 dígitos).";
    },
  };

  // --- Helper function to get card image ---
  const getCardImage = (type) => {
    if (!type) return genericCardLogo;
    const lowerType = type.toLowerCase();
    if (lowerType.includes("visa")) return visaLogo;
    if (lowerType.includes("mastercard")) return mastercardLogo;
    if (lowerType.includes("american express")) return amexLogo;
    return genericCardLogo;
  };

  // --- Methods ---
  const addCard = async () => {
    // Note: form.value here refers to the ref defined *within this composable*.
    // It needs to be correctly bound in the component template.
    if (!form.value) return;
    const { valid } = await form.value.validate();

    if (valid) {
      const cardNumberClean = newCard.value.number.replace(/\s/g, "");
      newCard.value.last4 = cardNumberClean.slice(-4);
      cards.value.push({ ...newCard.value });
      closeDialog();
    }
  };

  const removeCard = (index) => {
    cards.value.splice(index, 1);
  };

  const closeDialog = () => {
    dialog.value = false;
    if (form.value) {
      form.value.resetValidation();
      form.value.reset();
    }
    newCard.value = {
      number: "",
      expiry: "",
      cvv: "",
      name: "",
      type: null,
      last4: "",
    };
    // Optional: Remove query param on close
    // router.replace({ query: { ...route.query, action: undefined } });
  };

  // --- Return values needed by the component template ---
  return {
    dialog,
    form, // Return the ref itself
    cards,
    newCard,
    rules,
    getCardImage,
    addCard,
    removeCard,
    closeDialog,
  };
}
