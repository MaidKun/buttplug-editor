import Device from '@/device/Device';
import { ProjectFileComponentInterface } from '@/project/ProjectFileInterface';
import Node from '../Node';

export default class CustomInputDeviceNode extends Node {
  static category = "device";
  public readonly device: Device;

  constructor(device: Device) {
    super();

    this.device = device;

    for (const output of this.device.outputPorts()) {
      switch (output.type) {
        case 'number':
          this.addOutputInterface(output.name, {type: 'number'});
          break;
      }
    }
  }

  calculate() {
    for (const {name, value} of this.device.getSensorValues()) {
      this.getInterface(name).value = value;
    }
  }

  serializeType(): ProjectFileComponentInterface {
    return {
      origin: 'device',
      name: this.type,
      outputPorts: this.device.outputPorts().map(port => ({
        id: port.id,
        name: port.name,
        type: port.type
      })),
      inputPorts: []
    }
  }
}