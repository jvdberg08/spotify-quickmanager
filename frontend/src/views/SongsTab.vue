<template>
  <b-col>
    <AddSongsToPlaylistModal :id="'add-songs-to-playlist-modal'" :tracks="selectedTracks"/>

    <MenuBar :objects="tracks" v-model="filteredTracks">
      <ButtonPlaylistAdd @click="openSelectPlaylistsModal"/>
      <ButtonDelete @click="removeTracks"/>
      <ButtonRefresh @click="getTracks"/>
    </MenuBar>

    <DataContainer id="tracks-container" class="py-2 mt-4 no-gutters">
      <b-col class="px-2 pb-3" cols="12" lg="4" xl="3" v-for="track in filteredTracks" :key="String(track.id)"
             v-on:click="selectSong(track)">
        <Track :track="track" :is-selected="selectedTracks.includes(track)"/>
      </b-col>
    </DataContainer>
  </b-col>
</template>

<script lang="ts">
import Track from "@/components/Track.vue";
import DataContainer from "@/components/DataContainer.vue";
import AddSongsToPlaylistModal from "@/views/AddSongsToPlaylistsModal.vue";

import {Component} from 'vue-property-decorator'
import TrackAPI from "@/mixins/track_api";
import {Track as ITrack} from "@/mixins/interfaces";
import MenuBar from "@/components/MenuBar.vue";
import ButtonDelete from "@/components/ButtonDelete.vue";
import ButtonPlaylistAdd from "@/components/ButtonPlaylistAdd.vue";
import ButtonRefresh from "@/components/ButtonRefresh.vue";

@Component({
  components: {
    ButtonRefresh,
    ButtonPlaylistAdd,
    ButtonDelete,
    MenuBar,
    Track,
    DataContainer,
    AddSongsToPlaylistModal
  }
})
export default class SongsTab extends TrackAPI {
  tracks: ITrack[] = []
  filteredTracks: ITrack[] = []
  selectedTrackIds: string[] = []

  beforeMount() {
    if (this.$store.getters.checkAuthorization) this.getTracks()
  }

  get selectedTracks(): ITrack[] {
    return this.tracks.filter(track => this.selectedTrackIds.includes(track.id))
  }

  getTracks() {
    this.getSongsData().then(tracks => this.tracks = tracks)
  }

  removeTracks() {
    this.removeSongsData(this.selectedTracks).then(success => {
      if (success) {
        this.selectedTrackIds = []
        this.getTracks()
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
#tracks-container {
  max-height: calc(100vh - 80px - 72px);
  overflow-y: auto;
}
</style>