<template>
  <div id="button-next" class="mx-2 text-center" @click="$emit('click')">
    <img src="../../public/next.svg" alt="Next Button"/>
  </div>
</template>

<script lang="ts">
import {Component, Vue} from "vue-property-decorator";

@Component
export default class ButtonNext extends Vue {
}
</script>

<style scoped>

#button-next {
  height: 40px;
  width: 40px;
  float: right;
  background-color: #757575;
  border-radius: 45px;
  cursor: pointer;
}

#button-next:hover {
  background-color: #575757;
}

#button-next img {
  height: 20px;
  width: 20px;
  margin-top: 10px;
  margin-left: 4px;
  filter: invert(100%);
}
</style>