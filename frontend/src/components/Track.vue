<template>
  <b-col :class="{ 'track-container-is-selected': isSelected }"
         class="track-container p-3">

    <div class="float-left track-image-container">
      <b-img :src="track.album.images[2].url"/>
    </div>

    <b-row>
      <b-col cols="11">
        <b-row>
          <b-col cols="12" class="track-name"><strong>{{ track.name }}</strong></b-col>
          <b-col cols="12" class="track-artists">{{ track.artists.map(artist => artist.name).join(', ') }}</b-col>
        </b-row>
      </b-col>
      <b-col v-if="withHandle" class="p-0 pr-3" cols="1">
        <b-icon class="h2 float-right mt-3" icon="list"/>
      </b-col>
    </b-row>
  </b-col>
</template>

<script lang="ts">
import {Prop, Component, Vue} from 'vue-property-decorator'
import {Track as ITrack} from "@/mixins/interfaces";

@Component
export default class Track extends Vue {
  @Prop({required: true}) track!: ITrack
  @Prop({required: true}) isSelected!: boolean
  @Prop({default: false}) withHandle!: boolean
}
</script>

<style scoped>
.track-container {
  cursor: pointer;
  text-align: center;
  background-color: #1B2352;
  color: #BCD2EE;
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 30px;
}

.track-container-is-selected {
  background-color: #3471eb80;
}

.track-name {
  text-align: left;
  font-size: 22px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.track-artists {
  text-align: left;
  font-size: 18px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.track-image-container {
  max-width: 64px;
  max-height: 64px;
}

.track-image-container img {
  border-radius: 15px;
}
</style>