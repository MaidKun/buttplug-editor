import ConnectionManager from '@/connection/ConnectionManager';
import NodeRegistry from './NodeRegistry';

export default class Project {
  public readonly nodes: NodeRegistry = new NodeRegistry();
  public readonly connections: ConnectionManager = new ConnectionManager();

  constructor() {
    this.connections.addEventListener('deviceadded', event => this.nodes.addCustomDevice((event as CustomEvent).detail));
    this.connections.addEventListener('deviceremoved', event => this.nodes.removeCustomDevice((event as CustomEvent).detail));
  }

  async initialize() {
    this.nodes.registerDefaultNodes();

    this.connections.addDefaultConfigurations();
    this.connections.findConnections().catch(err => console.error(err));
  }
}