export default abstract class Connection extends EventTarget {
  abstract connect(): Promise<void>;
  abstract triggerDeviceEventsAgain(): void;
}