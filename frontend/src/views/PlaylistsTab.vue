<template>
  <b-col v-if="playlists != null" class="py-3 px-0 px-sm-5">
    <b-row class="text-center" align-h="center">
      <b-col cols="3" md="2">
        <b-btn class="song-menu-button" size="lg" variant="outline-primary"
               v-on:click="getPlaylists(offset-10, limit-10)">
          Previous
        </b-btn>
      </b-col>
      <b-col cols="3" md="2">
        <b-btn class="song-menu-button" size="lg" variant="outline-danger"
               v-on:click="deletePlaylists(selectedPlaylists)">
          Delete Selected
        </b-btn>
      </b-col>
      <b-col cols="3" md="2">
        <b-btn class="song-menu-button" size="lg" variant="outline-success" v-on:click="getPlaylists(offset, limit)">
          Refresh Playlists
        </b-btn>
      </b-col>
      <b-col cols="3" md="2">
        <b-btn class="song-menu-button" size="lg" variant="outline-primary"
               v-on:click="getPlaylists(offset+10, limit+10)">
          Next
        </b-btn>
      </b-col>
    </b-row>

    <b-row class="playlists-table py-4 px-0 justify-content-center">
      <b-col cols="12" md="8">
        <b-row class="playlists-headers">
          <b-col cols="3" offset="1"><strong>Name</strong></b-col>
          <b-col cols="4"><strong>Description</strong></b-col>
          <b-col cols="2"><strong>Owner</strong></b-col>
          <b-col cols="1" class="text-center"><strong>Songs</strong></b-col>
          <b-col cols="1" class="text-center"><strong>Public</strong></b-col>
        </b-row>

        <b-row cols="12" class="playlist-container py-2" v-for="playlist in playlists.items"
               :key="String(playlist.id)" v-on:click="selectPlaylist(playlist.id)">

          <b-col cols="1" class="playlist-select my-auto">
            <b-form-checkbox :id="'select-playlist-' + playlist.id" :value="playlist.id" v-model="selectedPlaylists"
                             size="lg"/>
          </b-col>

          <b-col cols="3" class="playlist-big">
            <b-col class="p-0">
              <b-img class="playlist-image" :src="playlist.images[0].url"/>
              {{ playlist.name }}
            </b-col>
          </b-col>

          <b-col cols="4" class="playlist-small">
            <b-col v-if="playlist.description !== ''" class="p-0">{{ playlist.description }}</b-col>
            <b-col v-else class="p-0">-</b-col>
          </b-col>

          <b-col cols="2" class="playlist-big">
            <b-col class="p-0">{{ playlist.owner.display_name }}</b-col>
          </b-col>

          <b-col cols="1" class="playlist-big text-center">
            <b-col class="p-0">{{ playlist.tracks.total }}</b-col>
          </b-col>

          <b-col cols="1" class="text-center m-auto">
            <b-img v-if="playlist.public" class="playlist-public"
                   src="https://upload.wikimedia.org/wikipedia/commons/3/3b/Eo_circle_green_checkmark.svg"
                   alt="True"/>
            <b-img v-else class="playlist-public"
                   src="https://icon-library.net/images/close-icon-png/close-icon-png-19.jpg" alt="False"/>
          </b-col>

        </b-row>
      </b-col>
    </b-row>
  </b-col>
</template>

<script>
import ApiInterface from '../mixins/api-interface'
import Util from '../mixins/util'

export default {

  name: "PlaylistsTab",
  mixins: [ApiInterface, Util],

  data() {
    return {
      offset: 0,
      limit: 10,

      playlists: [],
      selectedPlaylists: []
    }
  },

  beforeMount() {
    this.getPlaylists(this.offset, this.limit)
  },

  methods: {
    getPlaylists(offset, limit) {
      if (!this.checkAuthorization()) return

      this.playlists = []

      if (offset < 0) offset = 0
      if (offset >= this.playlists.total) return
      if (limit < 10) limit = 10

      this.$axios.get("http://127.0.0.1:8000/spotifyapi/playlists", {
        withCredentials: true,
        params: {offset: offset, limit: limit}
      }).then(response => {
        this.playlists = response.data
        this.offset = offset
        this.limit = limit
      })
    },

    deletePlaylists(playlistIds) {
      if (!this.checkAuthorization()) {
        // TODO error message
      }

      const playlistsString = playlistIds.join()
      this.$axios.get('http://127.0.0.1:8000/spotifyapi/delete_playlists', { // TODO post request
        withCredentials: true,
        params: {ids: playlistsString}
      }).then(() => {
        this.selectedPlaylists = []
        this.getPlaylists(this.offset, this.limit)
      })
    },

    selectPlaylist(playlistId) {
      if (this.selectedPlaylists.includes(playlistId)) {
        this.selectedPlaylists.splice(this.selectedPlaylists.indexOf(playlistId), 1)
      } else {
        this.selectedPlaylists.push(playlistId)
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

.playlists-headers {
  border-bottom: black 1px solid;
}

.playlists-headers div {
  font-size: 24px;
  text-align: left;
}

.playlist-container {
  border-bottom: black 1px solid;
}

.playlist-image {
  height: 48px;
  width: 48px;
  border-radius: 8px;
  border: black 1px solid;
}

.playlist-public {
  height: 32px;
  width: 32px;
}

.playlist-select div {
  padding-left: 5.25vw;
}

.playlist-big {
  font-size: 24px;
  text-align: left;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-top: auto;
  margin-bottom: auto;
}

.playlist-small {
  font-size: 18px;
  margin-top: auto;
  margin-bottom: auto;
}
</style>