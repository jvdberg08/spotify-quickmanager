<template>
  <TabBase require-authorization>
    <EditPlaylistModal :id="'edit-playlist-modal'" :playlist="selectedPlaylists[0]" :title="'Edit Playlist'"/>

    <b-col class="py-3 px-0 px-sm-5">

      <b-row class="text-center" align-h="center">
        <MenuButton :id="'previous-button'" container-size="col-4 col-sm-3 col-md-2"
                    button-text="Previous" button-size="lg"
                    @clicked="goToPage(page - 1)"/>

        <MenuDropdownButton :id="'actions-dropdown-button'" container-size="col-4 col-sm-3 col-md-2"
                            button-text="Actions" button-size="lg" button-variant="primary">
          <b-dropdown-item id="refresh-dropdown-item" @click="getPlaylists">Refresh</b-dropdown-item>
          <b-dropdown-item id="edit-dropdown-item" @click="openEditPlaylistModal">Edit</b-dropdown-item>
          <b-dropdown-item id="unfollow-dropdown-item" @click="unfollowPlaylists">Unfollow</b-dropdown-item>
          <b-dropdown-item id="change-public-private-dropdown-item" @click="editPlaylist('Public/Private')">Make
            Public/Private
          </b-dropdown-item>
          <b-dropdown-item id="change-collaborative-dropdown-item"
                           @click="editPlaylist('Collaborative/Non-Collaborative')">
            Make Collaborative/Non-Collaborative
          </b-dropdown-item>
        </MenuDropdownButton>

        <MenuButton :id="'next-button'" container-size="col-4 col-sm-3 col-md-2"
                    button-text="Next" button-size="lg"
                    @clicked="goToPage(page + 1)"/>
      </b-row>

      <DataContainer container-classes="px-5 py-3" :is-loading="isLoading">
        <b-col class="p-2" cols="12" lg="4" xl="3" v-for="playlist in playlists.items" :key="String(playlist.id)"
               @click="selectPlaylist(playlist)">
          <Playlist :playlist="playlist" :is-selected="selectedPlaylists.includes(playlist)"/>
        </b-col>
      </DataContainer>

    </b-col>
  </TabBase>
</template>

<script>
import util from "@/mixins/util"

import Playlist from "@/components/Playlist"
import MenuButton from "@/components/MenuButton"
import MenuDropdownButton from "@/components/MenuDropdownButton"
import EditPlaylistModal from "@/views/EditPlaylistModal";
import DataContainer from "@/components/DataContainer";
import TabBase from "@/views/TabBase";

export default {

  name: "PlaylistsTab",
  mixins: [util],

  components: {
    TabBase,
    DataContainer,
    Playlist,
    MenuButton,
    MenuDropdownButton,
    EditPlaylistModal
  },

  data() {
    return {
      isLoading: false,

      page: 0,
      itemsPerPage: 28,

      playlists: [],
      selectedPlaylists: []
    }
  },

  async beforeMount() {
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

    getPlaylists() {
      if (!this.$store.getters.checkAuthorization) {
        this.createErrorDialog(401)
        return
      }

      this.isLoading = true
      this.$axios.get(process.env.VUE_APP_BACKEND_API + "/playlists").then(response => {
        this.playlists = response.data
        this.isLoading = false
      }).catch(error => {
        this.createErrorDialog(error.response.status)
        this.isLoading = false
      })
    },

    editPlaylist(type) {
      if (!this.$store.getters.checkAuthorization) {
        this.createErrorDialog(401)
        return
      }

      let message = ''
      if (type === 'Public/Private') {
        message = 'Are you sure you want to invert the visibility of these playlists? (public > private / private > public)'
      } else if (type === 'Collaborative/Non-Collaborative') {
        message = 'Are you sure you want to invert the possibility of others editing the playlist? (collaborative > non-collaborative / non-collaborative > collaborative)'
      } else this.createErrorDialog(500)

      this.$bvModal.msgBoxConfirm(message, {
        title: 'Please Confirm', okVariant: 'danger', okTitle: 'Make ' + type, cancelTitle: 'Cancel'
      }).then(() => {
        this.skipInvalidPlaylists(type).then(() => {
          if (!this.selectedPlaylists.length) return
          this.$axios.put(process.env.VUE_APP_BACKEND_API + "/playlists", {
            playlists: this.selectedPlaylists.map(playlist => {
              return {
                id: playlist.id,
                public: type === 'Public/Private' ? !playlist.public : playlist.public,
                collaborative: type === 'Collaborative/Non-Collaborative' ? !playlist.collaborative : playlist.collaborative
              }
            })
          }).then(() => {
            this.selectedPlaylists = []
            this.getPlaylists(this.offset, this.limit)
            this.$bvModal.msgBoxOk('Successfully edited playlists!', {
              title: 'Success', okVariant: 'success'
            })
          }).catch(error => this.createErrorDialog(error.response.status))
        })
      })
    },

    async skipInvalidPlaylists(type) {
      const invalidPlaylists = []
      this.selectedPlaylists = this.selectedPlaylists.filter(playlist => {
        if ((playlist.public && type === 'Collaborative/Non-Collaborative')
            || playlist.collaborative && type === 'Public/Private') {
          invalidPlaylists.push(playlist)
          return false
        }
        return true
      })

      let message = ''
      if (invalidPlaylists.length) {
        message = 'Editing the following playlists failed because they can\'t be public and collaborative: ' +
            invalidPlaylists.map(playlist => playlist.name).join(', ')
        return this.$bvModal.msgBoxOk(message, {title: 'Error', okVariant: 'danger'})
      }
    },

    unfollowPlaylists() {
      if (!this.$store.getters.checkAuthorization) {
        this.createErrorDialog(401)
        return
      }

      this.$bvModal.msgBoxConfirm('Are you sure you want to unfollow these playlists?', {
        title: 'Please Confirm', okVariant: 'danger', okTitle: 'Unfollow', cancelTitle: 'Cancel'
      }).then(() => {
        const playlistsString = this.selectedPlaylists.map(playlist => playlist.id).join()
        this.$axios.delete(process.env.VUE_APP_BACKEND_API + "/playlists", {
          params: {playlists: playlistsString}
        }).then(() => {
          this.selectedPlaylists = []
          this.getPlaylists(this.offset, this.limit)
          this.$bvModal.msgBoxOk('Successfully unfollowed these playlists!', {
            title: 'Success', okVariant: 'success'
          })
        }).catch(error => this.createErrorDialog(error.response.status))
      })
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