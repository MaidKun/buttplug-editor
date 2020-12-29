import Node from '../Node';

export default class RemoteSignal extends Node {
  static componentId = "RemoteSignal";
  static componentName = "Remote Signal";
  static category = "signal";
  static description = "Provides a signal from an external device"

  constructor() {
    super();

    this.addOption("_", "TextOption", "Buttplug.IO does not support remote signals, yet");
    this.addOutputInterface("Value", {type: "number"});
  }

  calculate() {
    this.getInterface("Value").value = 0;
  }
}