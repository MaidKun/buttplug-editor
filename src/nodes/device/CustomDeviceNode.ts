import Device from '@/device/Device';
import { ProjectFileComponentInterface } from '@/project/ProjectFileInterface';
import Node from '../Node';

export default class CustomDeviceNode extends Node {
  static category = "device";
  public readonly device: Device;

  constructor(device: Device) {
    super();

    this.device = device;

    for (const input of this.device.inputPorts()) {
      switch (input.type) {
        case 'number':
          this.addInputInterface(input.name, 'NumberOption', 0, {type: 'number'})
      }
    }
  }

  send() {
    for (const input of this.device.inputPorts()) {
      this.device.setInputValue(input, this.getInterface(input.name).value);
    }
  }

  serializeType(): ProjectFileComponentInterface {
    return {
      origin: 'device',
      name: this.type,
      inputPorts: this.device.inputPorts().map(port => ({
        id: port.id,
        name: port.name,
        type: port.type
      })),
      outputPorts: []
    }
  }
}