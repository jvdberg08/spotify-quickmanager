<template>
  <b-col :class="containerSize">
    <b-btn :id="id" class="menu-button" :size="buttonSize" :variant="buttonVariant" @click="$emit('click')">
      {{ buttonText }}
    </b-btn>
  </b-col>
</template>

<script lang="ts">
import {Component, Prop, Vue} from "vue-property-decorator";

@Component
export default class MenuButton extends Vue {
  @Prop({required: true}) containerSize!: string
  @Prop({required: true}) id!: string
  @Prop({required: true}) buttonSize!: string
  @Prop({required: true}) buttonVariant!: string
  @Prop({required: true}) buttonText!: string
}
</script>

<style scoped>
.menu-button {
  width: 10vw;
  min-width: 125px;
}
</style>