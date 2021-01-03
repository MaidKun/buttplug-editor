import AsyncCache from '@/utils/AsyncCache';
import ButtplugIoConnection from './ButtplugIoConnection';
import Connection from './Connection';
import ConnectionConfiguration from './ConnectionConfiguration';
import DevIoConnection from './DevIoConnection';

export type ConnectionManagerState = 'disconnected' | 'connecting' | 'connected';

interface ConnectionConfigurationStatus {
  configuration: ConnectionConfiguration;
  connect?: AsyncCache<void>;
  connection?: Connection;
}

export default class ConnectionManager extends EventTarget {
  private _state: ConnectionManagerState = 'disconnected';
  private _connections: Connection[] = [];
  private _configurations: ConnectionConfigurationStatus[] = [];

  addDefaultConfigurations() {
    this.addConfiguration({protocol: 'buttplug', address: '127.0.0.1', port: 12345});
    this.addConfiguration({protocol: 'buttplug', address: '127.0.0.1', port: 12346});
    this.addConfiguration({protocol: 'dev', address: '127.0.0.1', port: 12355});
  }

  addConfiguration(configuration: ConnectionConfiguration) {
    this._configurations.push({configuration});
  }

  async findConnections() {
    this.state = 'connecting';

    await Promise.all(this._configurations.map(configuration => this.connect(configuration)));

    if (this._connections.length === 0) {
      this.state = 'disconnected';
    } else {
      this.state = 'connected';
    }
  }

  async connect(status: ConnectionConfigurationStatus) {
    if (status.connection) {
      return status.connection;
    }

    const connection = await this.createConnection(status.configuration);

    if (!status.connect) {
      status.connect = new AsyncCache(async () => {
        this.connectEvents(connection);
        await connection.connect();
        status.connection = connection;
        this._connections.push(connection);
        this.dispatchEvent(new CustomEvent('changed'));
      })
    }

    try {
      await status.connect.invoke();
    } catch(error) {
      status.connect = undefined;
      return null;
    }
  }

  async createConnection(config: ConnectionConfiguration) {
    switch (config.protocol) {
      case 'buttplug':
        await ButtplugIoConnection.initialize.invoke();
        return new ButtplugIoConnection(config.address, config.port);

      case 'dev':
        return new DevIoConnection(config.address, config.port);
  
      default:
        throw new Error(`Invalid protocol: ${config.protocol}`)
    }
  }

  private connectEvents(connection: Connection) {
    connection.addEventListener('deviceadded', (e) => {
      this.dispatchEvent(new CustomEvent('deviceadded', {detail: (e as CustomEvent).detail}))
    });
    connection.addEventListener('deviceremoved', (e) => {
      this.dispatchEvent(new CustomEvent('deviceremoved', {detail: (e as CustomEvent).detail}))
    });
  }

  triggerDeviceEventsAgain() {
    for (const connection of this._connections) {
      connection.triggerDeviceEventsAgain();
    }
  }

  get connections() {
    return this._connections;
  }

  get state() {
    return this._state;
  }

  set state(state: ConnectionManagerState) {
    this._state = state;
    this.dispatchEvent(new CustomEvent('changed'));
  }
}