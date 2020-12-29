import Connection from './Connection';
import * as Buttplug from 'buttplug';
import AsyncCache from '@/utils/AsyncCache';
import ButtplugIoDevice from '@/device/ButtplugIoDevice';

export default class ButtplugIoConnection extends Connection {
  static initialize = new AsyncCache<void>(async () => {
    await Buttplug.buttplugInit();
    console.log('Buttplug initialized.');
  });

  private connector: Buttplug.ButtplugWebsocketConnectorOptions;
  private client: Buttplug.ButtplugClient;
  private devices: {[index: number]: ButtplugIoDevice} = {}

  constructor(address='127.0.0.1', port=12345) {
    super();

    this.connector = new Buttplug.ButtplugWebsocketConnectorOptions();
    this.connector.Address = `ws://${address}:${port}/`;

    this.client = new Buttplug.ButtplugClient("ButtplugEditor");

    this.client.addListener('deviceadded', this.addDevice);
    this.client.addListener('deviceremoved', this.removeDevice);
    this.client.addListener("disconnect", this.disconnected);
  }

  disconnected=() => {
    for (const device of Object.values(this.devices)) {
      this.removeDevice(device.device);
    }

    this.devices = {}
  }

  addDevice=(device: Buttplug.ButtplugClientDevice) => {
    if (this.devices[device.Index]) {
      return;
    }

    this.devices[device.Index] = new ButtplugIoDevice(`Device${device.Index}@${this.connector.Address}`, device);
    this.dispatchEvent(new CustomEvent('deviceadded', {detail: this.devices[device.Index]}));
  }

  removeDevice=(device: Buttplug.ButtplugClientDevice) => {
    if (!this.devices[device.Index]) {
      return;
    }

    this.dispatchEvent(new CustomEvent('deviceremoved', {detail: this.devices[device.Index]}));
    delete this.devices[device.Index];
  }

  async connect() {
    await this.client.connect(this.connector);
    await this.client.startScanning();
  }
}
