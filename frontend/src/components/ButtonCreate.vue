<template>
  <div id="button-create" class="mx-2 text-center" @click="$emit('click')">
    <img src="../../public/add.svg" alt="Create Button"/>
  </div>
</template>

<script lang="ts">
import {Component, Vue} from "vue-property-decorator";

@Component
export default class ButtonCreate extends Vue {
}
</script>

<style scoped>

#button-create {
  height: 40px;
  width: 40px;
  float: right;
  background-color: #4CB963;
  border-radius: 45px;
  cursor: pointer;
}

#button-create:hover {
  background-color: #157F1F;
}

#button-create img {
  height: 20px;
  width: 20px;
  margin-top: 10px;
  filter: invert(100%);
}
</style>