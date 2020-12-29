import Node from '../Node';

export default class Clamp extends Node {
  static componentId = "Clamp";
  static componentName = "Clamp";
  static category = "math";
  static description = "Ensures that a value is in a range"

  constructor() {
    super();

    this.addInputInterface("Value", "NumberOption", 0, {type: "number"});
    this.addInputInterface("Minimum", "NumberOption", 0, {type: "number"});
    this.addInputInterface("Maximum", "NumberOption", 1, {type: "number"});
    this.addOutputInterface("Result", {type: "number"});
  }

  calculate() {
    const value = this.getInterface('Value').value;
    const min = this.getInterface('Minimum').value;
    const max = this.getInterface('Maximum').value;
    
    this.getInterface('Result').value = Math.min(max, Math.max(min, value));
  }
}