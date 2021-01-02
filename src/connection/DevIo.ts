export interface DevIoDeviceMessage {
  FeatureCount?: number;
  Description?: string[];
  Identifier?: string[];
}

export type DevIoVibrateDeviceMessage = DevIoDeviceMessage;

export type DevIoSensorReadMessage = DevIoDeviceMessage;

export interface DevIoDeviceInfo {
  DeviceName: string;
  DeviceIndex: number;
  DeviceMessages: {
    StopDeviceCmd?: DevIoDeviceMessage;
    SensorReadCmd?: DevIoSensorReadMessage;
    VibrateCmd?: DevIoVibrateDeviceMessage;
  };
}


export interface DevIoMessage {
  Id: number;
}

export interface DevIoRequestServerInfoMessage extends DevIoMessage {
  ClientName: string;
}

export type DevIoRequestDeviceList = DevIoMessage;

export interface DevIoServerInfoMessage extends DevIoMessage {
  ServerName: string;
  MessageVersion: number;
  MajorVersion: number;
  BuildVersion: number;
  MinorVersion: number;
  MaxPingTime: number;
}

export interface DevIoDeviceListMessage extends DevIoMessage {
  Devices: DevIoDeviceInfo[];
}

export interface DevIoVibrateCmdMsg extends DevIoMessage {
  DeviceIndex: number;
  Speeds: Array<{Index: number, Speed: number}>;
}

export interface DevIoSensorSubscribeCmdMsg extends DevIoMessage {
  DeviceIndex: number;
  Sensor: number;
}

export interface DevIoSensorUpdateMessage extends DevIoMessage {
  DeviceIndex: number;
  Sensor: number;
  Value: number;
}

export interface DevIoClientMessage {
  RequestServerInfo?: DevIoRequestServerInfoMessage;
  RequestDeviceList?: DevIoRequestDeviceList;
  VibrateCmd?: DevIoVibrateCmdMsg;
  SensorSubscribeCmd?: DevIoSensorSubscribeCmdMsg;
}

export interface DevIoServerMessage {
  ServerInfo?: DevIoServerInfoMessage;
  DeviceList?: DevIoDeviceListMessage;
  Ok?: DevIoMessage;
  SensorUpdate?: DevIoSensorUpdateMessage;
}

export interface DevIoMessageWaitItem {
  resolve: (item: DevIoMessage) => unknown;
  reject: (error: Error) => unknown;
}