import RuntimeData from '@/runtime/RuntimeData';
import Node from '../Node';

enum WaveType {
  Sine = 1,
  Square = 2,
  Sawtooth = 3,
  Triangle = 4
}

export default class WaveGenerator extends Node {
  static componentId = "WaveGenerator";
  static componentName = "Wave Generator";
  static category = "signal";
  static description = "Generates a wave signal";

  constructor() {
    super();

    this.addOption("Wave Type", "SelectOption", WaveType.Sine, undefined, {items: [
      {value: WaveType.Sine, text: 'Sine'},
      {value: WaveType.Square, text: 'Square'},
      {value: WaveType.Sawtooth, text: 'Sawtooth'},
      {value: WaveType.Triangle, text: 'Triangle'},
    ]});
    this.addOption("Only Positive Wave", "CheckboxOption", false);
    this.addInputInterface("Time", "TimeOption", 0, {type: "time"});
    this.addInputInterface("Amplitude", "NumberOption", 1, {type: "number"});
    this.addInputInterface("Frequency", "NumberOption", 1, {type: "number"});
    this.addOutputInterface("Output", {type: "number"});
  }

  calculate(data: RuntimeData) {
    const timeInterface = this.getInterface("Time");
    const time = timeInterface.connectionCount > 0 ? timeInterface.value : data.time;

    const amplitude = this.getInterface("Amplitude").value;
    const frequency = this.getInterface("Frequency").value;
    const isPositive = this.getOptionValue('Only Positive Wave');
    const min = (isPositive ? amplitude : 0);

    const out = this.getInterface("Output");

    switch (this.getOptionValue('Wave Type')) {
      case WaveType.Sine: 
        out.value = Math.sin(time * 2 * Math.PI * frequency) * amplitude + min;
        break;

      case WaveType.Square: 
        out.value = (((time * frequency) % 1) >= 0.5 ? -amplitude : amplitude) + min;
      break;

      case WaveType.Sawtooth: 
        out.value = ((((time * frequency) + 0.75) % 1) * amplitude * 2) + min - amplitude;
        break;

      case WaveType.Triangle: {
        const value = ((((time * frequency * 2) + 0.75) % 2) * amplitude * 2) - amplitude;
        if (value > amplitude) {
          out.value = amplitude * 2 - value + min;
        } else {
          out.value = value + min;
        }
        break;
      }
    }
    
  }
}