<template>
  <div id="button-refresh" class="mx-2 text-center" @click="$emit('click')">
    <img src="../../public/refresh.svg" alt="Refresh Button"/>
  </div>
</template>

<script lang="ts">
import {Component, Vue} from "vue-property-decorator";

@Component
export default class ButtonRefresh extends Vue {
}
</script>

<style scoped>

#button-refresh {
  height: 40px;
  width: 40px;
  float: right;
  background-color: #757575;
  border-radius: 45px;
  cursor: pointer;
}

#button-refresh:hover {
  background-color: #575757;
}

#button-refresh img {
  height: 20px;
  width: 20px;
  margin-top: 10px;
  filter: invert(100%);
}
</style>