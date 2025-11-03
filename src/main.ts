import 'vuetify/styles'
import '@mdi/font/css/materialdesignicons.css'
import './assets/tailwind.css'
import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import vuetify from '@/plugins/vuetify'

const app = createApp(App)

app.use(vuetify)
app.use(createPinia())

app.mount('#app')
