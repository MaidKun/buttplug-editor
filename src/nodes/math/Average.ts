import RuntimeData from '@/runtime/RuntimeData';
import Node from '../Node';

export default class Average extends Node {
  static componentId = "Average";
  static componentName = "Average";
  static category = "math";
  static description = "Provides the average of an input value"

  private lastTime = 0;
  private lastTick = 0;
  private duration = 0;
  private probesPerSecond = 10;
  private tickDuration = 1;

  private records: number[] = []
  private sum = 0;
  private maxSize = 0;
  private count = 0;
  private index = 0;

  constructor() {
    super();

    this.addOption("Duration", "NumberOption", 10);
    this.addInputInterface("Value", "NumberOption", 0, {type: "number"});
    this.addOutputInterface("Average", {type: "number"});
  }

  getDuration() {
    return Math.max(0.1, this.getOptionValue('Duration'))
  }

  reset() {
    const duration = this.getDuration();
    
    this.lastTime = 0;
    this.lastTick = 0;
    this.index = 0;
    this.count = 0;
    this.sum = 0;

    this.tickDuration = 1 / this.probesPerSecond;
    this.maxSize = duration * this.probesPerSecond;
  }

  calculate(data: RuntimeData) {
    const duration = this.getDuration();

    if (data.time < this.lastTime
      || duration !== this.duration
    ) {
      this.reset();
      this.duration = duration;
    }

    this.lastTick += data.time - this.lastTime;
    this.lastTime = data.time;

    const value = this.getInterface('Value').value;
    while (this.lastTick >= this.tickDuration) {
      this.addTick(value);
      this.lastTick -= this.tickDuration;
    }

    if (this.count === 0) {
      this.getInterface('Average').value = value;
    } else {
      this.getInterface('Average').value = this.sum / this.count;
    }
  }

  private addTick(value: number) {
    if (this.index < this.count) {
      this.sum -= this.records[this.index];
    }

    this.records[this.index++] = value;
    this.sum += value;
    this.count = Math.max(this.count, this.index);
    this.index = this.index % this.maxSize;
  }
}