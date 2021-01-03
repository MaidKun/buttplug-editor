import Device from '@/device/Device';
import Calculation from '@/nodes/math/Calculation';
import Clamp from '@/nodes/math/Clamp';
import CustomDeviceNode from '@/nodes/device/CustomDeviceNode';
import { NodeConstructor } from '@/nodes/Node';
import Time from '@/nodes/signal/Time';
import VisualizeWave from '@/nodes/signal/VisualizeWave';
import WaveGenerator from '@/nodes/signal/WaveGenerator';
import Constant from '@/nodes/signal/Constant';
import RemoteSignal from '@/nodes/signal/RemoteSignal';
import Average from '@/nodes/math/Average';
import Memory from '@/nodes/math/Memory';
import Random from '@/nodes/signal/Random';
import CustomInputDeviceNode from '@/nodes/device/CustomInputDeviceNode';

export interface NodeRegistryCategory{
  id: string;
  name: string;
  icon: string;
}

export default class NodeRegistry extends EventTarget {
  protected nodes: NodeConstructor[] = [];
  public readonly categories: NodeRegistryCategory[] = [];

  get all() {
    return this.nodes;
  }

  filtered(category: string) {
    if (category === 'all') {
      return this.nodes;
    }

    return this.nodes.filter(node => node.category === category);
  }

  addCategory(id: string, name: string, icon: string) {
    this.categories.push({id, name, icon});
  }
  
  add(node: NodeConstructor) {
    const oldItem = this.nodes.findIndex(item => item.componentId === node.componentId);
    if (oldItem >= 0) {
      this.nodes.splice(oldItem, 1);
    }

    this.dispatchEvent(new CustomEvent('nodetypeadded', {detail: node}));

    this.nodes.push(node);
    this.nodes.sort((a, b) => (a.componentName < b.componentName) ? -1 : 1);
  }

  addCustomDevice(device: Device) {
    class CustomDevice extends CustomDeviceNode {
      static componentId = device.id;
      static componentName = device.name;
      static description = device.description;

      constructor() {
        super(device);
      }
    }    

    this.add(CustomDevice);

    if (device.outputPorts().length) {
      this.addCustomDeviceInput(device);
    }
  }

  addCustomDeviceInput(device: Device) {
    class CustomInputDevice extends CustomInputDeviceNode {
      static componentId = device.id + 'Input';
      static componentName = device.name + ' (Signals)';
      static description = device.description + ' (Signals)';

      constructor() {
        super(device);
      }
    }    

    this.add(CustomInputDevice);
  }

  removeCustomDevice(device: Device) {
    console.error('TODO REMOVE DEVICE', device.name);
  }

  create(id: string) {
    const node = this.nodes.find(node => node.componentId === id);
    if (!node) {
      return null;
    }

    return new node();
  }

  registerDefaultNodes() {
    this.addCategory('all', 'All', 'fas fa-folder');
    this.addCategory('device', 'Devices', 'fas fa-charging-station');
    this.addCategory('signal', 'Signals', 'fas fa-wave-square');
    this.addCategory('math', 'Math', 'fas fa-square-root-alt');

    this.add(Time);
    this.add(WaveGenerator);
    this.add(VisualizeWave);
    this.add(Calculation);
    this.add(Clamp);
    this.add(RemoteSignal);
    this.add(Constant);
    this.add(Average);
    this.add(Memory);
    this.add(Random);
  }
}
