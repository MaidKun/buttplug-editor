import ConnectionManager from '@/connection/ConnectionManager';
import Project from './Project';
import ProjectFileInterface, { ProjectFileBoardInterface } from './ProjectFileInterface';

export default class ProjectLoaderV1 {
  public readonly project: Project;

  constructor(manager: ConnectionManager) {
    this.project = new Project(manager);
  }

  async load(json: ProjectFileInterface) {
    await this.project.initialize();
    await Promise.all(json.workspace.boards.map(board => this.restoreBoard(board)));

    return this.project;
  }

  protected async restoreBoard(board: ProjectFileBoardInterface) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    this.project.currentWorkspace.currentBoard.editor.load(board.state as any);
  }
}