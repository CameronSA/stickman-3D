import { Guid } from 'guid-typescript';
import * as THREE from 'three';
import { computeMidpoint } from '../helpers/geometry-helpers';
import { addWireframe, generateSphere } from '../helpers/object-helpers';
import { IMouseInteractable } from '../interfaces/mouse-interactable';
import { ISceneObject } from '../interfaces/scene-object';
import { IStickObject } from '../interfaces/stick-object';

export class Stick implements ISceneObject, IStickObject, IMouseInteractable {
  id: Guid = Guid.create();
  group: THREE.Group;
  existsInScene: boolean = false;
  private readonly stickLength: number = 0;

  constructor(
    private readonly stickRadius: number,
    private readonly material: THREE.Material,
    readonly startPosition: THREE.Vector3,
    readonly endPosition: THREE.Vector3
  ) {
    this.group = new THREE.Group();

    this.stickLength = this.startPosition.distanceTo(this.endPosition);

    const localStartPosition = new THREE.Vector3(0, -this.stickLength / 2, 0);
    const localEndPosition = new THREE.Vector3(0, this.stickLength / 2, 0);

    const body = this.generateCyclinder();
    const topCap = generateSphere(
      this.stickRadius,
      localEndPosition,
      this.material
    );
    const bottomCap = generateSphere(
      this.stickRadius,
      localStartPosition,
      this.material
    );

    addWireframe(body);
    addWireframe(topCap);
    addWireframe(bottomCap);

    this.group.add(body);
    this.group.add(topCap);
    this.group.add(bottomCap);

    const centrePoint = computeMidpoint(this.startPosition, this.endPosition);
    this.group.position.set(centrePoint.x, centrePoint.y, centrePoint.z);

    const axisOfRotation = new THREE.Vector3(0, 1, 0);
    const axisOfAlignment = this.endPosition
      .sub(this.startPosition)
      .normalize();

    this.group.quaternion.setFromUnitVectors(axisOfRotation, axisOfAlignment);
  }

  onMouseDown(event: MouseEvent): void {
    throw new Error('Method not implemented.');
  }

  onMouseUp(event: MouseEvent): void {
    throw new Error('Method not implemented.');
  }

  onMouseMove(event: MouseEvent): void {
    throw new Error('Method not implemented.');
  }

  onWheel(event: WheelEvent): void {
    throw new Error('Method not implemented.');
  }

  update() {}

  private generateCyclinder(): THREE.Mesh {
    const bodyGeometry = new THREE.CylinderGeometry(
      this.stickRadius,
      this.stickRadius,
      this.stickLength
    );
    const body = new THREE.Mesh(bodyGeometry, this.material);
    return body;
  }
}
