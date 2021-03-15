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

      <MenuBar :objects="tracks" v-model="filteredTracks">
        <ButtonDelete @click="removeSongs"/>
        <ButtonRefresh @click="getSongs"/>
      </MenuBar>

      <DataContainer class="py-2 no-gutters" :min-height="40">
        <Draggable class="no-gutters" v-model="tracks" style="min-width: 100%"
                   animation="150" scroll-sensitivity="150" :force-fallback="true">
          <b-col cols="12" class="py-2" v-for="track in filteredTracks" :key="track.id"
                 @click="selectSong(track)">
            <Track :track="track" :is-selected="selectedTracks.includes(track)" :with-handle="true"/>
          </b-col>
        </Draggable>
      </DataContainer>

    </b-container>
  </b-modal>
</template>

<script lang="ts">
import Track from "@/components/Track.vue";
import DataContainer from "@/components/DataContainer.vue";
import Draggable from 'vuedraggable'

import {Component, Mixins, Prop, Watch} from "vue-property-decorator";
import {Playlist as IPlaylist, Track as ITrack} from "@/mixins/interfaces"
import TrackAPI from "../mixins/track_api";
import PlaylistAPI from "@/mixins/playlist_api";
import {BvEvent, BvModalEvent} from "bootstrap-vue";
import MenuBar from "@/components/MenuBar.vue";
import ButtonRefresh from "@/components/ButtonRefresh.vue";
import ButtonDelete from "@/components/ButtonDelete.vue";

@Component({
  components: {
    ButtonDelete,
    ButtonRefresh,
    MenuBar,
    Track,
    DataContainer,
    Draggable
  }
})
export default class ModalEditPlaylist extends Mixins(TrackAPI, PlaylistAPI) {

  @Prop({required: true}) id!: string
  @Prop({required: true}) playlist!: IPlaylist

  name = ''
  description = ''
  checkboxes = {
    public: false,
    collaborative: false
  }

  tracks: ITrack[] = []
  filteredTracks: ITrack[] = []
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
      collaborative: this.checkboxes.collaborative,
      owner: this.playlist.owner
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
.sortable-drag {
  opacity: 0;
}
</style>