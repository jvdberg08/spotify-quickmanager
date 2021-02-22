<template>
  <b-col :class="containerSize">
    <b-dropdown :id="id" class="menu-button" :text="buttonText" :size="buttonSize" :variant="buttonVariant">
      <slot/>
    </b-dropdown>
  </b-col>
</template>

<script lang="ts">

import {Component} from "vue-property-decorator";
import MenuButton from "@/components/MenuButton.vue";

@Component
export default class MenuDropdownButton extends MenuButton {
}
</script>

<style scoped>
.menu-button {
  width: 10vw;
  min-width: 125px;
}
</style>