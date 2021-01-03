import Device from '@/device/Device';

export default abstract class Connection extends EventTarget {
  abstract connect(): Promise<void>;
  abstract disconnect(): Promise<void>;
  abstract triggerDeviceEventsAgain(): void;
  abstract getDevices(): Device[];
}