import { ProjectFileComponentInterface } from '@/project/ProjectFileInterface';
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

  //! Returns a hash if this component might be serialized
  hash(): string | null {
    const serialized = this.serializeType();
    if (serialized === null) {
      return serialized;
    }

    return JSON.stringify(serialized);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-function
  serializeType(): ProjectFileComponentInterface {
    return {
      origin: 'core',
      name: this.type,
      inputPorts: [],
      outputPorts: []
    };
  }
}

export interface NodeConstructor {
  new (): Node;
  category: string;
  componentId: string;
  componentName: string;
  description: string;
}