<template>
  <b-col>
    <EditPlaylistModal :id="'edit-playlist-modal'" :playlist="selectedPlaylists[0]"/>
    <CreatePlaylistModal :id="'create-playlist-modal'"/>

    <b-col class="py-3 px-0 px-sm-5">

      <b-row class="text-center" align-h="center">
        <MenuButton :id="'previous-button'" container-size="col-4 col-sm-3 col-md-2"
                    button-text="Previous" button-size="lg" button-variant="secondary"
                    @click="goToPage(page - 1)"/>

        <MenuDropdownButton :id="'actions-dropdown-button'" container-size="col-4 col-sm-3 col-md-2"
                            button-text="Actions" button-size="lg" button-variant="primary">
          <b-dropdown-item id="refresh-dropdown-item" @click="getPlaylists">Refresh</b-dropdown-item>
          <b-dropdown-item id="create-dropdown-item" @click="$bvModal.show('create-playlist-modal')">
            Create
          </b-dropdown-item>
          <b-dropdown-item id="edit-dropdown-item" @click="openEditPlaylistModal">Edit</b-dropdown-item>
          <b-dropdown-item id="unfollow-dropdown-item" @click="unfollowPlaylists">Unfollow</b-dropdown-item>
          <b-dropdown-item id="change-public-private-dropdown-item"
                           @click="changePlaylistsStatus(EditPlaylistType.Visibility)">
            Make Public/Private
          </b-dropdown-item>
          <b-dropdown-item id="change-collaborative-dropdown-item"
                           @click="changePlaylistsStatus(EditPlaylistType.Collaboration)">
            Make Collaborative/Non-Collaborative
          </b-dropdown-item>
        </MenuDropdownButton>

        <MenuButton :id="'next-button'" container-size="col-4 col-sm-3 col-md-2"
                    button-text="Next" button-size="lg" button-variant="secondary"
                    @click="goToPage(page + 1)"/>
      </b-row>

      <DataContainer container-classes="px-5 py-3" :is-loading="isLoading">
        <SearchContainer :items="playlists" :types="filterOptions" v-model="filteredPlaylists">
          <b-col class="p-2" cols="12" lg="4" xl="3" v-for="playlist in shownPlaylists" :key="String(playlist.id)"
                 @click="selectPlaylist(playlist)">
            <Playlist :playlist="playlist" :is-selected="selectedPlaylists.includes(playlist)"/>
          </b-col>
        </SearchContainer>
      </DataContainer>

    </b-col>
  </b-col>
</template>

<script lang="ts">
import Playlist from "@/components/Playlist.vue";
import MenuButton from "@/components/MenuButton.vue";
import MenuDropdownButton from "@/components/MenuDropdownButton.vue";
import DataContainer from "@/components/DataContainer.vue";
import SearchContainer, {FilterType} from "@/components/SearchContainer.vue";
import EditPlaylistModal from "@/views/EditPlaylistModal.vue";

import {Component} from "vue-property-decorator";
import PlaylistAPI, {EditPlaylistType} from "@/mixins/playlist_api";
import {Playlist as IPlaylist} from "@/mixins/interfaces"
import CreatePlaylistModal from "@/views/CreatePlaylistModal.vue";

@Component({
  components: {
    CreatePlaylistModal,
    Playlist,
    MenuButton,
    MenuDropdownButton,
    EditPlaylistModal,
    DataContainer,
    SearchContainer
  }
})
export default class PlaylistsTab extends PlaylistAPI {
  EditPlaylistType = EditPlaylistType
  filterOptions = [FilterType.Name, FilterType.Description, FilterType.Owner]

  isLoading = false
  page = 0
  itemsPerPage = 28
  playlists: IPlaylist[] = []
  filteredPlaylists: IPlaylist[] = []
  selectedPlaylistIds: string[] = []

  async beforeMount() {
    if (this.$store.getters.checkAuthorization) {
      this.getPlaylists()
    }
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

</style>