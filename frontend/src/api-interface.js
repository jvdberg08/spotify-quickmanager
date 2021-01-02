export default {
    name: "ApiInterface",

    methods: {
        checkAuthorization() {
            this.$axios.get("http://127.0.0.1:8000/spotifyauth/check_session", {
                withCredentials: true
            }).then(response => {
                return response.data.session_valid === "true"
            })
        }
    }
}