// Import styles in correct order to avoid conflicts
// 1. Vuetify base styles (must come first)
import 'vuetify/styles'
// 2. Material Design Icons styles
import '@mdi/font/css/materialdesignicons.css'
// 3. Tailwind CSS (after Vuetify to allow Tailwind utilities to override when needed)
import './assets/tailwind.css'
// 4. Application custom styles
import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import vuetify from '@/plugins/vuetify'

const app = createApp(App)

app.use(vuetify)
app.use(createPinia())

app.mount('#app')
