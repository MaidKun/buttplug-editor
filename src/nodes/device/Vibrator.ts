import DeviceFeatureOptionValue from '@/components/option/DeviceFeatureOptionValue';
import Node from '../Node';

export default class Vibrator extends Node {
  static componentId = "Vibrator";
  static componentName = "Vibrator";
  static category = "device";
  static description = "Connected to a remote vibrator"

  constructor() {
    super();

    this.addOption("Vibrator", "DeviceFeatureOption", undefined, undefined, {allowedTags: ['vibrate']});
    this.addInputInterface("Value", "NumberOption", 0, {type: "number"});
  }

  send() {
    const signal = this.getOptionValue('Vibrator') as DeviceFeatureOptionValue | undefined;
    if (!signal) {
      return;
    }

    signal.setInputValue(this.getInterface('Value').value);
  }
}