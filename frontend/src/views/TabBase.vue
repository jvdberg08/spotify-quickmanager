<template>
  <b-row v-if="!requireAuthorization || this.$store.getters.checkAuthorization">
    <slot/>
  </b-row>
  <b-row v-else style="min-height: 60vh">
    <b-col class="text-center m-auto">
      <h3><strong>You are not logged in.<br/>Please log in below to view this page!</strong></h3>
      <b-button class="login-button mt-4" variant="dark" href="http://127.0.0.1:8000/spotifyauth/authorize">
        Log In With Spotify
        <img class="login-icon mb-1 ml-1" src="../../public/spotify-icon.png" alt="Log In With Spotify">
      </b-button>
    </b-col>
  </b-row>
</template>

<script>
export default {
  name: "TabBase",

  props: {
    requireAuthorization: {
      required: true,
      type: Boolean
    }
  },

  mounted() {
    console.log(this.requireAuthorization)
  }
}
</script>

<style scoped>
.login-button {
  border-radius: 25px;
  font-size: 1.75rem;
  width: 22.5vw;
  height: 7.5vh;
}

.login-icon {
  height: 36px;
  width: 36px;
}
</style>