<template>
  <b-modal :id="id" title="Add Songs To Playlists" size="xl" @ok="createPlaylist">
    <b-container fluid="">

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
        <b-form-checkbox id="playlist-checkbox-public" v-model="checkboxes.public">
          Public
        </b-form-checkbox>
        <b-form-checkbox id="playlist-checkbox-collaborative" v-model="checkboxes.collaborative">
          Collaborative
        </b-form-checkbox>
      </b-form-group>

    </b-container>
  </b-modal>
</template>

<script lang="ts">
import {Component, Watch, Prop} from "vue-property-decorator";
import {BvModalEvent} from "bootstrap-vue";
import PlaylistAPI from '@/mixins/playlist_api';

@Component
export default class CreatePlaylistModal extends PlaylistAPI {

  @Prop({required: true}) id!: string

  name = ""
  description = ""
  checkboxes = {
    public: false,
    collaborative: false
  }

  @Watch('checkboxes', {deep: true})
  onInputChange(val: { public: boolean; collaborative: boolean }) {
    if (val.public && val.collaborative) {
      this.$bvModal.msgBoxOk('A playlist can\'t be public and collaborative!',
          {title: 'Error', okVariant: 'danger'}).then(() => {
        val.public = false
        val.collaborative = false
      })
    }
  }

  createPlaylist(bvModalEvent: BvModalEvent) {
    bvModalEvent.preventDefault()
    this.createPlaylistData(this.name, this.description, this.checkboxes.public, this.checkboxes.collaborative)
        .then(value => {
          if (value) {
            this.$nextTick(() => {
              this.$bvModal.hide(this.id)
            })
          }
        })
  }
}
</script>

<style scoped>

</style>