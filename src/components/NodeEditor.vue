<template>
  <drop @drop="createNewComponent" style="width:100%;height:100%">
    <baklava-editor :plugin="viewPlugin"></baklava-editor>
  </drop>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { Editor } from "@baklavajs/core";
import { ViewPlugin } from "@baklavajs/plugin-renderer-vue";
import { OptionPlugin } from "@baklavajs/plugin-options-vue";
import { InterfaceTypePlugin } from "@baklavajs/plugin-interface-types";
import { Engine } from "@baklavajs/plugin-engine";

import Runtime from "../runtime/Runtime";
import Node from '../nodes/Node';
import { Drop } from 'vue-drag-drop'
import Project from '@/project/Project';
import VisualizeOption from './option/VisualizeOption.vue';

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

  editor = new Editor();
  viewPlugin = new ViewPlugin();
  optionPlugin = new OptionPlugin();
  intfTypePlugin = new InterfaceTypePlugin();
  engine = new Engine(false);
  runtime = new Runtime();

  created() {
    this.editor.use(this.optionPlugin);
    this.editor.use(this.viewPlugin);
    this.editor.use(this.intfTypePlugin);
    this.editor.use(this.engine);

    //this.viewPlugin.enableMinimap = true;
    this.viewPlugin.registerOption('VisualizeOption', VisualizeOption);

    this.intfTypePlugin.addType("time", "#88ff00");
    this.intfTypePlugin.addType("number", "#888888");
    this.intfTypePlugin.addType("boolean", "#0088ff");
    this.intfTypePlugin.addConversion("time", "number", v => v);
    this.intfTypePlugin.addConversion("number", "time", v => v);
    this.intfTypePlugin.addConversion("boolean", "number", v => v ? 1 : -1);
    this.intfTypePlugin.addConversion("number", "boolean", v => v > 0 ? true : false);
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
