<template>
  <div class="visualize-wave" ref="container">
    <canvas ref="canvas" />
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';

export interface VisualizeOptionValue {
  value: number;
  time: number;
}

@Component
export default class VisualizeOption extends Vue {
  @Prop()
  value!: VisualizeOptionValue;

  @Prop({default: 10})
  pixelPerSecond!: number;

  private pixelPerY = 30;
  private lastTime = 0;
  private lastValue = 0;
  private canvas?: HTMLCanvasElement;
  private context: CanvasRenderingContext2D | null = null;

  @Watch('value')
  valueChanged(newValue: VisualizeOptionValue) {
    if (!this.context || !this.canvas) {
      return;
    }

    const width = this.canvas.width;
    const height = this.canvas.height;
    const mid = height / 2;

    const duration = newValue.time - this.lastTime;
    const c = this.context;
    const shift = Math.floor(duration * this.pixelPerSecond)

    if (shift) {
      c.drawImage(c.canvas, -shift, 0);
      c.fillRect(width - shift, 0, shift, height);
    }

    c.beginPath();
    c.moveTo(width - duration * this.pixelPerSecond, this.lastValue * -this.pixelPerY + mid);
    c.lineTo(width, newValue.value * -this.pixelPerY + mid);
    c.stroke();

    this.lastTime = newValue.time;
    this.lastValue = newValue.value;
  }

  mounted() {
    const container: HTMLDivElement = this.$refs.container as unknown as HTMLDivElement;
    this.canvas = this.$refs.canvas as unknown as HTMLCanvasElement;
    const width = container.clientWidth;
    const height = container.clientHeight;
    this.canvas.width = width;
    this.canvas.height = height;

    this.context = this.canvas.getContext('2d');
    if (this.context) {
      this.context.strokeStyle = '#0f0';
      this.context.lineWidth = 1;

      this.context.fillStyle = '#222';
      this.context.fillRect(0, 0, width, height);
    }
  }
}
</script>

<style lang="scss">
.visualize-wave {
  width: 100%;
  background-color: #222;
  height: 64px;

  canvas {
    width: 100%;
    height: 100%;
  }
}
</style>
