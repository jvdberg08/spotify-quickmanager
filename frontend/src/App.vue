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

<script>

import NavBar from "@/components/NavBar";

export default {
  name: "App",
  components: {
    NavBar
  }
}
</script>

<style scoped>
</style>