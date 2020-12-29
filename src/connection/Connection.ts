export default abstract class Connection extends EventTarget {
  abstract connect(): Promise<void>;
}