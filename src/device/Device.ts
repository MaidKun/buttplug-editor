export interface DevicePort {
  type: 'number';
  id: string;
  name: string;
}

export interface DeviceSignalData {
  name: string;
  value: number;
}

export default abstract class Device<Port extends DevicePort=DevicePort> {
  public readonly id: string;
  public readonly name: string;
  protected _immediate?: NodeJS.Immediate;
  public description = '';

  constructor(id: string, name: string) {
    this.id = id;
    this.name = name;
  } 

  protected triggerUpdate() {
    if (this._immediate) {
      return;
    }

    this._immediate = setImmediate(() => {
      this._immediate = undefined;

      this.sendUpdates();
    });
  }

  abstract inputPorts(): Port[];
  abstract outputPorts(): Port[];

  sendUpdates() {
    // empty default call
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  setInputValue(port: Port, value: number) {
    // empty default call
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getSensorValues(): DeviceSignalData[] {
    return [];
  }
}