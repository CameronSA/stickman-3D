import * as THREE from 'three';
import { ISceneObject } from '../interfaces/scene-object';

export class Grid implements ISceneObject {
  group: THREE.Group;
  existsInScene: boolean = false;

  constructor(size: number, divisions: number) {
    this.group = new THREE.Group();
    this.group.add(new THREE.GridHelper(size, divisions));
  }

  update() {}
}
