import * as Buttplug from 'buttplug';
import { ButtplugDeviceMessageType } from 'buttplug';
import Device, { DevicePort } from './Device';

export interface ButtplugIoPort extends DevicePort {
  buttplugType: 'vibrate' | 'rotate';
  buttplugIndex: number;
}

export default class ButtplugIoDevice extends Device<ButtplugIoPort> {
  public readonly device: Buttplug.ButtplugClientDevice;

  protected _inputPorts: ButtplugIoPort[];
  protected vibrators: number[] = [];
  protected rotators: number[] = [];
  protected _updatedPorts: ButtplugIoPort[] = []

  private valueChanged = false;

  constructor(id: string, device: Buttplug.ButtplugClientDevice) {
    super(id, device.Name);

    this.device = device;
    this.description = `Buttplug device ${device.Index}`;

    this._inputPorts = [];

    this.addVibrate();
    this.addRotate();
  }

  private addVibrate() {
    const attributes = this.device.messageAttributes(ButtplugDeviceMessageType.VibrateCmd);
    if (!attributes) {
      return;
    }
    for (let index=0; index<(attributes.featureCount || 1); index++) {
      this._inputPorts.push({
        type: 'number',
        tags: ['vibrate'],
        id: `vibrate${index}`,
        name: `Motor ${index + 1}`,
        buttplugType: 'vibrate',
        buttplugIndex: index
      })
    }
  }

  private addRotate() {
    const attributes = this.device.messageAttributes(ButtplugDeviceMessageType.RotateCmd);
    if (!attributes) {
      return;
    }
    for (let index=0; index<(attributes.featureCount || 1); index++) {
      this._inputPorts.push({
        type: 'number',
        tags: ['rotate'],
        id: `rotate${index}`,
        name: `Rotator ${index + 1}`,
        buttplugType: 'rotate',
        buttplugIndex: index
      })
    }
  }

  inputPorts() {
    return this._inputPorts;
  }

  outputPorts() {
    return [];
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  setInputValue(port: ButtplugIoPort, value: number) {
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

    const vibrates = ports.filter(port => port.buttplugType === 'vibrate').map(port => new Buttplug.VibrationCmd(port.buttplugIndex, Math.min(1, Math.max(0, this.vibrators[port.buttplugIndex]))));
    if (vibrates.length) {
      this.device.vibrate(vibrates);
    }

    const rotates = ports.filter(port => port.buttplugType === 'rotate').map(port => new Buttplug.RotationCmd(port.buttplugIndex, Math.min(1, Math.max(0, Math.abs(this.rotators[port.buttplugIndex]))), this.rotators[port.buttplugIndex]>0));
    if (rotates.length) {
      this.device.rotate(rotates, undefined);
    }
  }
}
