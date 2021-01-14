<template>
  <b-row>
    <SelectPlaylistModal :id="'add-songs-to-playlist-modal'" :title="'Add Selected Songs to Playlist'"
                         @ok="addSongsToPlaylist"/>

    <b-col class="py-3 px-0 px-sm-5">

      <b-row class="text-center" align-h="center">
        <MenuButton container-size="col-4 col-sm-3 col-md-2"
                    button-text="Previous" button-size="lg"
                    v-on:clicked="getSongs(offset - songsPerPage, limit)"/>

        <MenuDropdownButton container-size="col-4 col-sm-3 col-md-2"
                            button-text="Actions" button-size="lg" button-variant="primary">
          <b-dropdown-item @click="getSongs(offset, limit)">Refresh</b-dropdown-item>
          <b-dropdown-item @click="openSelectPlaylistsModal">Add Selected To Playlist
          </b-dropdown-item>
          <b-dropdown-item @click="removeSongs(selectedSongs)">Remove Selected from Liked Songs</b-dropdown-item>
        </MenuDropdownButton>

        <MenuButton container-size="col-4 col-sm-3 col-md-2"
                    button-text="Next" button-size="lg"
                    v-on:clicked="getSongs(offset + songsPerPage, limit)"/>
      </b-row>

      <b-row class="px-5 py-3">
        <b-col class="p-2" cols="12" lg="4" xl="3" v-for="song in likedSongs.items" :key="String(song.track.id)"
               v-on:click="selectSong(song.track.id)">
          <Song :song="song" :is-selected="selectedSongs.includes(song.track.id)"/>
        </b-col>
      </b-row>

    </b-col>
  </b-row>
</template>

<script>
import Song from "@/components/Song";
import ApiInterface from "@/mixins/api-interface"
import MenuButton from "@/components/MenuButton";
import MenuDropdownButton from "@/components/MenuDropdownButton";
import SelectPlaylistModal from "@/views/SelectPlaylistModal";

export default {
  mixins: [ApiInterface],
  name: "SongsTab",
  components: {
    Song,
    MenuButton,
    MenuDropdownButton,
    SelectPlaylistModal
  },

  data() {
    return {
      offset: 0,
      limit: 28,
      songsPerPage: 28,

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
      if (limit < this.songsPerPage) limit = this.songsPerPage

      this.$axios.get("http://127.0.0.1:8000/spotifyapi/songs", {
        withCredentials: true,
        params: {offset: offset, limit: limit}
      }).then(response => {
        this.likedSongs = response.data
        this.offset = offset
        this.limit = limit
      })
    },

    removeSongs(songIds) {
      if (!this.checkAuthorization()) {
        this.$bvModal.msgBoxOk('Something went wrong while authenticating! Try logging out and loggin in again!', {
          title: 'Error', okVariant: 'danger'
        })
      }

      this.$bvModal.msgBoxConfirm('Please confirm that you want to delete everything.', {
        title: 'Error', okVariant: 'danger', okTitle: 'Delete', cancelTitle: 'Cancel'
      }).then(value => {
        if (value) {
          const songsString = songIds.join()
          this.$axios.get('http://127.0.0.1:8000/spotifyapi/delete_songs', { // TODO post request
            withCredentials: true,
            params: {ids: songsString}
          }).then(() => {
            this.selectedSongs = []
            this.getSongs(this.offset, this.limit)
            this.$bvModal.msgBoxOk('Successfully removed songs from Liked Songs!', {
              title: 'Success', okVariant: 'success'
            })
          })
        }
      })
    },

    selectSong(songId) {
      if (this.selectedSongs.includes(songId)) {
        this.selectedSongs.splice(this.selectedSongs.indexOf(songId), 1)
      } else {
        this.selectedSongs.push(songId)
      }
    },

    openSelectPlaylistsModal() {
      if (!this.selectedSongs.length) {
        this.$bvModal.msgBoxOk('Please select at least one song!', {
          title: 'Error', size: 'sm', buttonSize: 'sm', okVariant: 'danger', centered: true
        })
      } else {
        this.$bvModal.show('add-songs-to-playlist-modal')
      }
    },

    addSongsToPlaylist(playlistIds) {
      const playlistString = playlistIds.join()
      const songsString = this.selectedSongs.join()
      this.$axios.get('http://127.0.0.1:8000/spotifyapi/add_songs_to_playlists', { // TODO post request
        withCredentials: true,
        params: {
          'songIds': songsString,
          'playlistIds': playlistString
        }
      }).then(() => {
        this.selectedSongs = []
        this.$bvModal.msgBoxOk('Successfully added songs to the playlists!', {
          title: 'Success', okVariant: 'success'
        })
      })
    }
  }
}
</script>

<style scoped>

</style>