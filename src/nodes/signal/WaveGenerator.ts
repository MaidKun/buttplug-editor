import RuntimeData from '@/runtime/RuntimeData';
import Node from '../Node';

export default class WaveGenerator extends Node {
  static componentId = "WaveGenerator";
  static componentName = "Wave Generator";
  static category = "signal";
  static description = "Generates a wave signal";

  constructor() {
    super();

    this.addOption("Only Positive Wave", "CheckboxOption", false);
    this.addInputInterface("Time", "TimeOption", 0, {type: "time"});
    this.addInputInterface("Amplitude", "NumberOption", 1, {type: "number"});
    this.addInputInterface("Frequency", "NumberOption", 1, {type: "number"});
    this.addOutputInterface("Output", {type: "number"});
  }

  calculate(data: RuntimeData) {
    const timeInterface = this.getInterface("Time");
    const time = timeInterface.connectionCount > 0 ? timeInterface.value : data.time;

    const amplitude = this.getInterface("Amplitude").value;
    const frequency = this.getInterface("Frequency").value;
    const isPositive = this.getOptionValue('Only Positive Wave');

    this.getInterface("Output").value = Math.sin(time * 2 * Math.PI * frequency) * amplitude + (isPositive ? amplitude : 0);
  }
}