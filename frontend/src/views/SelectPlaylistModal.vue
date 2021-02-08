<template>
  <b-modal :id="id" :title="title" size="xl" @ok="confirmSelection">
    <b-container fluid="">
      <b-row class="text-center justify-content-center">
        <MenuButton container-size="col-6 col-lg-3"
                    button-text="Previous" button-size="lg"
                    @clicked="goToPage(page - 1)"/>

        <MenuButton container-size="col-6 col-lg-3"
                    button-text="Next" button-size="lg"
                    @clicked="goToPage(page + 1)"/>
      </b-row>

      <b-row class="px-5 mx-5 pt-3">
        <b-col class="p-2" cols="12" v-for="playlist in shownPlaylists" :key="String(playlist.id)"
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
      page: 0,
      itemsPerPage: 5,

      playlists: [],
      selectedPlaylists: []
    }
  },

  beforeMount() {
    if (this.$store.getters.checkAuthorization) {
      this.getPlaylists(this.offset, this.limit)
    }
  },

  computed: {
    shownPlaylists: function () {
      if (this.playlists.items !== undefined) {
        return this.playlists.items.slice(this.page * this.itemsPerPage, (this.page + 1) * this.itemsPerPage)
      }
      return []
    }
  },

  methods: {
    goToPage(newPage) {
      if (newPage >= 0 && newPage * this.itemsPerPage < this.playlists.total) {
        this.page = newPage
      }
    },

    getPlaylists() {
      if (!this.$store.getters.checkAuthorization) {
        this.createErrorDialog(401)
        return
      }

      this.$axios.get("http://127.0.0.1:8000/spotifyapi/playlists").then(response => {
        this.playlists = response.data
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