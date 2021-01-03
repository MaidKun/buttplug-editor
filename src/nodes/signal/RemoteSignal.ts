import DeviceFeatureOptionValue from '@/components/option/DeviceFeatureOptionValue';
import Node from '../Node';

export default class RemoteSignal extends Node {
  static componentId = "RemoteSignal";
  static componentName = "Remote Signal";
  static category = "signal";
  static description = "Provides a signal from an external device"

  constructor() {
    super();

    this.addOption("Signal", "DeviceFeatureOption", undefined, undefined, {allowedTags: ['sensor']});
    this.addOutputInterface("Value", {type: "number"});
  }

  calculate() {
    const signal = this.getOptionValue('Signal') as DeviceFeatureOptionValue | undefined;
    if (!signal) {
      this.getInterface("Value").value = 0;
      return;
    }

    this.getInterface('Value').value = signal.getSensorValue();
  }
}