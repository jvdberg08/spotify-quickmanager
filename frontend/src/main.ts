import Vue from 'vue'
import App from './App.vue'

import {BootstrapVue, BootstrapVueIcons} from 'bootstrap-vue';
import axios, {AxiosStatic} from 'axios'

import 'vue-class-component/hooks'

import router from './router'
import store from './store'

import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

Vue.use(BootstrapVue)
Vue.use(BootstrapVueIcons)

Vue.prototype.$axios = axios
Vue.prototype.$axios.defaults.withCredentials = true
Vue.prototype.$axios.defaults.xsrfHeaderName = 'X-CSRFToken'
Vue.prototype.$axios.defaults.xsrfCookieName = 'csrftoken'

declare module 'vue/types/vue' {
    interface Vue {
        $axios: AxiosStatic;
    }
}

new Vue({
    router,
    store,
    render: h => h(App),
}).$mount('#app')