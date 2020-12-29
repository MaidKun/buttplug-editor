import Node from '../Node';

export default class Constant extends Node {
  static componentId = "Constant";
  static componentName = "Constant";
  static category = "signal";
  static description = "Provides a constant value"

  constructor() {
    super();

    this.addInputInterface("Number", "NumberOption", 0, {type: "number"});
    this.addOutputInterface("Value", {type: "number"});
  }

  calculate() {
    this.getInterface("Value").value = this.getInterface('Number').value;
  }
}