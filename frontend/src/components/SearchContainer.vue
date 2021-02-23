<template>
  <b-col cols="12" class="p-0">
    <b-form inline @submit="$event.preventDefault()">
      <b-col cols="3" class="px-2 pb-2 m-0">
        <b-form-select
            id="filter-options"
            v-model="filterOption"
            :options="filterOptions"/>
      </b-col>

      <b-col cols="9" class="px-2 pb-2 m-0">
        <b-form-input
            id="filter-input"
            placeholder="Search..."
            v-model="filterInput"/>
      </b-col>
    </b-form>
    <b-row class="no-gutters">
      <slot/>
    </b-row>
  </b-col>
</template>

<script lang="ts">
import {Component, Prop, VModel, Vue, Watch} from "vue-property-decorator";

export enum FilterType {
  Name, Description, Artist, Album, Owner
}

@Component
export default class SearchContainer extends Vue {

  @VModel({type: Array}) filteredItems!: any[]
  @Prop({required: true}) items!: any[]
  @Prop({required: true}) types!: FilterType[]

  filterOption: FilterType = FilterType.Name
  filterInput = ""

  get filterOptions(): Array<{ text: string; value: FilterType }> {
    return this.types.map(type => {
      return {
        text: FilterType[type],
        value: type
      }
    })
  }

  @Watch('items', {deep: true})
  onItemChange() {
    this.onInputChange(this.filterInput)
  }

  @Watch('filterOption')
  onFilterChange() {
    this.onInputChange(this.filterInput)
  }

  @Watch('filterInput')
  onInputChange(val: string) {
    val = val.toLowerCase()
    if (val === '') {
      this.filteredItems = this.items
    } else if (this.filterOption === FilterType.Name) {
      this.filteredItems = this.items.filter(item => item.name.toLowerCase().includes(val))
    } else if (this.filterOption === FilterType.Artist) {
      this.filteredItems = this.items.filter(item => item.artists.map((artist: any) => artist.name).join().toLowerCase().includes(val))
    } else if (this.filterOption === FilterType.Album) {
      this.filteredItems = this.items.filter(item => item.album.map((album: any) => album.name).join().toLowerCase().includes(val))
    } else if (this.filterOption === FilterType.Description) {
      this.filteredItems = this.items.filter(item => item.description.toLowerCase().includes(val))
    } else if (this.filterOption === FilterType.Owner) {
      this.filteredItems = this.items.filter(item => item.owner.display_name.toLowerCase().includes(val))
    }
  }
}
</script>

<style scoped>
#filter-options {
  min-width: 100%;
}

#filter-input {
  min-width: 100%;
}
</style>