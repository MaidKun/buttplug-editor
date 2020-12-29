import RuntimeData from '@/runtime/RuntimeData';
import Node from '../Node';

export default class Time extends Node {
  static componentId = "Time";
  static componentName = "Time";
  static category = "signal";
  static description = "Session duration starting at zero"

  constructor() {
    super();

    this.addOutputInterface("Time", {type: "time"});
  }

  calculate(data: RuntimeData) {
    this.getInterface("Time").value = data.time;
  }
}