import Node from '../Node';

export default class Memory extends Node {
  static componentId = "Memory";
  static componentName = "Memory";
  static category = "math";
  static description = "Remembers the value of the last trigger"

  private lastValue = 0;
  private lastTrigger = false;

  constructor() {
    super();

    this.addOption("On positive Edge only", "CheckboxOption", false);
    this.addInputInterface("Input", "NumberOption", 0, {type: "number"});
    this.addInputInterface("Trigger", "CheckboxOption", false, {type: "boolean"});
    this.addOutputInterface("Output", {type: "number"});
  }

  calculate() {
    const triggerPositive = this.getOptionValue('On positive Edge only');
    const trigger = this.getInterface('Trigger').value;
    
    if (trigger !== this.lastTrigger) {
      if (!triggerPositive || trigger) {
        this.lastValue = this.getInterface('Input').value;
      }
      this.lastTrigger = trigger;
    }

    this.getInterface('Output').value = this.lastValue;
  }
}