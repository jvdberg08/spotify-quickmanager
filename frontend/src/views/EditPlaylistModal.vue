<template>
  <b-modal scrollable :id="id" :playlist="playlist" title="Edit Playlist" size="xl"
           @ok="editPlaylist">
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
              <b-form-checkbox id="playlist-checkbox-public" v-model="checkboxes.public">
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
                    button-variant="primary" @click="getSongs"/>

        <MenuButton :id="'remove-button'" container-size="col-6 col-md-4 col-lg-3"
                    button-text="Remove" button-size="lg"
                    button-variant="danger" @click="removeSongs"/>
      </b-row>

      <Draggable v-model="tracks">
        <DataContainer container-classes="px-2 mx-2 px-lg-4 mx-lg-4 pt-3 justify-content-center" :min-height="30">
          <b-col cols="12" class="p-2" v-for="track in tracks" :key="track.id"
                 @click="selectSong(track)">
            <Song :track="track" :is-selected="selectedTracks.includes(track)" :with-handle="true"/>
          </b-col>
        </DataContainer>
      </Draggable>

    </b-container>
  </b-modal>
</template>

<script lang="ts">
import Track from "@/components/Track.vue";
import MenuButton from "@/components/MenuButton.vue";
import DataContainer from "@/components/DataContainer.vue";
import Draggable from 'vuedraggable'

import {Component, Mixins, Prop, Watch} from "vue-property-decorator";
import {Playlist as IPlaylist, Track as ITrack} from "@/mixins/interfaces"
import TrackAPI from "../mixins/track_api";
import PlaylistAPI from "@/mixins/playlist_api";
import {BvEvent, BvModalEvent} from "bootstrap-vue";

@Component({
  components: {
    Song: Track,
    MenuButton,
    DataContainer,
    Draggable
  }
})
export default class EditPlaylistModal extends Mixins(TrackAPI, PlaylistAPI) {

  @Prop({required: true}) id!: string
  @Prop({required: true}) playlist!: IPlaylist

  name = ''
  description = ''
  checkboxes = {
    public: false,
    collaborative: false
  }

  tracks: ITrack[] = []
  selectedTrackIds: string[] = []

  mounted() {
    this.$root.$on('bv::modal::show', (bvEvent: BvEvent, modalId: string) => {
      if (modalId === this.id) {
        this.getSongs()
        this.name = this.playlist.name
        this.description = this.playlist.description
        this.checkboxes.public = this.playlist.public
        this.checkboxes.collaborative = this.playlist.collaborative
      }
    })
  }

  @Watch('playlist', {deep: true})
  onInputChange(val: IPlaylist, oldVal: IPlaylist) {
    if (val.public && val.collaborative) {
      this.$bvModal.msgBoxOk('A playlist can\'t be public and collaborative!',
          {title: 'Error', okVariant: 'danger'}).then(() => val = oldVal)
    }
  }

  get selectedTracks(): ITrack[] {
    return this.tracks.filter(track => this.selectedTrackIds.includes(track.id))
  }

  getSongs() {
    this.getPlaylistTracksData(this.playlist).then(tracks => this.tracks = tracks)
  }

  removeSongs() {
    this.removePlaylistTracksData(this.playlist, this.selectedTracks).then(value => {
      if (value) {
        this.selectedTrackIds = []
        this.getSongs()
      }
    })
  }

  editPlaylist(bvModalEvent: BvModalEvent) {
    bvModalEvent.preventDefault()
    this.editPlaylistData({
      id: this.playlist.id,
      images: this.playlist.images,
      name: this.name,
      description: this.description,
      public: this.checkboxes.public,
      collaborative: this.checkboxes.collaborative
    }).then(value => {
      if (value) {
        this.$nextTick(() => {
          this.$bvModal.hide(this.id)
        })
      }
    })
  }

  selectSong(track: ITrack) {
    if (this.selectedTrackIds.includes(track.id)) {
      this.selectedTrackIds.splice(this.selectedTrackIds.indexOf(track.id), 1)
    } else {
      this.selectedTrackIds.push(track.id)
    }
  }
}
</script>

<style>

</style>