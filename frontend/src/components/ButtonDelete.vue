<template>
  <div id="button-delete" class="mx-2 text-center" @click="$emit('click')">
    <img src="../../public/delete.svg" alt="Delete Button"/>
  </div>
</template>

<script lang="ts">
import {Component, Vue} from "vue-property-decorator";

@Component
export default class ButtonDelete extends Vue {
}
</script>

<style scoped>

#button-delete {
  height: 40px;
  width: 40px;
  float: right;
  background-color: #FF2600;
  border-radius: 45px;
  cursor: pointer;
}

#button-delete:hover {
  background-color: #C41D00;
}

#button-delete img {
  height: 20px;
  width: 20px;
  margin-top: 10px;
  filter: invert(100%);
}
</style>