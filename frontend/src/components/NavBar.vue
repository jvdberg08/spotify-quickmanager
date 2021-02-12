<template>
  <b-row class="navbar-container">
    <b-col class="p-0 py-md-3" cols="12" md="8" offset-md="1" lg="6" offset-lg="3">
      <b-row class="items-container">
        <b-col cols="12" md="3">
          <router-link id="navigation-songs" class="item" to="/songs" replace>Songs</router-link>
        </b-col>
        <b-col cols="12" md="3">
          <router-link id="navigation-playlists" class="item" to="/playlists" replace>Playlists</router-link>
        </b-col>
        <b-col cols="12" md="3">
          <router-link id="navigation-albums" class="item" to="/albums" replace>Albums</router-link>
        </b-col>
        <b-col cols="12" md="3">
          <router-link id="navigation-artists" class="item" to="/artists" replace>Artists</router-link>
        </b-col>
      </b-row>
    </b-col>
    <b-col class="pt-3 p-md-0 mb-3 m-md-0" align-self="center" cols="12" md="2" xl="3">
      <b-button id="logout-button" v-if="this.$store.getters.checkAuthorization" @click="logout"
                class="logout-button" size="lg" variant="danger">
        Log Out
        <img class="logout-icon ml-2 my-auto" src="../../public/log-out.png" alt="Log Out button"/>
      </b-button>
    </b-col>
  </b-row>
</template>

<script>
import util from "@/mixins/util";

export default {
  name: "NavBar",
  mixins: [util],

  methods: {
    logout() {
      this.$axios.get('http://127.0.0.1:8000/spotifyauth/un_authorize', {
        withCredentials: true
      }).then(() => this.$store.commit('clearAuthorization'))
          .catch(error => this.createErrorDialog(error.response.status))
    }
  }
}
</script>

<style scoped>

.navbar-container {
  text-align: center;
  min-width: 100vw;;
}

.logout-button {
  min-width: 152px;
  font-size: 1.4em;
}

.logout-icon {
  height: 24px;
  width: 24px;
  -webkit-filter: invert(100%);
  filter: invert(100%);
}

.item {
  text-decoration: none;
  font-size: 30px;
  color: #00000099;
}

.item:hover {
  color: #000000;
}

.router-link-exact-active {
  color: #000000;
}
</style>