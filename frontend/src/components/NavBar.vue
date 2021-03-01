<template>
  <b-row no-gutters id="navbar">
    <b-col id="navbar-items" class="my-auto">
      <router-link id="navbar-items-songs" to="/songs">
        <b-col class="p-0 my-4 text-center">
          <img src="../../public/liked_songs.svg" alt="Liked Songs"/>
        </b-col>
      </router-link>

      <router-link id="navbar-items-playlists" to="/playlists">
        <b-col class="p-0 my-4 text-center">
          <img src="../../public/playlists.svg" alt="Playlists"/>
        </b-col>
      </router-link>

      <router-link id="navbar-item-artists" to="/artists">
        <b-col class="p-0 my-4 text-center">
          <img src="../../public/artists.svg" alt="Artists"/>
        </b-col>
      </router-link>

      <router-link id="navbar-item-albums" to="/albums">
        <b-col class="p-0 my-4 text-center">
          <img src="../../public/albums.svg" alt="Albums"/>
        </b-col>
      </router-link>
    </b-col>

    <b-col v-if="$store.getters.checkAuthorization" id="navbar-logout"
           class="text-center navbar-account" align-self="end" @click="logout">
      <img src="../../public/logout.svg" alt="Log Out"/>
    </b-col>

    <b-col v-else id="navbar-login" class="text-center navbar-account" align-self="end">
      <a :href="backendAuthUrl">
        <img src="../../public/spotify-icon.png" alt="Log In With Spotify"/>
      </a>
    </b-col>
  </b-row>
</template>

<script lang="ts">
import {Component, Vue} from "vue-property-decorator";

@Component
export default class NavBar extends Vue {

  get backendAuthUrl() {
    return process.env.VUE_APP_BACKEND_AUTH + '/authorize'
  }

  logout() {
    this.$axios.get(process.env.VUE_APP_BACKEND_AUTH + "/un_authorize", {
      withCredentials: true
    }).then(() => {
      this.$store.commit('clearAuthorization')
    }).catch(error => console.log(error))
  }
}
</script>

<style scoped>

#navbar {
  height: 100%;
  background-color: #1B2352;
  border-radius: 45px;
}

.navbar-account {
  height: 72px;
  width: 100%;
  cursor: pointer;
}

#navbar-logout img {
  height: 24px;
  width: 24px;
  margin-top: 24px;
  filter: invert(100%);
}

#navbar-logout:hover img {
  filter: invert(29%) sepia(31%) saturate(6087%) hue-rotate(345deg) brightness(113%) contrast(112%) !important;
}

#navbar-login img {
  height: 28px;
  width: 28px;
  margin-top: 20px;
}

#navbar-items div {
  height: 56px;
  width: 100%;
  color: #0F1745;
  transition: margin-left 0.5s;
}

#navbar-items img {
  height: 32px;
  width: 32px;
  transition: margin-right 0.5s;
  margin-top: 12px;
  filter: brightness(0) saturate(100%) invert(10%) sepia(14%) saturate(6248%) hue-rotate(209deg) brightness(101%) contrast(104%);
}

#navbar-items img:hover {
  filter: drop-shadow(0px 0px 20px #BCD2EE) invert(79%) sepia(6%) saturate(1000%) hue-rotate(173deg) brightness(101%) contrast(102%) !important;
}

.router-link-active div {
  border-radius: 20px 0 0 20px;
  background-color: #0F1745;
  margin-left: 24px;
}

.router-link-active img {
  margin-right: 12px;
  filter: drop-shadow(0px 0px 20px #BCD2EE) invert(79%) sepia(6%) saturate(1000%) hue-rotate(173deg) brightness(101%) contrast(102%) !important;
}
</style>