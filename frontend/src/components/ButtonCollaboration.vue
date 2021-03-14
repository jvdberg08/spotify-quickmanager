<template>
  <div id="button-collaboration" class="mx-2 text-center" @click="$emit('click')">
    <img src="../../public/group.svg" alt="Collaboration Button"/>
  </div>
</template>

<script lang="ts">
import {Component, Vue} from "vue-property-decorator";

@Component
export default class ButtonCollaboration extends Vue {
}
</script>

<style scoped>

#button-collaboration {
  height: 40px;
  width: 40px;
  float: right;
  background-color: #57B8FF;
  border-radius: 45px;
  cursor: pointer;
}

#button-collaboration:hover {
  background-color: #3F88C5;
}

#button-collaboration img {
  height: 20px;
  width: 20px;
  margin-top: 10px;
  filter: invert(100%);
}
</style>