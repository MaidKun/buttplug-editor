type IState = unknown;

export const ProjectFileIdentifier = 'maidkun/buttplug-editor/project';
export const ProjectFileVersion = 1;

export interface ProjectFileComponentPortInterface {
  id: string;
  name: string;
  type: 'number';
}

export interface ProjectFileComponentInterface {
  origin: 'device' | 'core';
  name: string;
  inputPorts: ProjectFileComponentPortInterface[];
  outputPorts: ProjectFileComponentPortInterface[];
}

export interface ProjectFileBoardInterface {
  state: IState;
}

export interface ProjectFileWorkspaceInterface {
  boards: ProjectFileBoardInterface[];
}

export default interface ProjectFileInterface {
  identifier: typeof ProjectFileIdentifier;
  version: number;

  workspace: ProjectFileWorkspaceInterface;
  components: ProjectFileComponentInterface[];
}