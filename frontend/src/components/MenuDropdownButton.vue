<template>
  <b-col :class="containerSize">
    <b-dropdown :id="id" class="menu-button" :text="buttonText" :size="buttonSize" :variant="buttonVariant">
      <slot/>
    </b-dropdown>
  </b-col>
</template>

<script>
import MenuButton from "@/components/MenuButton";

export default {
  name: "MenuDropdownButton",
  mixins: [MenuButton],
  props: {
    id: String
  }
}
</script>

<style scoped>
.menu-button {
  width: 10vw;
  min-width: 125px;
}
</style>