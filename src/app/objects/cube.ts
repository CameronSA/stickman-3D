import * as THREE from 'three';
import { ISceneObject } from '../interfaces/scene-object';

export class Cube implements ISceneObject {
  id: string;
  meshIds: string[] = [];
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

    var wireGeometry = new THREE.EdgesGeometry(cube.geometry);
    var wireMaterial = new THREE.LineBasicMaterial({ color: 0x000000 });
    var wireframe = new THREE.LineSegments(wireGeometry, wireMaterial);
    cube.add(wireframe);

    cube.position.x = positionX;
    cube.position.y = positionY;
    cube.position.z = positionZ;
    this.group = new THREE.Group();
    this.id = this.group.uuid;
    this.group.add(cube);
  }

  update() {
    for (let child of this.group.children) {
      if (child instanceof THREE.Mesh) {
        let random = Math.random() / 10;
        child.rotation.x += random;
        child.rotation.y += random;
      }
    }
  }
}
