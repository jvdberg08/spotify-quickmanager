<template>
  <div id="button-previous" class="mx-2 text-center" @click="$emit('click')">
    <img src="../../public/next.svg" alt="Next Button"/>
  </div>
</template>

<script lang="ts">
import {Component, Vue} from "vue-property-decorator";

@Component
export default class ButtonPrevious extends Vue {
}
</script>

<style scoped>

#button-previous {
  height: 40px;
  width: 40px;
  float: right;
  background-color: #757575;
  border-radius: 45px;
  cursor: pointer;
}

#button-previous:hover {
  background-color: #575757;
}

#button-previous img {
  height: 20px;
  width: 20px;
  margin-top: 10px;
  margin-right: 4px;
  filter: invert(100%);
  transform: rotate(180deg);
}
</style>