import { Injectable } from '@angular/core';
import { ISceneObject } from '../../interfaces/scene-object';

@Injectable({
  providedIn: 'root',
})
export class ObjectTrackerService {
  private readonly sceneObjects: Array<ISceneObject> = [];

  public addObject(sceneObject: ISceneObject): void {
    this.sceneObjects.push(sceneObject);
  }

  public deleteObject(sceneObject: ISceneObject): void {
    for (let i = this.sceneObjects.length - 1; i >= 0; i--) {
      if (this.sceneObjects[i].id.equals(sceneObject.id)) {
        this.sceneObjects[i].group.remove();
        this.sceneObjects.splice(i, 1);
      }
    }
  }

  public getObjects(): ISceneObject[] {
    return this.sceneObjects;
  }
}
