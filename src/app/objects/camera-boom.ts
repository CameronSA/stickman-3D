import { Guid } from 'guid-typescript';
import * as THREE from 'three';
import { ISceneObject } from '../interfaces/scene-object';

export class CameraBoom implements ISceneObject {
  id: Guid;
  group: THREE.Group;
  existsInScene: boolean = false;

  constructor(centreX: number, centreY: number, centreZ: number) {
    this.id = Guid.create();
    this.group = new THREE.Group();
    this.group.position.x = centreX;
    this.group.position.y = centreY;
    this.group.position.z = centreZ;
  }

  update() {}
}
