<template>
  <b-col v-if="likedSongs != null" class="songs-container py-3 px-0 px-sm-5 ">
    <b-row class="text-center" align-h="center">
      <b-col cols="3" md="2">
        <b-btn class="song-menu-button" size="lg" variant="outline-primary"
               v-on:click="getSongs(offset-24, limit-24)">
          Previous
        </b-btn>
      </b-col>
      <b-col cols="3" md="2">
        <b-btn class="song-menu-button" size="lg" variant="outline-danger" v-on:click="deleteSongs(selectedSongs)">
          Delete Selected
        </b-btn>
      </b-col>
      <b-col cols="3" md="2">
        <b-btn class="song-menu-button" size="lg" variant="outline-success" v-on:click="getSongs(offset, limit)">
          Refresh Songs
        </b-btn>
      </b-col>
      <b-col cols="3" md="2">
        <b-btn class="song-menu-button" size="lg" variant="outline-primary"
               v-on:click="getSongs(offset+24, limit+24)">
          Next
        </b-btn>
      </b-col>
    </b-row>

    <b-row>
      <b-col v-for="song in likedSongs.items" :key="String(song.track.id)" cols="12" lg="6" xl="4"
             class="py-4 px-5">
        <b-row>
          <b-col class="song-container p-0 m-auto" v-on:click="selectSong(song.track.id)">
            <b-row class="song-half-container p-3">
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
              <b-col cols="2" class="song-select-container pl-4">
                <b-form-checkbox :id="'select-song-' + song.track.id" :value="song.track.id" v-model="selectedSongs"
                                 size="lg"/>
              </b-col>
            </b-row>
          </b-col>
        </b-row>
      </b-col>
    </b-row>
  </b-col>
</template>

<script>
import ApiInterface from "@/mixins/api-interface"
import Util from "@/mixins/util"

export default {
  mixins: [ApiInterface, Util],
  name: "SongsTab",

  data() {
    return {
      offset: 0,
      limit: 24,

      likedSongs: [],
      selectedSongs: [],
    }
  },

  beforeMount() {
    this.getSongs(this.offset, this.limit)
  },

  methods: {
    getSongs(offset, limit) {
      if (!this.checkAuthorization()) return

      if (offset < 0) offset = 0
      if (offset >= this.likedSongs.total) return
      if (limit < 24) limit = 24

      this.$axios.get("http://127.0.0.1:8000/spotifyapi/songs", {
        withCredentials: true,
        params: {offset: offset, limit: limit}
      }).then(response => {
        this.likedSongs = response.data
        this.offset = offset
        this.limit = limit
      })
    },

    deleteSongs(songIds) {
      if (!this.checkAuthorization()) {
        // TODO error message
      }

      const songsString = songIds.join()
      this.$axios.get('http://127.0.0.1:8000/spotifyapi/delete_songs', { // TODO post request
        withCredentials: true,
        params: {ids: songsString}
      }).then(() => {
        this.selectedSongs = []
        this.getSongs(this.offset, this.limit)
      })
    },

    selectSong(songId) {
      if (this.selectedSongs.includes(songId)) {
        this.selectedSongs.splice(this.selectedSongs.indexOf(songId), 1)
      } else {
        this.selectedSongs.push(songId)
      }
    }
  }
}
</script>

<style scoped>

.song-menu-button {
  min-height: 100%;
  width: 10vw;
  min-width: 100px;
}

.song-container {
  min-width: 400px;
  max-width: 600px;

  text-align: center;
  border: 1px solid rgba(0, 0, 0, 0.1);
  box-sizing: border-box;
  box-shadow: 0 4px 4px rgba(0, 0, 0, 0.25);
  border-radius: 30px;
}

.song-name {
  text-align: left;
  font-size: 22px;
  white-space: nowrap;
  overflow: hidden;
}

.song-artists {
  text-align: left;
  font-size: 18px;
  white-space: nowrap;
  overflow: hidden
}

.song-image-container {
  max-width: 64px;
}

.song-image-container img {
  border-radius: 15px;
}

</style>