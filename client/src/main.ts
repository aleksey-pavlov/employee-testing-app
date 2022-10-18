import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import "bootstrap";
import "bootstrap/dist/css/bootstrap.min.css"
import "bootstrap-icons/font/bootstrap-icons.css"
import moment from './plugins/moment'; 

import Notifications from '@kyvg/vue3-notification'

const app = createApp(App)

app.use(router)

app.use(moment);

app.use(Notifications);

app.mount('#app')

