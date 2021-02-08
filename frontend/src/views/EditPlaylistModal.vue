<template>
  <b-modal scrollable :id="id" :playlist="playlist" :title="title" size="xl"
           @ok="submitEdits">
    <b-container fluid="">

      <b-row>
        <b-col>
          <b-form>
            <b-form-group id="playlist-input-group-name" label="Playlist name:" label-for="playlist-input-name">
              <b-form-input
                  id="playlist-input-name"
                  v-model="name"
                  placeholder="Enter playlist name"
                  required/>
            </b-form-group>

            <b-form-group id="playlist-input-group-description" label="Playlist description:">
              <b-form-input
                  id="playlist-input-description"
                  v-model="description"
                  placeholder="Enter playlist description"
                  required/>
            </b-form-group>

            <b-form-group>
              <b-form-checkbox v-model="checkboxes.isPublic">Public</b-form-checkbox>
              <b-form-checkbox v-model="checkboxes.collaborative">Collaborative</b-form-checkbox>
            </b-form-group>
          </b-form>
        </b-col>
      </b-row>

      <b-row class="text-center justify-content-center">
        <MenuButton container-size="col-6 col-md-4 col-lg-3"
                    button-text="Refresh" button-size="lg"
                    button-variant="primary" v-on:clicked="getSongs"/>

        <MenuButton container-size="col-6 col-md-4 col-lg-3"
                    button-text="Remove" button-size="lg"
                    button-variant="danger" v-on:clicked="removeSongs"/>
      </b-row>

      <Draggable class="row px-2 mx-2 px-lg-4 mx-lg-4 pt-3 justify-content-center" v-model="songs.items">
        <b-col cols="12" class="p-2" v-for="(song, index) in songs.items" :key="index"
               @click="selectSong(song.track.id)">
          <Song :song="song" :is-selected="selectedSongs.includes(song.track.id)" :with-handle="true"/>
        </b-col>
      </Draggable>

    </b-container>
  </b-modal>
</template>

<script>
import util from "@/mixins/util"

import Song from "@/components/Song";
import MenuButton from "@/components/MenuButton";

import Draggable from 'vuedraggable'

export default {
  name: "EditPlaylistModal",
  mixins: [util],

  components: {
    Song,
    MenuButton,
    Draggable
  },

  props: {
    id: String,
    playlist: Object,
    title: String
  },

  data() {
    return {
      songs: [],
      selectedSongs: [],

      name: '',
      description: '',
      checkboxes: {
        isPublic: false,
        collaborative: false
      }
    }
  },

  watch: {
    checkboxes: {
      handler() {
        if (this.checkboxes.isPublic && this.checkboxes.collaborative) {
          this.$bvModal.msgBoxOk('A playlist can\'t be public and collaborative!', {
            title: 'Error', okVariant: 'danger'
          }).then(() => {
            this.checkboxes.isPublic = this.playlist.public
            this.checkboxes.collaborative = this.playlist.collaborative
          })
        }
      },
      deep: true
    }
  },

  mounted() {
    this.$root.$on('bv::modal::show', (bvEvent, modalId) => {
      if (modalId === this.id) {
        this.songs = []
        this.getSongs()
        this.name = this.playlist.name
        this.description = this.playlist.description
        this.checkboxes.isPublic = this.playlist.public
        this.checkboxes.collaborative = this.playlist.collaborative
      }
    })
  },

  methods: {
    getSongs() {
      if (!this.$store.getters.checkAuthorization) {
        this.createErrorDialog(401)
        return
      }

      this.$axios.get("http://127.0.0.1:8000/spotifyapi/playlist/tracks", {
        params: {playlist: this.playlist.id}
      }).then(response => {
        this.songs = response.data
      }).catch(error => this.createErrorDialog(error.response.status))
    },

    selectSong(songId) {
      if (this.selectedSongs.includes(songId)) {
        this.selectedSongs.splice(this.selectedSongs.indexOf(songId), 1)
      } else {
        this.selectedSongs.push(songId)
      }
    },

    removeSongs() {
      if (!this.$store.getters.checkAuthorization) {
        this.createErrorDialog(401)
        return
      }

      this.$axios.delete("http://127.0.0.1:8000/spotifyapi/playlist/tracks", {
        params: {
          playlist: this.playlist.id,
          tracks: this.selectedSongs.join()
        }
      }).then(() => {
        this.getSongs()
        this.$bvModal.msgBoxOk('Successfully removed songs from playlist!', {
          title: 'Success', okVariant: 'success'
        })
      }).catch(error => this.createErrorDialog(error.response.status))
    },

    submitEdits() {
      if (!this.$store.getters.checkAuthorization) {
        this.createErrorDialog(401)
        return
      }

      this.$axios.put("http://127.0.0.1:8000/spotifyapi/playlists", {
        playlists: [{
          id: this.playlist.id,
          name: this.name,
          description: this.description,
          public: this.checkboxes.isPublic,
          collaborative: this.checkboxes.collaborative
        }]
      }).then(() => {
        this.$axios.put("http://127.0.0.1:8000/spotifyapi/playlist/tracks",
            {tracks: this.songs.items.map(song => song.track.id).join()},
            {params: {playlist: this.playlist.id}}).then(() => {
          this.$bvModal.msgBoxOk('Successfully edited playlist!', {
            title: 'Success', okVariant: 'success'
          })
        }).catch(error => this.createErrorDialog(error.response.status))
      }).catch(error => this.createErrorDialog(error.response.status))
    }
  }
}
</script>

<style>

</style>