<template>
  <div>
    <b-container fluid="">
      <NavBar/>
    </b-container>
    <b-container fluid="">
      <router-view/>
    </b-container>
  </div>
</template>

<script lang="ts">

import NavBar from "@/components/NavBar.vue";
import {Component, Vue} from "vue-property-decorator";

@Component({
  components: {
    NavBar
  }
})
export default class App extends Vue {
}
</script>

<style scoped>
</style>