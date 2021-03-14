<template>
  <b-col>
    <EditPlaylistModal :id="'edit-playlist-modal'" :playlist="selectedPlaylists[0]"/>
    <CreatePlaylistModal :id="'create-playlist-modal'"/>

    <MenuBar :objects="playlists" v-model="filteredPlaylists">
      <ButtonCreate @click="$bvModal.show('create-playlist-modal')"/>
      <ButtonEdit @click="openEditPlaylistModal"/>
      <ButtonVisibility @click="changePlaylistsStatus(EditPlaylistType.Visibility)"/>
      <ButtonCollaboration @click="changePlaylistsStatus(EditPlaylistType.Collaboration)"/>
      <ButtonDelete @click="unfollowPlaylists"/>
      <ButtonRefresh @click="getPlaylists"/>
    </MenuBar>

    <DataContainer id="playlists-container" class="py-2 mt-4 no-gutters">
      <b-col class="px-2 pb-4" cols="12" lg="4" xl="3" v-for="playlist in filteredPlaylists" :key="String(playlist.id)"
             @click="selectPlaylist(playlist)">
        <Playlist :playlist="playlist" :is-selected="selectedPlaylists.includes(playlist)"/>
      </b-col>
    </DataContainer>
  </b-col>
</template>

<script lang="ts">
import Playlist from "@/components/Playlist.vue";
import DataContainer from "@/components/DataContainer.vue";
import EditPlaylistModal from "@/views/EditPlaylistModal.vue";
import CreatePlaylistModal from "@/views/CreatePlaylistModal.vue";
import MenuBar from "@/components/MenuBar.vue";
import ButtonCreate from "@/components/ButtonCreate.vue";
import ButtonEdit from "@/components/ButtonEdit.vue";
import ButtonVisibility from "@/components/ButtonVisibility.vue";
import ButtonCollaboration from "@/components/ButtonCollaboration.vue";
import ButtonDelete from "@/components/ButtonDelete.vue";
import ButtonRefresh from "@/components/ButtonRefresh.vue";

import {Component} from "vue-property-decorator";
import PlaylistAPI, {EditPlaylistType} from "@/mixins/playlist_api";
import {Playlist as IPlaylist} from "@/mixins/interfaces"

@Component({
  components: {
    ButtonRefresh,
    ButtonDelete,
    ButtonCollaboration,
    ButtonVisibility,
    ButtonEdit,
    ButtonCreate,
    MenuBar,
    CreatePlaylistModal,
    Playlist,
    EditPlaylistModal,
    DataContainer,
  }
})
export default class PlaylistsTab extends PlaylistAPI {
  EditPlaylistType = EditPlaylistType

  playlists: IPlaylist[] = []
  filteredPlaylists: IPlaylist[] = []
  selectedPlaylistIds: string[] = []

  async beforeMount() {
    if (this.$store.getters.checkAuthorization) {
      this.getPlaylists()
    }
  }

  get selectedPlaylists(): IPlaylist[] {
    return this.playlists.filter(playlist => this.selectedPlaylistIds.includes(playlist.id))
  }

  getPlaylists() {
    this.getPlaylistsData().then(playlists => this.playlists = playlists)
  }

  unfollowPlaylists() {
    this.unfollowPlaylistsData(this.selectedPlaylists).then(value => {
      if (value) {
        this.selectedPlaylistIds = []
        this.getPlaylists()
      }
    })
  }

  changePlaylistsStatus(type: EditPlaylistType) {
    this.changePlaylistsStatusData(this.selectedPlaylists, type)
  }

  selectPlaylist(playlist: IPlaylist) {
    if (this.selectedPlaylistIds.includes(playlist.id)) {
      this.selectedPlaylistIds.splice(this.selectedPlaylistIds.indexOf(playlist.id), 1)
    } else {
      this.selectedPlaylistIds.push(playlist.id)
    }
  }

  openEditPlaylistModal() {
    if (this.selectedPlaylists.length !== 1) {
      this.$bvModal.msgBoxOk('Please select one playlist!', {
        title: 'Error', size: 'sm', buttonSize: 'sm', okVariant: 'danger'
      })
    } else {
      this.$bvModal.show('edit-playlist-modal')
    }
  }
}
</script>

<style scoped>
#playlists-container {
  max-height: calc(100vh - 80px - 72px);
  overflow-y: auto;
}
</style>