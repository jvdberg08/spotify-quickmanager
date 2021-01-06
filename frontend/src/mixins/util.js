export default {
    name: "Util",

    methods: {
        getArtistString(songJson) {
            let artistString = ""
            for (let i=0; i<songJson.track.artists.length; i++) {
                const artistJson = songJson.track.artists[i]
                if (artistString === "") {
                    artistString = artistJson.name
                } else {
                    artistString = artistString + ", " + artistJson.name
                }
            }
            return artistString;
        }
    }
}