import RuntimeData from '@/runtime/RuntimeData';
import Node from '../Node';

export default class VisualizeWave extends Node {
  static componentId = "VisualizeWave";
  static componentName = "Wave Visualizer";
  static category = "signal";
  static description = "Visualizes the input wave";

  constructor() {
    super();

    this.addInputInterface("Value", "NumberOption", 0, {type: "number"});
    this.addOption('Result', 'VisualizeOption', {value: 0, time: 0})
  }

  send(data: RuntimeData) {
    this.setOptionValue('Result', {value: this.getInterface('Value').value, time: data.time});
  }
}