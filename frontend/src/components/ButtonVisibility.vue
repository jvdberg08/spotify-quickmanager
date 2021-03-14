<template>
  <div id="button-visibility" class="mx-2 text-center" @click="$emit('click')">
    <img src="../../public/eye.svg" alt="Visibility Button"/>
  </div>
</template>

<script lang="ts">
import {Component, Vue} from "vue-property-decorator";

@Component
export default class ButtonVis extends Vue {
}
</script>

<style scoped>

#button-visibility {
  height: 40px;
  width: 40px;
  float: right;
  background-color: #57B8FF;
  border-radius: 45px;
  cursor: pointer;
}

#button-visibility:hover {
  background-color: #3F88C5;
}

#button-visibility img {
  height: 20px;
  width: 20px;
  margin-top: 10px;
  filter: invert(100%);
}
</style>