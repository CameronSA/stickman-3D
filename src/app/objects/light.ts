import { Guid } from 'guid-typescript';
import * as THREE from 'three';
import { DEFAULTLIGHTCOLOR } from '../constants';
import { ISceneObject } from '../interfaces/scene-object';

export class Light implements ISceneObject {
  id: Guid;
  group: THREE.Group;
  existsInScene: boolean = false;

  constructor() {
    this.id = Guid.create();
    this.group = new THREE.Group();
    this.group.add(new THREE.DirectionalLight(DEFAULTLIGHTCOLOR, Math.PI));
    this.group.add(new THREE.AmbientLight(DEFAULTLIGHTCOLOR, 0.5));
  }

  update() {}
}
