import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import vuetify from './plugins/vuetify' // o como hayas configurado Vuetify

const pinia = createPinia()

createApp(App).use(router).use(vuetify).use(pinia).mount('#app')
