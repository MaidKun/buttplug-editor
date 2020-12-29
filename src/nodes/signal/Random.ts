import Node from '../Node';

export default class Random extends Node {
  static componentId = "Random";
  static componentName = "Random Generator";
  static category = "signal";
  static description = "Generates a random signal";

  constructor() {
    super();

    this.addInputInterface("Minimum", "NumberOption", -1, {type: "number"});
    this.addInputInterface("Maximum", "NumberOption", 1, {type: "number"});
    this.addOutputInterface("Output", {type: "number"});
  }

  calculate() {
    const minimum = this.getInterface("Minimum").value;
    const maximum = this.getInterface("Maximum").value;

    this.getInterface("Output").value = (Math.random() * (maximum - minimum)) + minimum;
  }
}