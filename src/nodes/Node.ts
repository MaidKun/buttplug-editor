import RuntimeData from '@/runtime/RuntimeData';
import {Node as BaklavaNode} from "@baklavajs/core";

export default abstract class Node extends BaklavaNode {
  // Category
  static componentId = "";
  static componentName = "Component";
  static category = 'all';
  static description = '';

  name = (this.constructor as NodeConstructor).componentName;
  type = (this.constructor as NodeConstructor).componentId;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-function
  send(data: RuntimeData) {}
}

export interface NodeConstructor {
  new (): Node;
  category: string;
  componentId: string;
  componentName: string;
  description: string;
}