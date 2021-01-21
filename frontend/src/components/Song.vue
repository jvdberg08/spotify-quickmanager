<template>
  <b-col v-bind:class="{ 'song-container-is-selected': isSelected }"
         class="song-container p-3">

    <b-row>
      <b-col cols="2" class="song-image-container">
        <b-img :src="song.track.album.images[2].url"/>
      </b-col>

      <b-col cols="8" class="pl-4">
        <b-row>
          <b-col class="song-name">
            <strong> {{ song.track.name }}</strong>
          </b-col>
        </b-row>
        <b-row>
          <b-col class="song-artists">
            {{ getArtistString(song) }}
          </b-col>
        </b-row>
      </b-col>
    </b-row>
  </b-col>
</template>

<script>
export default {
  name: "Song",

  props: {
    song: Object,
    isSelected: Boolean
  },

  methods: {
    getArtistString(songJson) {
      let artistString = ""
      for (let i = 0; i < songJson.track.artists.length; i++) {
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
</script>

<style scoped>
.song-container {
  cursor: pointer;
  text-align: center;
  border: 1px solid rgba(0, 0, 0, 0.1);
  box-sizing: border-box;
  box-shadow: 0 4px 4px rgba(0, 0, 0, 0.25);
  border-radius: 30px;
}

.song-container-is-selected {
  background-color: #3471eb80;
}

.song-name {
  text-align: left;
  font-size: 22px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.song-artists {
  text-align: left;
  font-size: 18px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.song-image-container {
  max-width: 64px;
}

.song-image-container img {
  border-radius: 15px;
}
</style>