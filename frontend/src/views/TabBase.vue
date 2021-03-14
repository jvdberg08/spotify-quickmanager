<template>
  <b-row no-gutters v-if="!requireAuthorization || this.$store.getters.checkAuthorization">
    <slot/>
  </b-row>
  <b-row v-else id="login-container">
    <b-col class="text-center m-auto">
      <h3 id="login-text"><strong>You are not logged in.<br/>Click the button below or on the bottom of the navigation
        bar to log in!</strong></h3>
      <b-button id="login-button" class="mt-3 px-4 py-2" variant="primary"
                :href="backendAuthUrl">
        Log In With Spotify
        <img id="login-icon" class="mb-1 ml-1" src="../../public/spotify-icon.png" alt="Log In With Spotify">
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
#login-container {
  min-height: 90vh;
}

#login-text {
  color: #BCD2EE;
}

#login-button {
  border-radius: 25px;
  font-size: 1.75rem;
  background-color: #1B2352;
  border-color: #1B2352;
  transition: transform 0.5s;
}

#login-button:hover {
  transform: scale(1.05);
}

#login-icon {
  height: 36px;
  width: 36px;
}
</style>