<template>
  <b-row v-if="this.$store.getters.checkAuthorization">
    <b-col class="py-3 px-0 px-sm-5">

      <b-row class="text-center" align-h="center">
        <MenuButton container-size="col-4 col-sm-3 col-md-2"
                    button-text="Previous" button-size="lg"
                    v-on:clicked="getPlaylists(offset - playlistsPerPage, limit)"/>

        <MenuDropdownButton container-size="col-4 col-sm-3 col-md-2"
                            button-text="Actions" button-size="lg" button-variant="primary">
          <b-dropdown-item @click="getPlaylists(offset, limit)">Refresh</b-dropdown-item>
          <b-dropdown-item @click="unfollowPlaylists">Unfollow Selected Playlists</b-dropdown-item>
        </MenuDropdownButton>

        <MenuButton container-size="col-4 col-sm-3 col-md-2"
                    button-text="Next" button-size="lg"
                    v-on:clicked="getPlaylists(offset + playlistsPerPage, limit)"/>
      </b-row>

      <b-row class="px-5 py-3">
        <b-col class="p-2" cols="12" lg="4" xl="3" v-for="playlist in playlists.items" :key="String(playlist.id)"
               v-on:click="selectPlaylist(playlist)">
          <Playlist :playlist="playlist" :is-selected="selectedPlaylists.includes(playlist)"/>
        </b-col>
      </b-row>

    </b-col>
  </b-row>
</template>

<script>
import util from "@/mixins/util"

import Playlist from "@/components/Playlist";
import MenuButton from "@/components/MenuButton"
import MenuDropdownButton from "@/components/MenuDropdownButton"
import EditPlaylistModal from "@/views/EditPlaylistModal";

export default {

  name: "PlaylistsTab",
  mixins: [util],

  components: {
    Playlist,
    MenuButton,
    MenuDropdownButton,
    EditPlaylistModal
  },

  data() {
    return {
      offset: 0,
      limit: 10,
      playlistsPerPage: 10,

      playlists: [],
      selectedPlaylists: []
    }
  },

  async beforeMount() {
    if (this.$store.getters.checkAuthorization) {
      this.getPlaylists(this.offset, this.limit)
    }
  },

  methods: {
    openEditPlaylistModal() {
      if (!this.$store.getters.checkAuthorization) {
        this.createErrorDialog(401)
        return
      }

      if (this.selectedPlaylists.length !== 1) {
        this.$bvModal.msgBoxOk('Please select one playlist!', {
          title: 'Error', size: 'sm', buttonSize: 'sm', okVariant: 'danger'
        })
      } else {
        this.$bvModal.show('edit-playlist-modal')
      }
    },

    getPlaylists(offset, limit) {
      if (!this.$store.getters.checkAuthorization) {
        this.createErrorDialog(401)
        return
      }

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

    unfollowPlaylists() {
      if (!this.$store.getters.checkAuthorization) {
        this.createErrorDialog(401)
        return
      }

      const playlistsString = this.selectedPlaylists.map(playlist => playlist.id).join()
      this.$axios.get("http://127.0.0.1:8000/spotifyapi/unfollow_playlists", { // TODO post request
        withCredentials: true,
        params: {ids: playlistsString}
      }).then(() => {
        this.selectedPlaylists = []
        this.getPlaylists(this.offset, this.limit)
      }).catch(error => this.createErrorDialog(error.response.status))
    },

    selectPlaylist(playlist) {
      if (this.selectedPlaylists.includes(playlist)) {
        this.selectedPlaylists.splice(this.selectedPlaylists.indexOf(playlist), 1)
      } else {
        this.selectedPlaylists.push(playlist)
      }
    }
  }
}
</script>

<style scoped>

</style>