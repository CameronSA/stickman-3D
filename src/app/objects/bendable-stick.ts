import * as THREE from 'three';
import {
  calculateArcAngle,
  calculateArcRadius,
} from '../helpers/geometry-helpers';
import { addWireframe, generateSphere } from '../helpers/object-helpers';
import { ISceneObject } from '../interfaces/scene-object';

export class BendableStick implements ISceneObject {
  id: string;
  meshIds: string[] = [];
  group: THREE.Group;
  existsInScene: boolean = false;

  private readonly tolerance: number = 1e-10;

  constructor(
    private readonly stickRadius: number,
    private readonly stickLength: number,
    private readonly material: THREE.Material
  ) {
    this.group = new THREE.Group();
    this.id = this.group.uuid;

    const startPosition = new THREE.Vector3();
    const endPosition = new THREE.Vector3(0, this.stickLength, 0);

    const topCap = generateSphere(this.stickRadius, endPosition, this.material);
    const bottomCap = generateSphere(
      this.stickRadius,
      startPosition,
      this.material
    );

    const endOfArcPosition = new THREE.Vector3(
      endPosition.x,
      endPosition.y - this.tolerance,
      endPosition.z
    );

    // endOfArcPosition.applyAxisAngle(new THREE.Vector3(0, 0, 1), Math.PI / 4);

    const torus = this.generateTorus(startPosition, endOfArcPosition);

    addWireframe(topCap);
    addWireframe(bottomCap);
    addWireframe(torus);

    this.group.add(torus);
    this.group.add(topCap);
    this.group.add(bottomCap);
  }

  update() {}

  private generateTorus(
    startPosition: THREE.Vector3,
    endPosition: THREE.Vector3
  ): THREE.Mesh {
    const arcAngle = calculateArcAngle(
      startPosition,
      endPosition,
      this.stickLength
    );

    const arcRadius = calculateArcRadius(this.stickLength, arcAngle);

    const geometry = new THREE.TorusGeometry(
      arcRadius,
      this.stickRadius,
      32,
      48,
      arcAngle
    );

    let startX = -arcRadius;
    if (endPosition.x > startPosition.x) {
      startX = arcRadius;
    }

    const mesh = new THREE.Mesh(geometry, this.material);
    mesh.position.set(startX, 0, 0);

    return mesh;
  }
}
