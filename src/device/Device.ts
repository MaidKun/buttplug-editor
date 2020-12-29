export interface DevicePort {
  type: 'number';
  id: string;
  name: string;
}

export default abstract class Device<Port extends DevicePort=DevicePort> {
  public readonly id: string;
  public readonly name: string;
  public description = '';

  constructor(id: string, name: string) {
    this.id = id;
    this.name = name;
  } 

  abstract inputPorts(): Port[];
  abstract outputPorts(): Port[];

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  setInputValue(port: Port, value: number) {
    // empty default call
  }
}