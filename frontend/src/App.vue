<template>
  <b-container id="container" fluid="" class="p-0">
    <b-row no-gutters>
      <b-container id="navbar-container" class="p-4 m-0 d-none d-sm-block">
        <NavBar/>
      </b-container>
      <b-container id="main-container" fluid="" class="px-3 py-4 m-0">
        <TabBase>
          <router-view/>
        </TabBase>
      </b-container>
    </b-row>
  </b-container>
</template>

<script lang="ts">

import NavBar from "@/components/NavBar.vue";
import {Component, Vue} from "vue-property-decorator";
import TabBase from "@/views/TabBase.vue";

@Component({
  components: {
    TabBase,
    NavBar
  }
})
export default class App extends Vue {
}
</script>

<style>

#container {
  background-color: #0F1745;
}

#navbar-container {
  height: 100vh;
  max-width: 124px;
}

#main-container {
  min-height: 100vh;
  border-top-left-radius: 30px;
}

@media (min-width: 576px) {
  #main-container {
    max-width: calc(100vw - 124px - 16px);
  }
}

.modal-content {
  background: #0F1745 !important;
  color: #BCD2EE;
}
</style>