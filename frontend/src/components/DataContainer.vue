<template>
  <b-row :class="containerClasses" :style="{minHeight: getMinHeight + 'vh'}">
    <b-col v-if="$store.getters.isLoading" class="text-center m-auto">
      <b-spinner id="loading-spinner" class="spinner" type="grow" variant="primary"/>
    </b-col>
    <slot v-else/>
  </b-row>
</template>

<script lang="ts">
import {Component, Prop, Vue} from "vue-property-decorator";

@Component
export default class DataContainer extends Vue {

  @Prop({default: 'px-5 py-3'}) containerClasses!: string
  @Prop({default: 70}) minHeight!: number

  get getMinHeight() {
    return this.$store.getters.isLoading ? this.minHeight : 0
  }
}
</script>

<style scoped>
.spinner {
  height: 5vh;
  width: 5vh;
}
</style>