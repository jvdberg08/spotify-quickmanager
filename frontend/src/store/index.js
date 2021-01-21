import Vue from 'vue'
import Vuex from 'vuex'

import persistVuex from 'vuex-persistedstate'

import authorization from './modules/authorization'

Vue.use(Vuex)

const store = new Vuex.Store({
    modules: {
        authorization
    },
    plugins: [persistVuex()]
})

export default store