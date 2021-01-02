import { Editor } from "@baklavajs/core";
import { ViewPlugin } from "@baklavajs/plugin-renderer-vue";
import { OptionPlugin } from "@baklavajs/plugin-options-vue";
import { InterfaceTypePlugin } from "@baklavajs/plugin-interface-types";
import { Engine } from "@baklavajs/plugin-engine";
import VisualizeOption from '@/components/option/VisualizeOption.vue';
import { ProjectFileBoardInterface } from './ProjectFileInterface';
import Node from '@/nodes/Node';

export default class ProjectWorkspaceBoard {
  public readonly editor = new Editor();
  public readonly viewPlugin = new ViewPlugin();
  public readonly optionPlugin = new OptionPlugin();
  public readonly intfTypePlugin = new InterfaceTypePlugin();
  public readonly engine = new Engine(false);

  constructor() {
    this.editor.use(this.optionPlugin);
    this.editor.use(this.viewPlugin);
    this.editor.use(this.intfTypePlugin);
    this.editor.use(this.engine);

    this.viewPlugin.registerOption('VisualizeOption', VisualizeOption);

    this.intfTypePlugin.addType("time", "#88ff00");
    this.intfTypePlugin.addType("number", "#888888");
    this.intfTypePlugin.addType("boolean", "#0088ff");
    this.intfTypePlugin.addConversion("time", "number", v => v);
    this.intfTypePlugin.addConversion("number", "time", v => v);
    this.intfTypePlugin.addConversion("boolean", "number", v => v ? 1 : -1);
    this.intfTypePlugin.addConversion("number", "boolean", v => v > 0 ? true : false);
  }

  serialize(): ProjectFileBoardInterface {
    return {
      state: this.editor.save()
    }
  }

  allNodes(): Node[] {
    return this.editor.nodes as Node[];
  }
}