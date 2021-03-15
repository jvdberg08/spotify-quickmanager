<template>
  <b-modal scrollable :id="id" title="Add Songs To Liked Songs" size="xl" @ok="addSongs">
    <b-container fluid="">

      <MenuBar v-model="searchQuery">
        <ButtonRefresh @click="search"/>
      </MenuBar>

      <DataContainer class="py-2 no-gutters" :min-height="40">
        <b-col cols="12" class="py-2" v-for="track in tracks" :key="track.id"
               @click="selectTrack(track)">
          <Track :track="track" :is-selected="selectedTracks.includes(track)"/>
        </b-col>
        <b-col v-if="searchQuery === ''" cols="12" class="text-center my-5 py-5">
          <h3>Search for songs you want to save in your Liked Songs!</h3>
        </b-col>
        <b-col v-else-if="!tracks.length" cols="12" class="text-center my-5 py-5">
          <h3>No songs were found! Please try again.</h3>
        </b-col>
      </DataContainer>
    </b-container>
  </b-modal>
</template>

<script lang="ts">
import {Component, Prop, Watch} from "vue-property-decorator";
import MenuBar from "@/components/MenuBar.vue";
import ButtonRefresh from "@/components/ButtonRefresh.vue"
import DataContainer from "@/components/DataContainer.vue"
import Track from "@/components/Track.vue";
import {Track as ITrack} from "@/mixins/interfaces";
import TrackAPI from "@/mixins/track_api";
import {BvModalEvent} from "bootstrap-vue";

@Component({
  components: {
    MenuBar,
    ButtonRefresh,
    DataContainer,
    Track
  }
})
export default class ModalAddSongsToSongs extends TrackAPI {

  @Prop({required: true}) id!: string

  searchQuery = ''
  lastSearch = -1

  tracks: ITrack[] = []
  selectedTracks: ITrack[] = []

  @Watch('searchQuery')
  onQueryChange() {
    const time = new Date().getTime()
    if (time > this.lastSearch + 1000) {
      this.search()
      this.lastSearch = time
    }
  }

  search() {
    if (this.searchQuery === '') return

    this.$store.commit('setIsLoading', true)
    this.$axios.get(process.env.VUE_APP_BACKEND_API + '/search', {
      params: {
        query: this.searchQuery,
        types: 'track'
      }
    }).then(response => {
      this.$store.commit('setIsLoading', false)
      this.tracks = response.data.tracks.items
    }).catch(this.handleAxiosError)
  }

  addSongs(bvModalEvent: BvModalEvent) {
    bvModalEvent.preventDefault()
    if (!this.selectedTracks.length) {
      this.$bvModal.msgBoxOk('Please select at least one track!', {
        title: 'Error', okVariant: 'danger'
      })
      return
    }

    this.addSongsData(this.selectedTracks).then(value => {
      if (value) {
        this.$nextTick(() => {
          this.selectedTracks = []
          this.$bvModal.hide(this.id)
        })
      }
    })
  }

  selectTrack(track: ITrack) {
    if (this.selectedTracks.includes(track)) {
      this.selectedTracks.splice(this.selectedTracks.indexOf(track), 1)
    } else {
      this.selectedTracks.push(track)
    }
  }

}
</script>

<style scoped>

</style>