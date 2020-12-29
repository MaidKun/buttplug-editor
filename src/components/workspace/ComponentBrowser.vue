<template>
  <div class="ComponentBrowser">
    <ComponentCategoryBrowser :nodes="nodes" :category="category" v-on:categorychanged="setCategory" />
    <ComponentBrowserList :nodes="nodes" :category="category" />
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import ComponentCategoryBrowser from './ComponentCategoryBrowser.vue';
import ComponentBrowserList from './ComponentBrowserList.vue';
import NodeRegistry from '@/project/NodeRegistry';

@Component({
  components: {
    ComponentCategoryBrowser,
    ComponentBrowserList
  },
})
export default class ComponentBrowser extends Vue {
  // Current category
  category = 'all';

  @Prop()
  nodes!: NodeRegistry;

  setCategory(category: string) {
    this.category = category;
  }
}
</script>

<style lang="scss">
.ComponentBrowser {
  display: flex;
  flex: 1;
  background: #444;
  border-right: 2px solid #222;
}
</style>
