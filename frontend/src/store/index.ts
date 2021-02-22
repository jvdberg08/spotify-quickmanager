import Vue from 'vue'
import Vuex from 'vuex'

import persistVuex from 'vuex-persistedstate'

Vue.use(Vuex)

const store = new Vuex.Store({

    state: {
        authExpiry: -1,
        isLoading: false
    },

    mutations: {
        setAuthorization(state, authExpiry: number) {
            state.authExpiry = authExpiry
        },

        clearAuthorization(state) {
            state.authExpiry = -1
        },

        setIsLoading(state, isLoading: boolean) {
            state.isLoading = isLoading
        }
    },

    getters: {
        checkAuthorization(state) {
            return state.authExpiry > new Date().getTime()
        },

        isLoading(state) {
            return state.isLoading
        }
    },

    plugins: [persistVuex()]
})

export default store