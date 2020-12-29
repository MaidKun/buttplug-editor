import Node from '../Node';

enum CalculationType {
  Add = 1,
  Sub = 2,
  Mul = 3,
  Div = 4,
  Mod = 5
}

export default class Calculation extends Node {
  static componentId = "Calculation";
  static componentName = "Calculation";
  static category = "math";
  static description = "Performs simple calculation"

  constructor() {
    super();

    this.addOption('Operator', 'SelectOption', CalculationType.Add, undefined, {items: [
      {value: CalculationType.Add, text: 'Add'},
      {value: CalculationType.Sub, text: 'Subtract'},
      {value: CalculationType.Mul, text: 'Multiply'},
      {value: CalculationType.Div, text: 'Divide'},
      {value: CalculationType.Mod, text: 'Modulo'}
    ]})
    this.addInputInterface("Operand A", "NumberOption", 0, {type: "number"});
    this.addInputInterface("Operand B", "NumberOption", 0, {type: "number"});
    this.addOutputInterface("Result", {type: "number"});
  }

  calculate() {
    const a = this.getInterface('Operand A').value;
    const b = this.getInterface('Operand B').value;
    const out = this.getInterface('Result');

    switch (this.getOptionValue('Operator') as CalculationType) {
      case CalculationType.Add: out.value = a + b; break;
      case CalculationType.Sub: out.value = a - b; break;
      case CalculationType.Mul: out.value = a * b; break;
      
      case CalculationType.Div:
        if (b === 0) {
          out.value = Infinity;
        } else {
          out.value = a / b;
        }
        break;
      
      case CalculationType.Mod:
        if (b === 0) {
          out.value = Infinity;
        } else {
          out.value = a % b;
        }
        break;
    }
  }
}