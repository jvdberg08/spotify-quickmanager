<template>
  <TabBase require-authorization>
    <SelectPlaylistModal id="add-songs-to-playlist-modal" title="Add Selected Songs to Playlist"
                         @ok="addSongsToPlaylist"/>

    <b-col class="py-3 px-0 px-sm-5">

      <b-row class="text-center" align-h="center">
        <MenuButton :id="'previous-button'" container-size="col-4 col-sm-3 col-md-2"
                    button-text="Previous" button-size="lg" @click="goToPage(page - 1)"/>

        <MenuDropdownButton :id="'actions-dropdown-button'" container-size="col-4 col-sm-3 col-md-2"
                            button-text="Actions" button-size="lg" button-variant="primary">
          <b-dropdown-item @click="getSongs">Refresh</b-dropdown-item>
          <b-dropdown-item @click="openSelectPlaylistsModal">Add Selected To Playlist
          </b-dropdown-item>
          <b-dropdown-item @click="removeSongs(selectedSongs)">Remove Selected from Liked Songs</b-dropdown-item>
        </MenuDropdownButton>

        <MenuButton :id="'next-button'" container-size="col-4 col-sm-3 col-md-2"
                    button-text="Next" button-size="lg"
                    @click="goToPage(page + 1)"/>
      </b-row>

      <DataContainer container-classes="px-5 py-3" :is-loading="isLoading">
        <b-col class="p-2" cols="12" lg="4" xl="3" v-for="song in shownSongs" :key="String(song.track.id)"
               v-on:click="selectSong(song.track.id)">
          <Song :song="song" :is-selected="selectedSongs.includes(song.track.id)"/>
        </b-col>
      </DataContainer>

    </b-col>
  </TabBase>
</template>

<script>
import util from "@/mixins/util"

import Song from "@/components/Song";
import MenuButton from "@/components/MenuButton";
import MenuDropdownButton from "@/components/MenuDropdownButton";
import SelectPlaylistModal from "@/views/SelectPlaylistModal";
import DataContainer from "@/components/DataContainer";
import TabBase from "@/views/TabBase";

export default {

  name: "SongsTab",
  mixins: [util],

  components: {
    TabBase,
    Song,
    MenuButton,
    DataContainer,
    MenuDropdownButton,
    SelectPlaylistModal
  },

  data() {
    return {
      isLoading: false,

      page: 0,
      itemsPerPage: 28,

      likedSongs: [],
      selectedSongs: [],
    }
  },

  beforeMount() {
    if (this.$store.getters.checkAuthorization) {
      this.getSongs(this.offset, this.limit)
    }
  },

  computed: {
    shownSongs: function () {
      if (this.likedSongs.items !== undefined) {
        return this.likedSongs.items.slice(this.page * this.itemsPerPage, (this.page + 1) * this.itemsPerPage)
      }
      return []
    }
  },

  methods: {
    goToPage(newPage) {
      if (newPage >= 0 && newPage * this.itemsPerPage < this.likedSongs.total) {
        this.page = newPage
      }
    },

    selectSong(songId) {
      if (this.selectedSongs.includes(songId)) {
        this.selectedSongs.splice(this.selectedSongs.indexOf(songId), 1)
      } else {
        this.selectedSongs.push(songId)
      }
    },

    openSelectPlaylistsModal() {
      if (!this.$store.getters.checkAuthorization) {
        this.createErrorDialog(401)
        return
      }

      if (!this.selectedSongs.length) {
        this.$bvModal.msgBoxOk('Please select at least one song!', {
          title: 'Error', size: 'sm', buttonSize: 'sm', okVariant: 'danger'
        })
      } else {
        this.$bvModal.show('add-songs-to-playlist-modal')
      }
    },

    getSongs() {
      if (!this.$store.getters.checkAuthorization) {
        this.createErrorDialog(401)
        return
      }

      this.isLoading = true
      this.$axios.get("http://127.0.0.1:8000/spotifyapi/liked_songs").then(response => {
        this.likedSongs = response.data
        this.isLoading = false
      }).catch(error => {
        this.createErrorDialog(error.response.status)
        this.isLoading = false
      })
    },

    removeSongs(songIds) {
      if (!this.$store.getters.checkAuthorization) {
        this.createErrorDialog(401)
        return
      }

      this.$bvModal.msgBoxConfirm('Are you sure you want to remove all selected songs from your Liked Songs?', {
        title: 'Please Confirm', okVariant: 'danger', okTitle: 'Delete', cancelTitle: 'Cancel'
      }).then(value => {
            if (value) {
              this.$axios.delete('http://127.0.0.1:8000/spotifyapi/liked_songs', {
                params: {tracks: songIds.join()}
              }).then(() => {
                    this.selectedSongs = []
                    this.getSongs()
                    this.$bvModal.msgBoxOk('Successfully removed songs from Liked Songs!', {
                      title: 'Success', okVariant: 'success'
                    })
                  }
              ).catch(error => this.createErrorDialog(error.response.status))
            }
          }
      )
    },

    addSongsToPlaylist(playlistIds) {
      if (!this.$store.getters.checkAuthorization) {
        this.createErrorDialog(401)
        return
      }

      const playlistString = playlistIds.join()
      const songsString = this.selectedSongs.join()
      this.$axios.post('http://127.0.0.1:8000/spotifyapi/playlists/tracks',
          {tracks: songsString},
          {params: {playlists: playlistString}}).then(() => {
        this.selectedSongs = []
        this.$bvModal.msgBoxOk('Successfully added songs to the playlists!', {
          title: 'Success', okVariant: 'success'
        })
      }).catch(error => this.createErrorDialog(error.response.status))
    }
  }
}
</script>

<style scoped>

</style>