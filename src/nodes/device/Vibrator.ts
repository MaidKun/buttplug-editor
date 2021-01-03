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

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  load(state: any) {
    // TODO: Support loading selected device
    state.options = []
    super.load(state);
  }

  save() {
    const state = super.save();

    const signal = this.getOptionValue('Vibrator') as DeviceFeatureOptionValue | undefined;
    state.options = [['Vibrator', signal ? signal.getHash() : null]];

    return state;
  }

  send() {
    const signal = this.getOptionValue('Vibrator') as DeviceFeatureOptionValue | undefined;
    if (!signal) {
      return;
    }

    signal.setInputValue(this.getInterface('Value').value);
  }
}