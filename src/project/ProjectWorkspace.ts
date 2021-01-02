import Node, { NodeConstructor } from '@/nodes/Node';
import { ProjectFileWorkspaceInterface } from './ProjectFileInterface';
import ProjectWorkspaceBoard from './ProjectWorkspaceBoard';

export default class ProjectWorkspace {
  public readonly currentBoard = new ProjectWorkspaceBoard();

  serialize(): ProjectFileWorkspaceInterface {
    return {
      boards: [
        this.currentBoard.serialize()
      ]
    }
  }

  allNodes(): Node[] {
    return this.currentBoard.allNodes();
  }

  registerNodeType(node: NodeConstructor) {
    console.log(`Register ${node.componentId}`);
    this.currentBoard.editor.registerNodeType(node.componentId, node);
  }
}