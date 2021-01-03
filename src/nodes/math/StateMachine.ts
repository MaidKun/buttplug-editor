import Node from '../Node';

const NUM_STATES = 10;

export default class StateMachine extends Node {
  width = 200;
  twoColumn = true;

  static componentId = "StateMachine";
  static componentName = "State Machine";
  static category = "math";
  static description = "Allows to control several states"
  
  protected activeState = 1;
  protected lastInputValues = [false, false, false, false, false, false, false, false, false, false]

  constructor() {
    super();

    for (let i=1; i<=NUM_STATES; i++) {
      this.addInputInterface(`Trigger ${i}`, "CheckboxOption", false, {type: "boolean"});
      this.addOutputInterface(`State ${i}`, {type: 'boolean'});
    }

    this.getInterface(`State 1`).value = true;
  }

  calculate() {
    let newState = this.activeState;

    for (let i=1; i<=NUM_STATES; i++) {
      const value = this.getInterface(`Trigger ${i}`).value;
      if (value && !this.lastInputValues[i - 1]) {
        newState = i;
      }
      this.lastInputValues[i - 1] = value;
    }

    if (newState !== this.activeState) {
      this.getInterface(`State ${this.activeState}`).value = false;
      this.activeState = newState;
      this.getInterface(`State ${this.activeState}`).value = true;
    }
  }
}