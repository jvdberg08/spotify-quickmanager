<template>
  <div id="button-playlist-add" class="mx-2 text-center" @click="$emit('click')">
    <img id="button-playlist-add-img" src="../../public/playlists-transparent.svg" alt="Add To Playlist Button"/>
  </div>
</template>

<script lang="ts">
import {Component, Vue} from "vue-property-decorator";

@Component
export default class ButtonPlaylistAdd extends Vue {
}
</script>

<style scoped>

#button-playlist-add {
  height: 40px;
  width: 40px;
  float: right;
  background-color: #4CB963;
  border-radius: 45px;
  cursor: pointer;
}

#button-playlist-add:hover {
  background-color: #157F1F;
}

#button-playlist-add-img {
  height: 18px;
  width: 18px;
  margin-top: 11px;
  filter: invert(100%);
}
</style>