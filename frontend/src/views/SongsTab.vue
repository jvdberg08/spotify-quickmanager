<template>
  <TabBase>
    <AddSongsToPlaylistModal :id="'add-songs-to-playlist-modal'" :tracks="selectedTracks"/>

    <b-col class="py-3 px-0 px-sm-5">
      <b-row class="text-center" align-h="center">
        <MenuButton :id="'previous-button'" container-size="col-4 col-sm-3 col-md-2"
                    button-text="Previous" button-size="lg" button-variant="secondary"
                    @click="goToPage(page - 1)"/>

        <MenuDropdownButton :id="'actions-dropdown-button'" container-size="col-4 col-sm-3 col-md-2"
                            button-text="Actions" button-size="lg" button-variant="primary">
          <b-dropdown-item @click="getSongs">Refresh</b-dropdown-item>
          <b-dropdown-item @click="openSelectPlaylistsModal">Add Selected To Playlist</b-dropdown-item>
          <b-dropdown-item @click="removeSongs">Remove Selected from Liked Songs</b-dropdown-item>
        </MenuDropdownButton>

        <MenuButton :id="'next-button'" container-size="col-4 col-sm-3 col-md-2"
                    button-text="Next" button-size="lg" button-variant="secondary"
                    @click="goToPage(page + 1)"/>
      </b-row>

      <DataContainer container-classes="px-5 py-3">
        <b-col class="p-2" cols="12" lg="4" xl="3" v-for="track in shownSongs" :key="String(track.id)"
               v-on:click="selectSong(track)">
          <Song :track="track" :is-selected="selectedTracks.includes(track)"/>
        </b-col>
      </DataContainer>
    </b-col>
  </TabBase>
</template>

<script lang="ts">
import Song from "@/components/Song.vue"
import TabBase from "@/views/TabBase.vue";
import DataContainer from "@/components/DataContainer.vue";
import MenuButton from "@/components/MenuButton.vue";
import MenuDropdownButton from "@/components/MenuDropdownButton.vue";
import AddSongsToPlaylistModal from "@/views/AddSongsToPlaylistsModal.vue";

import {Component} from 'vue-property-decorator'
import TrackAPI from "@/mixins/track_api";
import {Track as ITrack} from "@/mixins/interfaces";

@Component({
  components: {
    Song,
    TabBase,
    DataContainer,
    MenuButton,
    MenuDropdownButton,
    AddSongsToPlaylistModal
  }
})
export default class SongsTab extends TrackAPI {
  page = 0
  itemsPerPage = 28
  tracks: ITrack[] = []
  selectedTrackIds: string[] = []

  beforeMount() {
    if (this.$store.getters.checkAuthorization) this.getSongs()
  }

  get shownSongs(): ITrack[] {
    return this.tracks.slice(this.page * this.itemsPerPage, (this.page + 1) * this.itemsPerPage)
  }

  get selectedTracks(): ITrack[] {
    return this.tracks.filter(track => this.selectedTrackIds.includes(track.id))
  }

  getSongs() {
    this.getSongsData().then(tracks => this.tracks = tracks)
  }

  removeSongs() {
    this.removeSongsData(this.selectedTracks).then(success => {
      if (success) {
        this.selectedTrackIds = []
        this.getSongs()
      }
    })
  }

  goToPage(newPage: number) {
    console.log('lol')
    if (newPage >= 0 && newPage * this.itemsPerPage < this.tracks.length) {
      this.page = newPage
    }
    console.log(this.page)
  }

  selectSong(track: ITrack) {
    if (this.selectedTrackIds.includes(track.id)) {
      this.selectedTrackIds.splice(this.selectedTrackIds.indexOf(track.id), 1)
    } else {
      this.selectedTrackIds.push(track.id)
    }
  }

  openSelectPlaylistsModal() {
    if (!this.selectedTracks.length) {
      this.$bvModal.msgBoxOk('Please select at least one song!', {
        title: 'Error', size: 'sm', buttonSize: 'sm', okVariant: 'danger'
      })
    } else {
      this.$bvModal.show('add-songs-to-playlist-modal')
    }
  }
}
</script>

<style scoped>

</style>