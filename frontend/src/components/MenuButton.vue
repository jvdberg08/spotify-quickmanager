<template>
  <b-col :class="containerSize">
    <b-btn :id="id" class="menu-button" :size="buttonSize" :variant="buttonVariant"
           @click="$emit('clicked')">
      {{ buttonText }}
    </b-btn>
  </b-col>
</template>

<script>
export default {
  name: "MenuButton",
  props: {
    containerSize: String,
    id: String,
    buttonSize: String,
    buttonVariant: String,
    buttonText: String
  }
}
</script>

<style scoped>
.menu-button {
  width: 10vw;
  min-width: 125px;
}
</style>