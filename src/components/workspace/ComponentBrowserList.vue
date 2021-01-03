<template>
  <div class="ComponentBrowserList">
    <ul>
      <li v-for="item of items" :key="item.componentId">
        <drag :transfer-data="item.componentId">
          <div class="ComponentBrowserListRecord">
            <strong>{{item.componentName}}</strong>
            <br/>
            <small>{{item.description}}</small>
          </div>
        </drag>
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { NodeConstructor } from '@/nodes/Node';
import NodeRegistry from '@/project/NodeRegistry';
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import { Drag } from 'vue-drag-drop'

@Component({
  components: {
    Drag
  },
})
export default class ComponentBrowserList extends Vue {
  @Prop()
  category!: string;

  @Prop()
  nodes!: NodeRegistry;

  created() {
    this.redraw = this.redraw.bind(this);
    this.onNodesChanged(this.nodes);
  }

  @Watch('nodes')
  onNodesChanged(nodes: NodeRegistry, oldNodes?: NodeRegistry) {
    if (oldNodes) {
      oldNodes.removeEventListener('notetypeadded', this.redraw);
    }
    nodes.addEventListener('nodetypeadded', this.redraw)
  }

  beforeDestroy() {
    this.nodes.removeEventListener('nodetypeadded', this.redraw);
  }

  redraw() {
    this.$forceUpdate();
  }

  get items(): NodeConstructor[] {
    return this.nodes.filtered(this.category);
  }
}
</script>

<style lang="scss">
.ComponentBrowserList {
  display: flex;
  flex: 1;
  overflow-y: auto;
}

.ComponentBrowserList ul,
.ComponentBrowserList li {
  display: block;
  width: 100%;
  list-style: none;
  padding: 0;
  margin: 0;
}

.ComponentBrowserList li {
  border-bottom: 1px solid #222;
}

.ComponentBrowserListRecord {
  display: block;
  background-color: #444;
  width: 100%;
  border: 0;
  color: #222;
  text-align: left;
  cursor: pointer;
  padding: 7px;
  line-height: 100%;

  strong {
    color: #eee;
    font-weight: normal;
  }

  small {
    color: #888;
    font-size: 10px;
  }

  &:hover {
    background-color: #515151;
  }
}

</style>
