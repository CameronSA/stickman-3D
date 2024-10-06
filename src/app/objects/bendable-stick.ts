import { Guid } from 'guid-typescript';
import * as THREE from 'three';
import {
  calculateArcAngle,
  calculateArcRadius,
} from '../helpers/geometry-helpers';
import { ISceneObject } from '../interfaces/scene-object';

export class BendableStick implements ISceneObject {
  id: Guid = Guid.create();
  group: THREE.Group;
  existsInScene: boolean = false;

  constructor(
    private readonly stickRadius: number,
    private readonly stickLength: number
  ) {
    this.group = new THREE.Group();

    const startPosition = new THREE.Vector3();
    const endPosition = new THREE.Vector3(0, this.stickLength, 0);

    const endOfArcPosition = new THREE.Vector3(
      endPosition.x,
      endPosition.y - 1,
      endPosition.z
    );

    endOfArcPosition.applyAxisAngle(new THREE.Vector3(0, 0, 1), Math.PI / 4);

    const torus = this.generateTorus(startPosition, endOfArcPosition);

    this.group.add(torus);
  }

  update() {}

  private generateTorus(
    startPosition: THREE.Vector3,
    endPosition: THREE.Vector3
  ): THREE.Mesh {
    const material = new THREE.MeshBasicMaterial({
      color: new THREE.Color(0xffffff).multiplyScalar(0.5),
      polygonOffset: true,
      polygonOffsetFactor: 1,
      polygonOffsetUnits: 1,
    });

    const arcAngle = calculateArcAngle(
      startPosition,
      endPosition,
      this.stickLength
    );

    const arcRadius = calculateArcRadius(this.stickLength, arcAngle);

    const geometry = new THREE.TorusGeometry(
      arcRadius,
      this.stickRadius,
      12,
      48,
      arcAngle
    );

    console.log(startPosition, endPosition, arcAngle, arcRadius);

    let startX = -arcRadius;
    if (endPosition.x > startPosition.x) {
      startX = arcRadius;
    }

    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(startX, 0, 0);

    return mesh;
  }
}
