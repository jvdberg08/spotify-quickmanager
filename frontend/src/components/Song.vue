<template>
  <b-col :class="{ 'song-container-is-selected': isSelected }"
         class="song-container p-3">

    <div class="float-left song-image-container">
      <b-img :src="song.track.album.images[2].url"/>
    </div>

    <b-row>
      <b-col cols="11">
        <b-row>
          <b-col cols="12" class="song-name"><strong>{{ song.track.name }}</strong></b-col>
          <b-col cols="12" class="song-artists">{{ song.track.artists.map(artist => artist.name).join(', ') }}</b-col>
        </b-row>
      </b-col>
      <b-col v-if="withHandle" class="p-0 pr-3" cols="1">
        <b-icon class="h2 float-right mt-3" icon="list"/>
      </b-col>
    </b-row>
  </b-col>
</template>

<script>
export default {
  name: "Song",

  props: {
    song: Object,
    isSelected: Boolean,
    withHandle: Boolean
  }
}
</script>

<style scoped>
.song-container {
  cursor: pointer;
  text-align: center;
  border: 1px solid rgba(0, 0, 0, 0.1);
  box-sizing: border-box;
  box-shadow: 0 4px 4px rgba(0, 0, 0, 0.25);
  border-radius: 30px;
}

.song-container-is-selected {
  background-color: #3471eb80;
}

.song-name {
  text-align: left;
  font-size: 22px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.song-artists {
  text-align: left;
  font-size: 18px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.song-image-container {
  max-width: 64px;
  max-height: 64px;
  /*float: left;*/
}

.song-image-container img {
  border-radius: 15px;
}
</style>