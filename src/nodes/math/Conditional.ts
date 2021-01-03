import Node from '../Node';

enum CalculationType {
  Equal = 1,
  NotEqual = 2,
  LessThan = 3,
  LessThanOrEqual = 4,
  GreaterThan = 5,
  GreaterThanOrEqual = 6
}

export default class Conditional extends Node {
  static componentId = "Conditional";
  static componentName = "Conditional";
  static category = "math";
  static description = "Performs condition tests"

  constructor() {
    super();

    this.addOption('Test', 'SelectOption', CalculationType.GreaterThan, undefined, {items: [
      {value: CalculationType.Equal, text: 'Equal (=)'},
      {value: CalculationType.NotEqual, text: 'Not equal (!=)'},
      {value: CalculationType.LessThan, text: 'Less than (<)'},
      {value: CalculationType.LessThanOrEqual, text: 'Less than or equal (<=)'},
      {value: CalculationType.GreaterThan, text: 'Greater than (>)'},
      {value: CalculationType.GreaterThanOrEqual, text: 'Greater than or equal (>=)'},
    ]})
    this.addInputInterface("Operand A", "NumberOption", 0, {type: "number"});
    this.addInputInterface("Operand B", "NumberOption", 0, {type: "number"});
    this.addOutputInterface("True", {type: "boolean"});
    this.addOutputInterface("False", {type: "boolean"});
  }

  calculate() {
    const a = this.getInterface('Operand A').value;
    const b = this.getInterface('Operand B').value;
    const out = this.getInterface('True');

    switch (this.getOptionValue('Test') as CalculationType) {
      case CalculationType.Equal: out.value = a == b; break;
      case CalculationType.NotEqual: out.value = a != b; break;
      case CalculationType.LessThan: out.value = a < b; break;
      case CalculationType.LessThanOrEqual: out.value = a <= b; break;
      case CalculationType.GreaterThan: out.value = a > b; break;
      case CalculationType.GreaterThanOrEqual: out.value = a >= b; break;
    }

    this.getInterface('False').value = !out.value;
  }
}