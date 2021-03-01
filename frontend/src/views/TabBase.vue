<template>
  <b-row no-gutters v-if="!requireAuthorization || this.$store.getters.checkAuthorization">
    <slot/>
  </b-row>
  <b-row v-else style="min-height: 60vh">
    <b-col class="text-center m-auto">
      <h3><strong>You are not logged in.<br/>Please log in below to view this page!</strong></h3>
      <b-button id="login-button" class="login-button mt-4 px-4 py-2" variant="dark"
                :href="backendAuthUrl">
        Log In With Spotify
        <img class="login-icon mb-1 ml-1" src="../../public/spotify-icon.png" alt="Log In With Spotify">
      </b-button>
    </b-col>
  </b-row>
</template>

<script lang="ts">
import {Component, Prop, Vue} from "vue-property-decorator";

@Component
export default class TabBase extends Vue {

  @Prop({default: true}) requireAuthorization!: boolean

  get backendAuthUrl() {
    return process.env.VUE_APP_BACKEND_AUTH + '/authorize'
  }
}
</script>

<style scoped>
.login-button {
  border-radius: 25px;
  font-size: 1.75rem;
}

.login-icon {
  height: 36px;
  width: 36px;
}
</style>