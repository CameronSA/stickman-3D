import { Guid } from 'guid-typescript';
import * as THREE from 'three';
import { addWireframe, generateSphere } from '../helpers/object-helpers';
import { ISceneObject } from '../interfaces/scene-object';

interface SegmentLink {
  mesh: THREE.Mesh;
  nextSegment: SegmentLink | undefined;
  startPosition: THREE.Vector3;
  endPosition: THREE.Vector3;
}

export class Stick implements ISceneObject {
  id: Guid = Guid.create();
  group: THREE.Group;
  existsInScene: boolean = false;

  constructor(
    private readonly stickRadius: number,
    private readonly stickLength: number,
    private readonly material: THREE.Material
  ) {
    this.group = new THREE.Group();

    const startPosition = new THREE.Vector3();
    const endPosition = new THREE.Vector3(0, this.stickLength, 0);

    const body = this.generateCyclinder();
    const topCap = generateSphere(this.stickRadius, endPosition, this.material);
    const bottomCap = generateSphere(
      this.stickRadius,
      startPosition,
      this.material
    );

    addWireframe(body);
    addWireframe(topCap);
    addWireframe(bottomCap);

    this.group.add(body);
    this.group.add(topCap);
    this.group.add(bottomCap);
  }

  update() {}

  private generateCyclinder(): THREE.Mesh {
    const bodyGeometry = new THREE.CylinderGeometry(
      this.stickRadius,
      this.stickRadius,
      this.stickLength
    );
    const body = new THREE.Mesh(bodyGeometry, this.material);
    body.position.y += this.stickLength / 2;
    return body;
  }
}
