import { Guid } from 'guid-typescript';
import * as THREE from 'three';
import { DEFAULTFLOOR, DEFAULTWORLDSIZE } from '../constants';
import { ISceneObject } from '../interfaces/scene-object';

export class Floor implements ISceneObject {
  id: Guid = Guid.create();
  group: THREE.Group;
  existsInScene: boolean = false;

  constructor() {
    this.group = new THREE.Group();
    const geometry = new THREE.PlaneGeometry(
      DEFAULTWORLDSIZE,
      DEFAULTWORLDSIZE
    );
    const material = new THREE.MeshBasicMaterial({
      color: DEFAULTFLOOR,
      side: THREE.DoubleSide,
      polygonOffset: true,
      polygonOffsetFactor: 1,
      polygonOffsetUnits: 1,
    });

    const plane = new THREE.Mesh(geometry, material);
    plane.rotateX(-Math.PI / 2);
    this.group.add(plane);
  }

  update() {}
}
