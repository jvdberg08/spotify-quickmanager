import Vue from 'vue'
import VueCookies from 'vue-cookies'
import BootstrapVue from 'bootstrap-vue';
import axios from 'axios'

import App from './App.vue'
import router from './router'

import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

Vue.use(VueCookies)
Vue.use(BootstrapVue)

Vue.prototype.$axios = axios

Vue.config.productionTip = false

new Vue({
    router,
    render: h => h(App),
}).$mount('#app')