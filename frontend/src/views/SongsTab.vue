<template>
  <b-row v-if="likedSongs != null" class="songs-container py-3 px-0 px-sm-5 ">
    <b-col cols="12">
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
    </b-col>

    <b-col v-for="(song, index) in likedSongs.items" :key="String(song.track.id)" cols="12" lg="6" xl="4"
           class="py-4 px-5" v-on:click="selectSong(index)">
      <b-row>
        <b-col class="song-container p-0 m-auto">
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
              <b-form-checkbox :id="'select-song-' + index" :value="index" v-model="selectedSongs"
                               size="lg"/>
            </b-col>
          </b-row>
        </b-col>
      </b-row>
    </b-col>
  </b-row>
</template>

<script>
import ApiInterface from "@/api-interface"
import Util from "@/util"

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
    this.getSongs(0, 24)
  },

  methods: {
    getSongs(offset, limit) {
      if (!this.checkAuthorization()) return

      this.selectedSongs = []

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

    deleteSongs(songIndexes) {
      if (!this.checkAuthorization()) {
        // TODO error message
      }

      const vm = this
      const songs = songIndexes.map(function (songIndex) {
        return vm.likedSongs.items[songIndex].track.id
      })

      const songsString = songs.join()
      this.$axios.get('http://127.0.0.1:8000/spotifyapi/delete_songs', { // TODO post request
        withCredentials: true,
        params: {ids: songsString}
      }).then(() => {
        this.selectedSongs = []
        this.likedSongs.items = this.likedSongs.items.filter(song => !songs.includes(song.track.id))
      })
    },

    selectSong(index) {
      if (this.selectedSongs.includes(index)) {
        this.selectedSongs.splice(this.selectedSongs.indexOf(index), 1)
      } else {
        this.selectedSongs.push(index)
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