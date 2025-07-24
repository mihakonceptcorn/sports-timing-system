import { createApp, markRaw } from 'vue'
import { createPinia } from 'pinia'
import ConfirmationService from 'primevue/confirmationservice'
import ToastService from 'primevue/toastservice'
import i18n from './i18n/i18n.js'
import PrimeVue from 'primevue/config'
import Ripple from 'primevue/ripple'
import Aura from '@primevue/themes/aura'

import App from './App.vue'
import router from './router'

import '@/assets/styles.css'

const app = createApp(App)

app.directive('ripple', Ripple)

const pinia = createPinia()
pinia.use(({ store }) => {
  store.router = markRaw(router)
})

app.use(ConfirmationService)
app.use(ToastService)
app.use(PrimeVue, {
  theme: {
    preset: Aura,
    options: {
      darkModeSelector: 'system',
    }
  },
  ripple: true
});
app.use(pinia)
app.use(router)
app.use(i18n)

app.mount('#app')
