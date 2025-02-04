import * as THREE from 'three';
import { DEFAULTWORLDSIZE } from '../constants';
import { ISceneObject } from '../interfaces/scene-object';

export class Grid implements ISceneObject {
  id: string;
  meshIds: string[] = [];
  group: THREE.Group;
  existsInScene: boolean = false;

  constructor() {
    this.group = new THREE.Group();
    this.id = this.group.uuid;

    const grid = new THREE.GridHelper(DEFAULTWORLDSIZE, DEFAULTWORLDSIZE * 2);
    this.group.add(grid);
  }

  update() {}
}
