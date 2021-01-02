<template>
  <drop @drop="createNewComponent" style="width:100%;height:100%">
    <baklava-editor :plugin="viewPlugin"></baklava-editor>
  </drop>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

import Runtime from "../runtime/Runtime";
import Node from '../nodes/Node';
import { Drop } from 'vue-drag-drop'
import Project from '@/project/Project';

interface ViewNodeInterface {
  position: {x: number; y: number};
}

@Component({
  components: {
    Drop
  }
})
export default class NodeEditor extends Vue {
  private timer?: NodeJS.Timeout;

  @Prop()
  project!: Project;

  runtime = new Runtime();

  get board() {
    return this.project.currentWorkspace.currentBoard;
  }

  get viewPlugin() {
    return this.board.viewPlugin;
  }

  get engine() {
    return this.board.engine;
  }

  get editor() {
    return this.board.editor;
  }

  mounted() {
    this.start();
  }

  beforeDestroy() {
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = undefined;
    }
  }

  start() {
    this.runtime.reset();
    this.nextTick();
  }

  async nextTick() {
    this.timer = undefined;
    this.runtime.tick();

    const data = {time: this.runtime.getTime()};
    const result = await this.engine.calculate(data);
    if (!result) {
      return;
    }

    for (const component of result.keys()) {
      (component as Node).send(data);
    }

    this.timer = setTimeout(this.nextTick.bind(this), 100);
  }

  createNewComponent(component: string, event: DragEvent) {
    const node = this.project.nodes.create(component);
    if (!node) {
      return;
    }

    this.editor.addNode(node);


    const viewNode = node as unknown as ViewNodeInterface;
    viewNode.position.x = (event.offsetX / this.viewPlugin.scaling - this.viewPlugin.panning.x);
    viewNode.position.y = (event.offsetY / this.viewPlugin.scaling - this.viewPlugin.panning.y);
    
  }
}
</script>
