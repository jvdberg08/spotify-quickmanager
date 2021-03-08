<template>
  <div id="button-edit" class="mx-2 text-center" @click="$emit('click')">
    <img src="../../public/edit.svg" alt="Edit Button"/>
  </div>
</template>

<script lang="ts">
import {Component, Vue} from "vue-property-decorator";

@Component
export default class ButtonEdit extends Vue {
}
</script>

<style scoped>

#button-edit {
  height: 40px;
  width: 40px;
  float: right;
  background-color: #FDB321;
  border-radius: 45px;
  cursor: pointer;
}

#button-edit:hover {
  background-color: #DE9500;
}

#button-edit img {
  height: 20px;
  width: 20px;
  margin-top: 10px;
  filter: invert(100%);
}
</style>