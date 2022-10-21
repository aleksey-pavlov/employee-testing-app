import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import "bootstrap";
import "bootstrap/dist/css/bootstrap.min.css"
import "bootstrap-icons/font/bootstrap-icons.css"
import moment from './plugins/moment'; 
import server from './plugins/server';
import Notifications from '@kyvg/vue3-notification'

const app = createApp(App)

app.use(Notifications);

app.use(server, { baseUrl: import.meta.env.VITE_SERVER_URL })

app.use(router)

app.use(moment);

app.mount('#app')



