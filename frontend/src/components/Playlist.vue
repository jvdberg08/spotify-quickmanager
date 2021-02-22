<template>
  <b-col :class="{ 'playlist-container-is-selected': isSelected }"
         class="playlist-container p-3">

    <b-row>
      <b-col cols="2" class="playlist-image-container">
        <b-img v-if="playlist.images[0] !== undefined" :src="playlist.images[0].url"/>
      </b-col>

      <b-col cols="8" class="pl-4">
        <b-row>
          <b-col class="playlist-name">
            <strong> {{ playlist.name }}</strong>
          </b-col>
        </b-row>
        <b-row>
          <b-col v-if="playlist.description" class="playlist-description">
            {{ playlist.description }}
          </b-col>
          <b-col v-else class="playlist-description">
            No description.
          </b-col>
        </b-row>
      </b-col>
    </b-row>
  </b-col>
</template>

<script lang="ts">
import {Prop, Component, Vue} from "vue-property-decorator";
import {Playlist as IPlaylist} from "@/mixins/interfaces";

@Component
export default class Playlist extends Vue {
  @Prop({required: true}) playlist!: IPlaylist
  @Prop({required: true}) isSelected!: boolean
}
</script>

<style scoped>
.playlist-container {
  cursor: pointer;
  text-align: center;
  border: 1px solid rgba(0, 0, 0, 0.1);
  box-sizing: border-box;
  box-shadow: 0 4px 4px rgba(0, 0, 0, 0.25);
  border-radius: 30px;
}

.playlist-container-is-selected {
  background-color: #3471eb80;
}

.playlist-name {
  text-align: left;
  font-size: 22px;
  white-space: nowrap;
  overflow: hidden;
}

.playlist-description {
  text-align: left;
  font-size: 18px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.playlist-image-container {
  max-width: 64px;
}

.playlist-image-container img {
  border-radius: 15px;
  max-width: 64px;
  max-height: 64px;
}
</style>