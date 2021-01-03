import ConnectionManager from '@/connection/ConnectionManager';
import NodeRegistry from './NodeRegistry';
import ProjectFileInterface, { ProjectFileComponentInterface, ProjectFileIdentifier, ProjectFileVersion } from './ProjectFileInterface';
import ProjectLoaderV1 from './ProjectLoaderV1';
import ProjectWorkspace from './ProjectWorkspace';

export default class Project {
  public readonly nodes: NodeRegistry = new NodeRegistry();
  public readonly connections: ConnectionManager;

  protected workspace = new ProjectWorkspace;

  constructor(manager: ConnectionManager) {
    this.connections = manager;

    this.connections.addEventListener('deviceadded', this.onDeviceAdded);
    this.connections.addEventListener('deviceremoved', this.onDevicesRemoved);
    this.nodes.addEventListener('nodetypeadded', this.onNodeTypeAdded);
  }

  unload() {
    this.connections.removeEventListener('deviceadded', this.onDeviceAdded);
    this.connections.removeEventListener('deviceremoved', this.onDevicesRemoved);
    this.nodes.removeEventListener('nodetypeadded', this.onNodeTypeAdded);
  }

  private onDeviceAdded = (event: Event) => {
    this.nodes.addCustomDevice((event as CustomEvent).detail)
  }

  private onDevicesRemoved = (event: Event) => {
    this.nodes.removeCustomDevice((event as CustomEvent).detail)
  }

  private onNodeTypeAdded = (event: Event) => {
    this.workspace.registerNodeType((event as CustomEvent).detail)
  }

  async initialize() {
    this.nodes.registerDefaultNodes();
    this.connections.triggerDeviceEventsAgain();
  }

  get currentWorkspace() {
    return this.workspace;
  }

  static async load(json: ProjectFileInterface, manager: ConnectionManager): Promise<Project> {
    if (json.identifier !== ProjectFileIdentifier) {
      throw new Error(`Project identifier is invalid`);
    }

    if (json.version !== ProjectFileVersion) {
      throw new Error(`Project version is invalid`);
    }

    const loader = new ProjectLoaderV1(manager);
    return loader.load(json);
  }

  save() {
    const element = document.createElement('a');
    const data = JSON.stringify(this.serialize());
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(data));
    element.setAttribute('download', 'buttplugeditor-project.json');
  
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    setImmediate(() => {
      document.body.removeChild(element);
    });
  }

  serialize(): ProjectFileInterface {
    return {
      identifier: ProjectFileIdentifier,
      version: ProjectFileVersion,
      workspace: this.workspace.serialize(),
      components: this.serializeNodeTypes()
    }
  }

  serializeNodeTypes(): ProjectFileComponentInterface[] {
    const allNodes = this.workspace.allNodes().map(node => node.serializeType());
    const allNodesMap = allNodes.reduce((a, b) => {
      a[b.name] = b;
      return a;
    }, {} as {[id: string]: ProjectFileComponentInterface})

    return Object.values(allNodesMap);
  }
}