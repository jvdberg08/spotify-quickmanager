<template>
  <b-modal :id="id" :title="title" size="xl" @ok="confirmSelection">
    <b-container fluid="">
      <b-row class="text-center justify-content-center">
        <MenuButton container-size="col-6 col-lg-3"
                    button-text="Previous" button-size="lg"
                    @clicked="getPlaylists(offset - songsPerPage, limit)"/>

        <MenuButton container-size="col-6 col-lg-3"
                    button-text="Next" button-size="lg"
                    @clicked="getPlaylists(offset + songsPerPage, limit)"/>
      </b-row>

      <b-row class="px-5 mx-5 pt-3">
        <b-col class="p-2" cols="12" v-for="playlist in playlists.items" :key="String(playlist.id)"
               @click="selectPlaylist(playlist.id)">
          <Playlist :playlist="playlist" :is-selected="selectedPlaylists.includes(playlist.id)"/>
        </b-col>
      </b-row>

    </b-container>
  </b-modal>
</template>

<script>
import util from "@/mixins/util"

import MenuButton from "@/components/MenuButton";
import Playlist from "@/components/Playlist";

export default {

  name: "SelectPlaylistModal",
  mixins: [util],

  components: {
    MenuButton,
    Playlist
  },

  props: {
    id: String,
    title: String
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
    if (this.$store.getters.checkAuthorization) {
      await this.getPlaylists(this.offset, this.limit)
    }
  },

  methods: {
    async getPlaylists(offset, limit) {
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

    selectPlaylist(playlistId) {
      if (this.selectedPlaylists.includes(playlistId)) {
        this.selectedPlaylists.splice(this.selectedPlaylists.indexOf(playlistId), 1)
      } else {
        this.selectedPlaylists.push(playlistId)
      }
    },

    confirmSelection() {
      if (!this.selectedPlaylists.length) {
        this.$bvModal.msgBoxOk('Please select at least one playlist!', {
          title: 'Error', okVariant: 'danger'
        }).then(value => {
          if (value) {
            this.$bvModal.show(this.id)
          }
        })
      } else {
        this.$emit('ok', this.selectedPlaylists)
        this.selectedPlaylists = []
      }
    }
  }
}
</script>

<style scoped>

</style>