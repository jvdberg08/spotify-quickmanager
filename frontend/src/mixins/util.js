export default {
    name: "ApiInterface",

    methods: {
        createErrorDialog(statusCode) {
            let message = 'An error has occurred!'

            if (statusCode === 401) {
                message = 'You are not authorized! Please try logging in again!'
                this.$store.commit('clearAuthorization')

                this.likedSongs = []
            }

            this.$bvModal.msgBoxOk(message, {
                title: 'Error ' + statusCode, size: 'sm', buttonSize: 'sm', okVariant: 'danger'
            }).then()
        }
    }
}