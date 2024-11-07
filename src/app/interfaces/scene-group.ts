import { ISceneObject } from './scene-object';

export interface ISceneGroup {
  addSceneObject(sceneObject: ISceneObject): void;
}
