export default {
    name: "ApiInterface",

    data() {
        return {
            isAuthorized: false
        }
    },

    methods: {
        async checkAuthorization() {
            this.$axios.get("http://127.0.0.1:8000/spotifyauth/check_session", {
                withCredentials: true
            }).then(response => {
                this.isAuthorized = response.data.session_valid === "true"
                return response.data.session_valid === "true"
            })
        }
    }
}