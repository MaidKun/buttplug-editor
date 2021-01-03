import Device, { DevicePort } from '@/device/Device';

export default class DeviceFeatureOptionValue {
  private _device: Device;
  private _port: DevicePort;

  constructor(device: Device, port: DevicePort) {
    this._device = device;
    this._port = port;
  }

  getHash() {
    return `${this._device.id}//${this._port.id}`;
  }

  getText() {
    return `${this._device.name}: ${this._port.name}`;
  }

  setInputValue(value: number) {
    this._device.setInputValue(this._port, value);
  }

  getSensorValue() {
    const data = this._device.getSensorValues().find(data => data.name === this._port.name);
    if (!data) {
      return 0;
    }

    return data.value;
  }
}