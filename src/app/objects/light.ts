import * as THREE from 'three';
import { DEFAULTLIGHTCOLOR } from '../constants';
import { ISceneObject } from '../interfaces/scene-object';

export class Light implements ISceneObject {
  id: string;
  meshIds: string[] = [];
  group: THREE.Group;
  existsInScene: boolean = false;

  constructor() {
    this.group = new THREE.Group();
    this.id = this.group.uuid;

    this.group.add(new THREE.DirectionalLight(DEFAULTLIGHTCOLOR, Math.PI));
    this.group.add(new THREE.AmbientLight(DEFAULTLIGHTCOLOR, 0.5));
  }

  update() {}
}
