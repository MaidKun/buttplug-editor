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

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  load(state: any) {
    // TODO: Support loading selected device
    state.options = []
    super.load(state);
  }

  save() {
    const state = super.save();

    const signal = this.getOptionValue('Signal') as DeviceFeatureOptionValue | undefined;
    state.options = [['Signal', signal ? signal.getHash() : null]];

    return state;
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