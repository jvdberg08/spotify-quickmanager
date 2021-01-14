<template>
  <b-col :class="containerSize">
    <b-dropdown class="menu-button" :text="buttonText" :size="buttonSize" :variant="buttonVariant">
      <slot/>
    </b-dropdown>
  </b-col>
</template>

<script>
import MenuButton from "@/components/MenuButton";

export default {
  name: "MenuDropdownButton",
  mixins: [MenuButton]
}
</script>

<style scoped>
.menu-button {
  width: 10vw;
  min-width: 125px;
}
</style>