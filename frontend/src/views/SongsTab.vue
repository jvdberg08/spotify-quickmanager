<template>
  <b-row v-if="likedSongs != null" class="songs-container py-3 px-0 px-sm-5 ">
    <b-col cols="12">
      <b-row align-h="center">
        <b-col cols="2">
          <b-btn class="song-menu-button" size="lg" variant="outline-danger" v-on:click="deleteSongs(selectedSongs)">
            Delete Selected
          </b-btn>
        </b-col>
        <b-col cols="2">
          <b-btn class="song-menu-button" size="lg" variant="outline-success">
            Add To Playlist (Todo)
          </b-btn>
        </b-col>
        <b-col cols="2" class="justify-content-center">
          <b-btn class="song-menu-button" size="lg" variant="outline-primary" v-on:click="getSongs(0, 25)">
            Refresh Songs
          </b-btn>
        </b-col>
      </b-row>
    </b-col>

    <b-col v-for="(song, index) in likedSongs.items" :key="String(song.track.id)" cols="12" lg="6" xl="4"
           class="py-4 px-5">
      <b-row>
        <b-col class="song-container p-0 m-auto">
          <b-row class="song-half-container pt-3 pl-3">
            <b-col cols="2" class="song-image-container">
              <b-img :src="song.track.album.images[2].url"/>
            </b-col>
            <b-col cols="8" class="pl-4">
              <b-row>
                <b-col class="song-name">
                  <strong> {{ song.track.name }}</strong>
                </b-col>
              </b-row>
              <b-row>
                <b-col class="song-artists">
                  {{ getArtistString(song) }}
                </b-col>
              </b-row>
            </b-col>
            <b-col cols="2" class="song-select-container pl-4">
              <b-form-checkbox :id="'select-song-' + index" :value="song.track.id" v-model="selectedSongs"
                               size="lg"/>
            </b-col>
          </b-row>
          <b-row class="song-half-container p-3">
          </b-row>
        </b-col>
      </b-row>
    </b-col>
  </b-row>
</template>

<script>
import ApiInterface from "@/api-interface"
import Util from "@/util"

export default {
  mixins: [ApiInterface, Util],
  name: "SongsTab",

  data() {
    return {
      selectedSongs: []
    }
  },

  beforeMount() {
    this.getSongs(0, 25)
  },
}
</script>

<style scoped>

.song-menu-button {
  margin-left: auto;
}

.song-container {
  min-width: 400px;
  max-width: 600px;
  min-height: 140px;

  text-align: center;
  border: 1px solid rgba(0, 0, 0, 0.1);
  box-sizing: border-box;
  box-shadow: 0 4px 4px rgba(0, 0, 0, 0.25);
  border-radius: 30px;
}

.song-name {
  text-align: left;
  font-size: 22px;
  white-space: nowrap;
  overflow: hidden;
}

.song-artists {
  text-align: left;
  font-size: 18px;
  white-space: nowrap;
  overflow: hidden
}

.song-image-container {
  max-width: 64px;
}

.song-image-container img {
  border-radius: 15px;
}

</style>