import { Guid } from 'guid-typescript';
import * as THREE from 'three';
import { DEFAULTWORLDSIZE } from '../constants';
import { ISceneObject } from '../interfaces/scene-object';

export class Grid implements ISceneObject {
  id: Guid = Guid.create();
  group: THREE.Group;
  existsInScene: boolean = false;

  constructor() {
    this.group = new THREE.Group();
    const grid = new THREE.GridHelper(DEFAULTWORLDSIZE, DEFAULTWORLDSIZE * 2);
    this.group.add(grid);
  }

  update() {}
}
