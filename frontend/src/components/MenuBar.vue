<template>
  <b-row id="menu-bar" no-gutters class="p-3">
    <b-col id="search-bar" cols="4" lg="5" class="p-2 px-3">
      <label id="search-label" class="m-0">
        <input id="search-input" v-model="query" placeholder="Search..."/>
      </label>
    </b-col>

    <b-col id="menu-buttons" cols="8" lg="7" class="py-1">
      <slot/>
    </b-col>
  </b-row>
</template>

<script lang="ts">
import {Component, Prop, VModel, Vue, Watch} from "vue-property-decorator";

@Component
export default class MenuBar extends Vue {

  @Prop({required: true}) objects!: any[]
  @VModel() filteredObjects!: any[]

  query = ''

  @Watch('objects', {deep: true})
  onObjectsChange() {
    this.onQueryChange()
  }

  @Watch('query')
  onQueryChange() {
    this.filteredObjects = this.objects.filter(obj => this.filter(obj))
  }

  // eslint-disable-next-line
  filter(object: any): boolean {
    const query = this.query.toLowerCase()

    for (const key in object) {
      const value = object[key]

      if (typeof value === 'object') {
        if (this.filter(value)) return true
      } else if (typeof value === 'string') {
        if (value.toLowerCase().includes(query)) return true;
      } else if (typeof value === 'number') {
        if (value.toString().toLowerCase().includes(query)) return true;
      }
    }
    return false
  }

}
</script>

<style scoped>
#menu-bar {
  background-color: #1B2352;
  border-radius: 45px;
}

#search-bar {
  background-color: #BCD2EE10;
  border-radius: 45px;
}

#search-label {
  width: 100%;
  height: 100%;
}

#search-input {
  width: 100%;
  height: 100%;
  color: #BCD2EE;
  font-size: 18px;
  background-color: transparent;
  border: unset;
  outline: none;
}

#search-input::placeholder {
  color: #BCD2EE;
}
</style>