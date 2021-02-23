<template>
  <b-modal scrollable :id="id" title="Add Songs To Playlists" size="xl" @ok="addSongs">
    <b-container fluid="">
      <b-row class="text-center justify-content-center">
        <MenuButton :id="'previous-button'" container-size="col-4 col-lg-3"
                    button-text="Previous" button-size="lg"
                    button-variant="secondary" @click="goToPage(page - 1)"/>

        <MenuButton :id="'refresh-button'" container-size="col-4 col-lg-3"
                    button-text="Refresh" button-size="lg"
                    button-variant="primary" @click="getPlaylists"/>

        <MenuButton :id="'previous-button'" container-size="col-4 col-lg-3"
                    button-text="Next" button-size="lg"
                    button-variant="secondary" @click="goToPage(page + 1)"/>
      </b-row>

      <DataContainer container-classes="px-5 mx-5 pt-3" :min-height="40">
        <SearchContainer :items="playlists" :types="filterOptions" v-model="filteredPlaylists">
          <b-col class="p-2" cols="12" v-for="playlist in shownPlaylists" :key="playlist.id"
                 @click="selectPlaylist(playlist)">
            <Playlist :playlist="playlist" :is-selected="selectedPlaylists.includes(playlist)"/>
          </b-col>
        </SearchContainer>
      </DataContainer>

    </b-container>
  </b-modal>
</template>

<script lang="ts">
import Playlist from "@/components/Playlist.vue";
import MenuButton from "@/components/MenuButton.vue";
import DataContainer from "@/components/DataContainer.vue";

import {Component, Prop} from "vue-property-decorator";
import {Playlist as IPlaylist, Track as ITrack} from "@/mixins/interfaces"
import PlaylistAPI from "@/mixins/playlist_api";
import {BvEvent, BvModalEvent} from "bootstrap-vue";
import SearchContainer, {FilterType} from "@/components/SearchContainer.vue";

@Component({
  components: {
    Playlist,
    MenuButton,
    DataContainer,
    SearchContainer
  }
})
export default class SelectPlaylistModal extends PlaylistAPI {
  filterOptions = [FilterType.Name, FilterType.Description, FilterType.Owner]

  @Prop({required: true}) id!: string
  @Prop({required: true}) tracks!: ITrack[]

  page = 0
  itemsPerPage = 5

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

  get shownPlaylists(): IPlaylist[] {
    return this.filteredPlaylists.slice(this.page * this.itemsPerPage, (this.page + 1) * this.itemsPerPage)
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

  goToPage(newPage: number) {
    if (newPage >= 0 && newPage * this.itemsPerPage < this.playlists.length) {
      this.page = newPage
    }
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