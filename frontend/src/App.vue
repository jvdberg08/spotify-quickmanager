<template>
  <b-container id="container" fluid="">
    <b-row>
      <b-col id="navbar-container" class="p-4 d-none d-sm-block" cols="0" sm="1">
        <NavBar/>
      </b-col>
      <b-col id="main-container" class="px-3 py-4" cols="12" sm="11">
        <TabBase>
          <router-view/>
        </TabBase>
      </b-col>
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

<style scoped>

#container {
  background-color: #0F1745;
}
#navbar-container {
  height: 100vh;
  min-width: 104px;
  max-width: 124px;
}

#main-container {
  border-top-left-radius: 30px;
}
</style>