<template>
  <b-row>
    <b-col class="py-3 px-0 px-sm-5">

      <b-row class="text-center" align-h="center">
        <MenuButton container-size="col-4 col-sm-3 col-md-2"
                    button-text="Previous" button-size="lg"
                    v-on:clicked="getPlaylists(offset - songsPerPage, limit)"/>

        <MenuDropdownButton container-size="col-4 col-sm-3 col-md-2"
                            button-text="Actions" button-size="lg" button-variant="primary">
          <b-dropdown-item @click="getPlaylists(offset, limit)">Refresh</b-dropdown-item>
          <b-dropdown-item @click="unfollowPlaylists">Unfollow Selected Playlists</b-dropdown-item>
        </MenuDropdownButton>

        <MenuButton container-size="col-4 col-sm-3 col-md-2"
                    button-text="Next" button-size="lg"
                    v-on:clicked="getPlaylists(offset + songsPerPage, limit)"/>
      </b-row>

      <b-row class="px-5 py-3">
        <b-col class="p-2" cols="12" lg="4" xl="3" v-for="playlist in playlists.items" :key="String(playlist.id)"
               v-on:click="selectPlaylist(playlist.id)">
          <Playlist :playlist="playlist" :is-selected="selectedPlaylists.includes(playlist.id)"/>
        </b-col>
      </b-row>

    </b-col>
  </b-row>
</template>

<script>
import ApiInterface from "../mixins/api-interface"
import Playlist from "@/components/Playlist";
import MenuButton from "@/components/MenuButton"
import MenuDropdownButton from "@/components/MenuDropdownButton"

export default {

  name: "PlaylistsTab",
  mixins: [ApiInterface],

  components: {
    Playlist,
    MenuButton,
    MenuDropdownButton
  },

  data() {
    return {
      offset: 0,
      limit: 10,
      songsPerPage: 10,

      playlists: [],
      selectedPlaylists: []
    }
  },

  async beforeMount() {
    if (await this.checkAuthorization(true)) {
      await this.getPlaylists(this.offset, this.limit)
    }
  },

  methods: {
    async getPlaylists(offset, limit) {
      if (!await this.checkAuthorization(false)) return

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
      }).catch(error => this.createErrorDialog(error.response.status))
    },

    async unfollowPlaylists() {
      if (!await this.checkAuthorization(false)) return

      const playlistsString = this.selectedPlaylists.join()
      this.$axios.get('http://127.0.0.1:8000/spotifyapi/unfollow_playlists', { // TODO post request
        withCredentials: true,
        params: {ids: playlistsString}
      }).then(() => {
        this.selectedPlaylists = []
        this.getPlaylists(this.offset, this.limit)
      }).catch(error => this.createErrorDialog(error.response.status))
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