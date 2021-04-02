import Device, { DevicePort } from './Device';
import * as DevIo from '../connection/DevIo';
import DevIoConnection from '@/connection/DevIoConnection';

export interface DevIoPort extends DevicePort {
  buttplugType: 'vibrate' | 'rotate' | 'sensor';
  buttplugIndex: number;
}

export default class DevIoDevice extends Device<DevIoPort> {
  public readonly device: DevIo.DevIoDeviceInfo;
  protected _inputPorts: DevIoPort[];
  protected _outputPorts: DevIoPort[];
  protected vibrators: number[] = [];
  protected rotators: number[] = [];
  protected _updatedPorts: DevIoPort[] = []
  protected socket: DevIoConnection;
  protected sensors: number[] = [];

  private valueChanged = false;

  constructor(id: string, socket: DevIoConnection, device: DevIo.DevIoDeviceInfo) {
    super(id, device.DeviceName);

    this.device = device;
    this.description = `DevIo device ${device.DeviceIndex}`;

    this._inputPorts = [];
    this._outputPorts = [];
    this.socket = socket;

    this.addVibrate();
    this.addRotate();
    this.addSensors();
  }

  private addVibrate() {
    const attributes = this.device.DeviceMessages.VibrateCmd;
    if (!attributes) {
      return;
    }

    for (let index=0; index<(attributes.FeatureCount || 1); index++) {
      this._inputPorts.push({
        type: 'number',
        tags: ['vibrate'],
        id: attributes.Identifier ? attributes.Identifier[index] : `vibrate${index}`,
        name: attributes.Description ? attributes.Description[index] : `Motor ${index + 1}`,
        buttplugType: 'vibrate',
        buttplugIndex: index
      })
    }
  }

  private addRotate() {
    const attributes = this.device.DeviceMessages.RotateCmd;
    if (!attributes) {
      return;
    }

    for (let index=0; index<(attributes.FeatureCount || 1); index++) {
      this._inputPorts.push({
        type: 'number',
        tags: ['rotate'],
        id: attributes.Identifier ? attributes.Identifier[index] : `rotate${index}`,
        name: attributes.Description ? attributes.Description[index] : `Rotator ${index + 1}`,
        buttplugType: 'rotate',
        buttplugIndex: index
      })
    }
  }

  private addSensors() {
    const attributes = this.device.DeviceMessages.SensorReadCmd;
    if (!attributes) {
      return;
    }

    for (let index=0; index<(attributes.FeatureCount || 1); index++) {
      this._outputPorts.push({
        type: 'number',
        tags: ['sensor'],
        id: attributes.Identifier ? attributes.Identifier[index] : `sensor${index}`,
        name: attributes.Description ? attributes.Description[index] : `Sensor ${index + 1}`,
        buttplugType: 'sensor',
        buttplugIndex: index
      })

      this.socket.send({SensorSubscribeCmd: {Id: this.socket.nextId++, DeviceIndex: this.device.DeviceIndex, Sensor: index}});
      this.sensors.push(0);
    }
  }

  getSensorValues() {
    return Object.keys(this.sensors).map(index => ({
      name: this._outputPorts[parseInt(index)].name,
      value: this.sensors[parseInt(index)]
    }))
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  setSensorValue(sensor: number, value: number) {
    this.sensors[sensor] = value;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  setInputValue(port: DevIoPort, value: number) {
    this.valueChanged = false;

    if (port.tags.includes('vibrate')) {
      if (this.vibrators[port.buttplugIndex] !== value) {
        this.valueChanged = true;
        this.vibrators[port.buttplugIndex] = value;
      }
    }

    if (port.tags.includes('rotate')) {
      if (this.rotators[port.buttplugIndex] !== value) {
        this.valueChanged = true;
        this.rotators[port.buttplugIndex] = value;
      }
    }

    if (!this.valueChanged) {
      return;
    }

    this._updatedPorts.push(port);
    this.triggerUpdate();
  }

  sendUpdates() {
    const ports = this._updatedPorts;
    this._updatedPorts = [];

    const vibrates = ports.filter(port => port.buttplugType === 'vibrate').map(port => ({Index: port.buttplugIndex, Speed: this.vibrators[port.buttplugIndex]}));
    if (vibrates.length) {
      this.socket.send({VibrateCmd: {Id: this.socket.nextId++, DeviceIndex: this.device.DeviceIndex, Speeds: vibrates}});
    }

    const rotates = ports.filter(port => port.buttplugType === 'rotate').map(port => ({Index: port.buttplugIndex, Speed: Math.abs(this.rotators[port.buttplugIndex]), Clockwise: this.rotators[port.buttplugIndex]>0}));
    if (rotates.length) {
      this.socket.send({RotateCmd: {Id: this.socket.nextId++, DeviceIndex: this.device.DeviceIndex, Speeds: rotates}});
    }
  }

  sendVibrates(devices: DevIoPort[]) {
    //this.socket.send()
    console.log('SEND VIBRATE', devices);
  }

  sendRotates(devices: DevIoPort[]) {
    //this.socket.send()
    console.log('SEND ROTATE', devices);
  }

  inputPorts() {
    return this._inputPorts;
  }

  outputPorts() {
    return this._outputPorts;
  }
}
