<template>
  <b-row :class="classes" :style="{minHeight: getMinHeight + 'vh'}">
    <b-col v-if="isLoading" class="text-center m-auto">
      <b-spinner class="spinner" type="grow" variant="primary"/>
    </b-col>
    <slot v-else/>
  </b-row>
</template>

<script>
export default {
  name: "DataContainer",

  props: {
    classes: String,
    minHeight: {default: 70, type: Number},
    isLoading: {required: true, type: Boolean}
  },

  computed: {
    getMinHeight() {
      return this.isLoading ? this.minHeight : 0
    }
  }
}
</script>

<style scoped>
.data-container {
  min-height: 70vh;
}

.spinner {
  height: 5vh;
  width: 5vh;
}
</style>