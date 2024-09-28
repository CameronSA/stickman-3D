import { Injectable } from '@angular/core';
import { ISceneObject } from '../objects/scene-object';

@Injectable({
  providedIn: 'root',
})
export class ObjectTrackerService {
  private readonly sceneObjects: Array<ISceneObject> = [];

  public addObject(sceneObject: ISceneObject): void {
    this.sceneObjects.push(sceneObject);
  }

  public getObjects(): ISceneObject[] {
    return this.sceneObjects;
  }
}
