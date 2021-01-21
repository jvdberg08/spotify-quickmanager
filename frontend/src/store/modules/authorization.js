const state = {
    authExpiry: -1
}

const mutations = {
    setAuthorization(state, authExpiry) {
        state.authExpiry = authExpiry
    },

    clearAuthorization(state) {
        state.authExpiry = -1
    }
}

const getters = {
    checkAuthorization(state) {
        return state.authExpiry > new Date().getTime()
    }
}

export default {
    state,
    mutations,
    getters
}