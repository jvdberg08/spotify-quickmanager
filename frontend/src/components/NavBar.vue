<template>
  <b-row>
    <b-col>
      <b-row class="navbar-container">
        <b-col class="p-0 py-md-3" cols="12" md="10" lg="6" offset="0" offset-lg="3">
          <b-row class="items-container">
            <b-col cols="12" md="3">
              <router-link class="item" to="/songs" replace>Songs</router-link>
            </b-col>
            <b-col cols="12" md="3">
              <router-link class="item" to="/playlists" replace>Playlists</router-link>
            </b-col>
            <b-col cols="12" md="3">
              <router-link class="item" to="/albums" replace>Albums</router-link>
            </b-col>
            <b-col cols="12" md="3">
              <router-link class="item" to="/artists" replace>Artists</router-link>
            </b-col>
          </b-row>
        </b-col>
        <b-col class="pt-3 p-md-0 mb-3 m-md-0" align-self="center" md="2" xl="3" offset="0" offset-xl="0">
          <a v-if="isAuthorized" class="logout-button" href="http://127.0.0.1:8000/spotifyauth/un_authorize">Log Out</a>
          <a v-else class="login-button" href="http://127.0.0.1:8000/spotifyauth/authorize">Log In</a>
        </b-col>
      </b-row>

      <b-row>
        <b-col class="mx-4 horizontal-divider"></b-col>
      </b-row>
    </b-col>
  </b-row>
</template>

<script>
import ApiInterface from "@/mixins/api-interface"

export default {
  name: "NavBar",
  mixins: [ApiInterface],

  beforeMount() {
    this.checkAuthorization()
  }
}
</script>

<style scoped>

.navbar-container {
  text-align: center;
  min-width: 100vw;
}

.login-button {
  padding: 0.6vh 2vw;
  white-space: nowrap;

  text-decoration: none;
  font-size: 25px;

  border: 2px solid #47D13199;
  border-radius: 10px;
  background-color: transparent;
  color: #47D13199;
}

.login-button:hover {
  border-color: #47D131;
  background-color: transparent;
  color: #47D131;
}

.logout-button {
  padding: 0.6vh 2vw;
  white-space: nowrap;

  text-decoration: none;
  font-size: 25px;

  border: 2px solid #FF1B1BB3;
  border-radius: 10px;
  background-color: transparent;
  color: #FF1B1BB3;
}

.logout-button:hover {
  border-color: #FF1B1B;
  background-color: transparent;
  color: #FF1B1B;
  cursor: pointer;
}

.item {
  text-decoration: none;
  font-size: 30px;
  color: #00000099;
}

.item:hover {
  color: #000000;
}

/*noinspection CssUnusedSymbol*/
.router-link-exact-active {
  color: #000000;
}

.horizontal-divider {
  border: 1px solid #00000099;
}

</style>