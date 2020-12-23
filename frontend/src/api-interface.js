const axios = require("axios")

export default {
    name: "ApiInterface",

    data() {
        return {
            isAuthorized: false
        }
    },

    mounted() {
        this.checkAuthorization()
    },

    methods: {
        checkAuthorization() {
            axios.get("http://127.0.0.1:8000/spotifyauth/check_session", {
                withCredentials: true
            }).then(response => {
                this.isAuthorized = response.data.session_valid === "true"
            })
        },

        getSongs(offset, limit) {
            const likedSongs = null
            axios.get("http://127.0.0.1:8000/spotifyapi/songs", {
                withCredentials: true,
                params: {offset: offset, limit: limit}
            }).then(response => {
                this.likedSongs = response.data
            })
            return likedSongs
        }
    }
}