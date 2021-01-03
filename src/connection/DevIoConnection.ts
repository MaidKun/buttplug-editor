import Device from '@/device/Device';
import DevIoDevice from '@/device/DevIoDevice';
import Connection from './Connection';
import * as DevIo from './DevIo';

export default class DevIoConnection extends Connection {
  private url: string;
  private socket?: WebSocket;
  nextId = 1;
  private devices: {[index: number]: DevIoDevice} = {}

  private messageResponseMap: {[id: number]: DevIo.DevIoMessageWaitItem} = {};

  constructor(address='127.0.0.1', port=12345) {
    super();

    this.url = `ws://${address}:${port}/`;
  }

  getDevices(): Device[] {
    return Object.values(this.devices);
  }

  send(message: DevIo.DevIoClientMessage) {
    if (!this.socket) {
      throw new Error(`Can not send message when socket is not connected`);
    }
    this.socket.send(JSON.stringify([message]));
  }

  async sendAndWait<T extends DevIo.DevIoMessage=DevIo.DevIoMessage>(message: DevIo.DevIoClientMessage): Promise<T> {
    const key = Object.keys(message)[0] as keyof DevIo.DevIoClientMessage;
    if (!key) {
      throw new Error('message must contain one message');
    }
    const id = (message[key] as DevIo.DevIoMessage).Id;

    return new Promise<T>((resolve, reject) => {
      this.messageResponseMap[id] = {resolve: resolve as (item: DevIo.DevIoMessage) => unknown, reject};
      this.send(message);
    })
  }

  loadDeviceList(message: DevIo.DevIoDeviceListMessage) {
    console.log(`Receives device list with ${message.Devices.length} devices`);

    for (const device of message.Devices) {
      this.addDevice(device);
    }
  }

  updateSensor(message: DevIo.DevIoSensorUpdateMessage) {
    const device = this.devices[message.DeviceIndex];
    device.setSensorValue(message.Sensor, message.Value);
  }

  addDevice(device: DevIo.DevIoDeviceInfo) {
    if (this.devices[device.DeviceIndex]) {
      return;
    }

    this.devices[device.DeviceIndex] = new DevIoDevice(`Device${device.DeviceIndex}@${this.url}`, this, device);
    this.dispatchEvent(new CustomEvent('deviceadded', {detail: this.devices[device.DeviceIndex]}));
  }

  triggerDeviceEventsAgain() {
    for (const detail of Object.values(this.devices)) {
      this.dispatchEvent(new CustomEvent('deviceadded', {detail}))
    }
  }

  onMessage(message: DevIo.DevIoServerMessage) {
    const key = Object.keys(message)[0] as keyof DevIo.DevIoServerMessage;
    if (!key) {
      console.error('Server sent empty message');
      return;
    }

    const id = (message[key] as DevIo.DevIoMessage).Id;
    if (this.messageResponseMap[id]) {
      this.messageResponseMap[id].resolve(message[key] as DevIo.DevIoMessage);
      return;
    }

    switch (key) {
      case 'Ok':
        break;
      case 'DeviceList':
        this.loadDeviceList(message[key] as DevIo.DevIoDeviceListMessage)
        break;
      case 'SensorUpdate':
        this.updateSensor(message[key] as DevIo.DevIoSensorUpdateMessage);
        break;

      default:
        console.error(`Unknown server message: ${key}`);
    }
  }

  disconnected=() => {
    console.error('TODO: disconnected');
    // for (const device of Object.values(this.devices)) {
    //   this.removeDevice(device.device);
    // }

    // this.devices = {}
  }
  
  connect() {
    return new Promise<void>((resolve) => {
      let isConnected = false;

      this.socket = new WebSocket(this.url);
      
      this.socket.onopen = async () => {
        isConnected = true;
        console.log(`Connected to server. Wait for server info.`);
        const serverInfo = await this.sendAndWait<DevIo.DevIoServerInfoMessage>({RequestServerInfo: {Id: this.nextId++, ClientName: 'Buttplug Editor'}});
        console.log(`Server name is: ${serverInfo.ServerName}`);
        this.send({RequestDeviceList: {Id: this.nextId++}});
        resolve();
      }

      this.socket.onmessage = (data) => {
        for (const row of JSON.parse(data.data)) {
          this.onMessage(row);
        }
      }

      this.socket.onclose = () => {
        this.disconnected();
      }

      this.socket.onerror = (err) => {
        if (isConnected) {
          console.error(err);
        } else {
          throw err;
        }
      }
    });
  }

  async disconnect() {
    if (!this.socket) {
      return;
    }

    this.socket.close();
  }
}
