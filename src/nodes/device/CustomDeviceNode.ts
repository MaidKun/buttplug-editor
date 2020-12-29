import Device from '@/device/Device';
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
}