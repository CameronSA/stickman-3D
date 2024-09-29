import * as THREE from 'three';
import { ISceneObject } from '../interfaces/scene-object';

export class Cube implements ISceneObject {
  group: THREE.Group;
  existsInScene: boolean = false;

  constructor(positionX: number, positionY: number, positionZ: number) {
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshLambertMaterial({
      color: new THREE.Color(0xaaffff).multiplyScalar(0.5),
      polygonOffset: true,
      polygonOffsetFactor: 1,
      polygonOffsetUnits: 1,
    });

    const cube = new THREE.Mesh(geometry, material);

    var geo = new THREE.EdgesGeometry(cube.geometry); // or
    var mat = new THREE.LineBasicMaterial({ color: 0x000000 });
    var wireframe = new THREE.LineSegments(geo, mat);
    cube.add(wireframe);

    cube.position.x = positionX;
    cube.position.y = positionY;
    cube.position.z = positionZ;
    this.group = new THREE.Group();
    this.group.add(cube);
  }

  update() {
    for (let child of this.group.children) {
      if (child instanceof THREE.Mesh) {
        child.rotation.x += 0.01;
        child.rotation.y += 0.01;
      }
    }
  }
}
