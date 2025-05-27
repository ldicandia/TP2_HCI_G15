import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router"; // Import useRouter if needed for navigation/replace
import { useSecurityStore } from "@/stores/useAuth";
import { useCardStore } from "@/stores/useCard";

// --- Import card images ---
import visaLogo from "@/assets/Tarjetas/Visa.png";
import mastercardLogo from "@/assets/Tarjetas/MasterCard.png";
import amexLogo from "@/assets/Tarjetas/Amex.avif";
import genericCardLogo from "@/assets/Tarjetas/generic.jpg";

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
  const cardStore = useCardStore(); // Assuming this is a Pinia store for card management
  const route = useRoute();
  const router = useRouter(); // Get router instance if needed for replace

  // Helper para recalcular last4 y re-sincronizar cards
  const syncCards = () => {
    cards.value = cardStore.cards.map((c) => ({
      ...c,
      last4: c.last4 ?? (c.number?.slice(-4) || ""),
    }));
  };

  // --- Lifecycle Hook ---
  onMounted(async () => {
    securityStore.initialize();
    // Load cards from API
    await cardStore.getAll();
    syncCards(); // <— asigno last4 tras la carga

    if (route.query.action === "add") {
      dialog.value = true;
    }
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
      // Requiere formato MM/YY (con slash obligatorio)
      const pattern = /^(0[1-9]|1[0-2])\/([0-9]{2})$/;
      if (!pattern.test(value)) return "Formato inválido (MM/YY).";
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
  // const getCardImage = (type) => {
  //   if (!type) return genericCardLogo;
  //   const lowerType = type.toLowerCase();
  //   if (lowerType.includes("visa")) return visaLogo;
  //   if (lowerType.includes("mastercard")) return mastercardLogo;
  //   if (lowerType.includes("american express")) return amexLogo;
  //   return genericCardLogo;
  // };

  const getCardImage = (cardNumber) => {
    // Changed parameter to cardNumber
    if (
      !cardNumber ||
      typeof cardNumber !== "string" ||
      cardNumber.length === 0
    ) {
      return genericCardLogo;
    }

    const firstDigit = cardNumber.charAt(0);

    if (firstDigit === "3") {
      return amexLogo;
    } else if (firstDigit === "4") {
      return visaLogo;
    } else if (firstDigit === "5") {
      return mastercardLogo;
    } else {
      return genericCardLogo;
    }
  };

  // --- Helper to map UI type to API type ---
  const getApiCardType = (uiType) => {
    if (!uiType) return null;
    return uiType.toLowerCase().includes("crédito") ? "CREDIT" : "DEBIT";
  };

  // --- Methods ---
  const addCard = async () => {
    if (!form.value) return;
    const { valid } = await form.value.validate();
    if (!valid) return;
    const plainNumber = newCard.value.number.replace(/\s/g, "");
    const apiType = getApiCardType(newCard.value.type);
    // Llamada a la API con el tipo corregido
    const created = await cardStore.add({
      number: plainNumber,
      fullName: newCard.value.name,
      cvv: newCard.value.cvv,
      expirationDate: newCard.value.expiry,
      type: apiType,
    });
    created.last4 = created.number.slice(-4);
    syncCards(); // <— reasigno tras el alta
    closeDialog();
  };

  const removeCard = async (index) => {
    const card = cards.value[index];
    if (!card.id) return;
    await cardStore.remove(card.id);
    syncCards(); // <— reasigno tras la baja
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
