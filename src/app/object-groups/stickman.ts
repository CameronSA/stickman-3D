import { ISceneGroup } from '../interfaces/scene-group';
import { ISceneObject } from '../interfaces/scene-object';

export class Stickman implements ISceneGroup {
  private readonly _sceneObjects: ISceneObject[] = [];

  addSceneObject(sceneObject: ISceneObject): void {
    this._sceneObjects.push(sceneObject);
  }
}
