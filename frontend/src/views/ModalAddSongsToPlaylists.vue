<template>
  <b-modal scrollable :id="id" title="Add Songs To Playlists" size="xl" @ok="addSongs">
    <b-container fluid="">

      <MenuBar :objects="playlists" v-model="filteredPlaylists">
        <ButtonRefresh @click="getPlaylists"/>
      </MenuBar>

      <DataContainer class="py-2 no-gutters" :min-height="40">
        <b-col cols="12" class="py-2" v-for="playlist in filteredPlaylists" :key="playlist.id"
               @click="selectPlaylist(playlist)">
          <Playlist :playlist="playlist" :is-selected="selectedPlaylists.includes(playlist)"/>
        </b-col>
      </DataContainer>
    </b-container>
  </b-modal>
</template>

<script lang="ts">
import Playlist from "@/components/Playlist.vue";
import DataContainer from "@/components/DataContainer.vue";
import MenuBar from "@/components/MenuBar.vue";

import {Component, Prop} from "vue-property-decorator";
import {Playlist as IPlaylist, Track as ITrack} from "@/mixins/interfaces"
import PlaylistAPI from "@/mixins/playlist_api";
import {BvEvent, BvModalEvent} from "bootstrap-vue";
import ButtonRefresh from "@/components/ButtonRefresh.vue";

@Component({
  components: {
    ButtonRefresh,
    MenuBar,
    Playlist,
    DataContainer,
  }
})
export default class ModalAddSongsToPlaylists extends PlaylistAPI {

  @Prop({required: true}) id!: string
  @Prop({required: true}) tracks!: ITrack[]

  playlists: IPlaylist[] = []
  filteredPlaylists: IPlaylist[] = []
  selectedPlaylistIds: string[] = []

  mounted() {
    this.$root.$on('bv::modal::show', (bvEvent: BvEvent, modalId: string) => {
      if (modalId === this.id) {
        this.getPlaylists()
      }
    })
  }

  get selectedPlaylists(): IPlaylist[] {
    return this.playlists.filter(playlist => this.selectedPlaylistIds.includes(playlist.id))
  }

  getPlaylists() {
    this.getPlaylistsData().then(playlists => this.playlists = playlists)
  }

  addSongs(bvModalEvent: BvModalEvent) {
    bvModalEvent.preventDefault()
    if (!this.selectedPlaylists.length) {
      this.$bvModal.msgBoxOk('Please select at least one playlist!', {
        title: 'Error', okVariant: 'danger'
      })
      return
    }

    this.addPlaylistsTracksData(this.selectedPlaylists, this.tracks).then(value => {
      if (value) {
        this.$nextTick(() => {
          this.$bvModal.hide(this.id)
        })
      }
    })
  }

  selectPlaylist(playlist: IPlaylist) {
    if (this.selectedPlaylistIds.includes(playlist.id)) {
      this.selectedPlaylistIds.splice(this.selectedPlaylistIds.indexOf(playlist.id), 1)
    } else {
      this.selectedPlaylistIds.push(playlist.id)
    }
  }
}
</script>

<style scoped>

</style>