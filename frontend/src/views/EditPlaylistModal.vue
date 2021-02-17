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
              <b-form-checkbox id="playlist-checkbox-public" v-model="checkboxes.isPublic">
                Public
              </b-form-checkbox>
              <b-form-checkbox id="playlist-checkbox-collaborative" v-model="checkboxes.collaborative">
                Collaborative
              </b-form-checkbox>
            </b-form-group>
          </b-form>
        </b-col>
      </b-row>

      <b-row class="text-center justify-content-center">
        <MenuButton :id="'refresh-button'" container-size="col-6 col-md-4 col-lg-3"
                    button-text="Refresh" button-size="lg"
                    button-variant="primary" @clicked="getSongs"/>

        <MenuButton :id="'remove-button'" container-size="col-6 col-md-4 col-lg-3"
                    button-text="Remove" button-size="lg"
                    button-variant="danger" @clicked="removeSongs"/>
      </b-row>

      <Draggable v-model="songs.items">
        <DataContainer container-classes="px-2 mx-2 px-lg-4 mx-lg-4 pt-3 justify-content-center"
                       :is-loading="isLoading"
                       :min-height="30">
          <b-col cols="12" class="p-2" v-for="(song, index) in songs.items" :key="index"
                 @click="selectSong(song.track.id)">
            <Song :song="song" :is-selected="selectedSongs.includes(song.track.id)" :with-handle="true"/>
          </b-col>
        </DataContainer>
      </Draggable>

    </b-container>
  </b-modal>
</template>

<script>
import util from "@/mixins/util"

import Song from "@/components/Song";
import MenuButton from "@/components/MenuButton";

import Draggable from 'vuedraggable'
import DataContainer from "@/components/DataContainer";

export default {
  name: "EditPlaylistModal",
  mixins: [util],

  components: {
    DataContainer,
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
      isLoading: false,

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

  methods: {
    getSongs() {
      if (!this.$store.getters.checkAuthorization) {
        this.createErrorDialog(401)
        return
      }

      this.isLoading = true
      this.$axios.get(process.env.VUE_APP_BACKEND_API + "/playlist/tracks", {
        params: {playlist: this.playlist.id}
      }).then(response => {
        this.songs = response.data
        this.isLoading = false
      }).catch(error => {
        this.createErrorDialog(error.response.status)
        this.isLoading = false
      })
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

      this.$axios.delete(process.env.VUE_APP_BACKEND_API + "/playlist/tracks", {
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

      this.$axios.put(process.env.VUE_APP_BACKEND_API + "/playlists", {
        playlists: [{
          id: this.playlist.id,
          name: this.name,
          description: this.description,
          public: this.checkboxes.isPublic,
          collaborative: this.checkboxes.collaborative
        }]
      }).then(() => {
        this.$axios.put(process.env.VUE_APP_BACKEND_API + "/playlist/tracks",
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