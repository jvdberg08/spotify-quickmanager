export default {
    name: "ApiInterface",

    data() {
        return {
            isAuthorized: false,
            likedSongs: []
        }
    },

    mounted() {
        this.checkAuthorization()
    },

    methods: {
        checkAuthorization() {
            this.$axios.get("http://127.0.0.1:8000/spotifyauth/check_session", {
                withCredentials: true
            }).then(response => {
                this.isAuthorized = response.data.session_valid === "true"
            })
        },

        getSongs(offset, limit) {
            this.$axios.get("http://127.0.0.1:8000/spotifyapi/songs", {
                withCredentials: true,
                params: {offset: offset, limit: limit}
            }).then(response => {
                this.likedSongs = response.data
            })
        },

        deleteSongs(songs) {
            const songsString = songs.join()
            songs = []
            this.$axios.get('http://127.0.0.1:8000/spotifyapi/delete_songs', { // TODO post requst
                withCredentials: true,
                params: {ids: songsString}
            }).then(() => {
                this.likedSongs.pop()
            })
        }
    }
}