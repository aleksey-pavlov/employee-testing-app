import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

import "bootstrap";
import "bootstrap/dist/css/bootstrap.min.css"
import "bootstrap-icons/font/bootstrap-icons.css"
import moment from './plugins/moment'; 

const app = createApp(App)

app.use(router)

app.use(moment);

app.mount('#app')

