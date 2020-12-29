<template>
  <div class="ComponentCategoryBrowser">
    <ul>
      <li v-for="item of nodes.categories" :key="item.id">
        <button v-on:click="setCategory(item.id)" v-bind:class="{active: item.id == category}" :title="item.name">
          <i :class="item.icon"></i>
        </button>
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import NodeRegistry from '@/project/NodeRegistry';
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component({
  components: {
  },
})
export default class ComponentCategoryBrowser extends Vue {
  @Prop()
  category!: string;

  @Prop()
  nodes!: NodeRegistry;

  setCategory(category: string) {
    this.$emit('categorychanged', category);
  }
}
</script>

<style lang="scss">
.ComponentCategoryBrowser {
  display: flex;
  width: 42px;
  border-right: 2px solid #222;
}

.ComponentCategoryBrowser ul,
.ComponentCategoryBrowser li {
  list-style: none;
  padding: 0;
  margin: 0;
  display: block;
}

.ComponentCategoryBrowser li {
  border-bottom: 1px solid #222;
}

.ComponentCategoryBrowser button {
  width: 40px;
  height: 34px;
  font-size: 20px;
  background: transparent;
  border: none;
  color: #bbb;
  cursor: pointer;

  &:hover {
    background-color: rgba(255,255,255,0.1);
  }

  &.active {
    background-color: rgba(255,255,255,0.2);
    color: #eee;
  }
}

</style>
