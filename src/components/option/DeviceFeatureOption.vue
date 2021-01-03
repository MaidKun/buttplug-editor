<template>
  <div
      :class="['dark-select', { '--open': open }]"
      @click="open = !open"
      v-click-outside="() => { open = false; }"
  >
    <div class="__selected">
        <div class="__text">{{ value ? value.getText() : '' }}</div>
        <div class="__icon">
            
        </div>
    </div>
    <transition name="slide-fade">
        <div class="__dropdown" v-show="open">
            <div class="item --header">{{ name }}</div>
            <div
                v-for="(item, i) in ports"
                :key="i"
                :class="['item', { '--active': isSelected(item) }]"
                @click="setSelected(item)"
            >{{item.getText()}}</div>
        </div>
    </transition>
    <span v-if="!hasAnyDevice">No device with vibrator-support has been connected</span>
  </div>
</template>

<script lang="ts">
import Device, { DevicePort } from '@/device/Device';
import Project from '@/project/Project';
import { Component, Inject, Prop, Vue } from 'vue-property-decorator';
import { SelectOption } from '@baklavajs/plugin-options-vue';
import DeviceFeatureOptionValue from './DeviceFeatureOptionValue';

// eslint-disable-next-line @typescript-eslint/ban-ts-ignore
// @ts-ignore
import ClickOutside from "v-click-outside";

interface ItemType {
  text: string;
  value: DeviceFeatureOptionValue;
}

@Component({
  components: {
    SelectOption
  },
  directives: {
    ClickOutside: ClickOutside.directive
  }
})
export default class DeviceFeatureOption extends Vue {
  @Prop({ type: String })
  name!: string;

  @Prop({ type: Object })
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  option!: any;
  
  @Prop()
  value!: DeviceFeatureOptionValue;

  @Inject()
  project!: Project;

  ports: DeviceFeatureOptionValue[] = [];

  hasAnyDevice = false;
  open = false;

  created() {
    this.onUpdate = this.onUpdate.bind(this);
  }

  mounted() {
    this.project.connections.addEventListener('deviceadded', this.onUpdate);
    this.project.connections.addEventListener('deviceremoved', this.onUpdate);
    this.onUpdate();
  }

  get allowedTags(): string[] {
    return this.option.allowedTags || [];
  }

  isSelected(item: DeviceFeatureOptionValue) {
    return this.value === item;
  }

  setSelected(item: DeviceFeatureOptionValue) {
    this.$emit('input', item);
  }

  async onUpdate() {
    const devices = this.project.connections.connections.map(connection => connection.getDevices()).reduce((a, b) => a.concat(b), [] as Device[])
    const ports = devices.map(device => this.filterDevicePorts(device)).reduce((a, b) => a.concat(b), [] as DeviceFeatureOptionValue[]);

    this.ports = ports;
    this.hasAnyDevice = Boolean(ports.length);
    await this.$nextTick();
  }

  beforeDestroy() {
    this.project.connections.removeEventListener('deviceadded', this.onUpdate);
    this.project.connections.removeEventListener('deviceremoved', this.onUpdate);
  }

  private filterDevicePorts(device: Device) {
    return this.filterPorts(device, device.inputPorts()).concat(this.filterPorts(device, device.outputPorts()))
  }

  private filterPorts(device: Device, ports: DevicePort[]) {
    return ports.filter(port => {
      if (this.allowedTags.length === 0) {
        return true;
      }
      
      return port.tags.some(tag => this.allowedTags.indexOf(tag) >= 0);
    }).map(port => new DeviceFeatureOptionValue(device, port))
  }
}
</script>

<style lang="scss">
</style>
