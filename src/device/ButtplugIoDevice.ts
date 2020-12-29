import * as Buttplug from 'buttplug';
import { ButtplugDeviceMessageType } from 'buttplug';
import Device, { DevicePort } from './Device';

export interface ButtplugIoPort extends DevicePort {
  buttplugType: 'vibrate';
  buttplugIndex: number;
}

export default class ButtplugIoDevice extends Device<ButtplugIoPort> {
  public readonly device: Buttplug.ButtplugClientDevice;

  protected _inputPorts: ButtplugIoPort[];
  protected vibrators: number[] = [];
  protected _updatedPorts: ButtplugIoPort[] = []
  protected _immediate?: NodeJS.Immediate;

  constructor(id: string, device: Buttplug.ButtplugClientDevice) {
    super(id, device.Name);

    this.device = device;
    this.description = `Buttplug device ${device.Index}`;

    this._inputPorts = [];
    
    this.addVibrate();
  }

  private addVibrate() {
    const attributes = this.device.messageAttributes(ButtplugDeviceMessageType.VibrateCmd);
    if (!attributes) {
      return;
    }
    for (let index=0; index<(attributes.featureCount || 1); index++) {
      this._inputPorts.push({
        type: 'number',
        id: `vibrate${index}`,
        name: `Motor ${index + 1}`,
        buttplugType: 'vibrate',
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
    if (this.vibrators[port.buttplugIndex] === value) {
      return;
    }

    this.vibrators[port.buttplugIndex] = value;
    this._updatedPorts.push(port);
    this.triggerUpdate();
  }

  private triggerUpdate() {
    if (this._immediate) {
      return;
    }

    this._immediate = setImmediate(() => {
      this._immediate = undefined;

      this.sendUpdates();
    });
  }

  private sendUpdates() {
    const ports = this._updatedPorts;
    this._updatedPorts = [];

    const vibrates = ports.filter(port => port.buttplugType === 'vibrate').map(port => new Buttplug.VibrationCmd(port.buttplugIndex, Math.min(1, Math.max(0, this.vibrators[port.buttplugIndex]))));
    if (vibrates.length) {
      this.device.vibrate(vibrates);
    }
  }
}