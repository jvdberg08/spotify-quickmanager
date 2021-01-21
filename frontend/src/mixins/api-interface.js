export default {
    name: "ApiInterface",

    data() {
        return {
            isAuthorized: false
        }
    },

    methods: {
        async checkAuthorization(silent) {
            await this.$axios.get("http://127.0.0.1:8000/spotifyauth/check_session", {
                withCredentials: true
            }).then(() => this.isAuthorized = true).catch(error => {
                if (!silent) {
                    this.createErrorDialog(error.response.status)
                }
            })
            return this.isAuthorized
        },

        clearAuthorization() {
            this.$axios.get('http://127.0.0.1:8000/spotifyauth/un_authorize', { // TODO post
                withCredentials: true
            }).then(() => this.isAuthorized = false).catch(error => this.createErrorDialog(error.response.status))
        },

        createErrorDialog(statusCode) {
            const message = statusCode === 401 ? 'You are not authorized! Please try logging in again!' : 'An error has occurred!'
            this.$bvModal.msgBoxOk(message, {
                title: 'Error ' + statusCode, size: 'sm', buttonSize: 'sm', okVariant: 'danger'
            }).then()
        }
    }
}