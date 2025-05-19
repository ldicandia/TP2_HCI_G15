<template>
  <v-btn 
    icon 
    @click="navigateTo" 
    :color="color" 
    :size="size" 
    :class="customClass"
  >
    <v-icon>mdi-arrow-left</v-icon>
  </v-btn>
</template>

<script setup>
import { useRouter } from 'vue-router';

const props = defineProps({

  to: {
    type: [String, Object],
    default: '/home'
  },

  useHistory: {
    type: Boolean,
    default: false
  },

  color: {
    type: String,
    default: undefined
  },

  size: {
    type: String,
    default: undefined
  },

  customClass: {
    type: String,
    default: ''
  }
});

const router = useRouter();

function navigateTo() {
  if (props.useHistory) {
    router.go(-1);
  } else {
    router.push(props.to);
  }
}
</script>