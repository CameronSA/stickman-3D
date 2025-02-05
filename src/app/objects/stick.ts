import * as THREE from 'three';
import { computeMidpoint } from '../helpers/geometry-helpers';
import { generateSphere } from '../helpers/object-helpers';
import { IMouseInteractable } from '../interfaces/mouse-interactable';
import { ISceneObject } from '../interfaces/scene-object';
import { IStickObject } from '../interfaces/stick-object';
import { InteractionService } from '../services/interaction/interaction.service';

export class Stick implements ISceneObject, IStickObject, IMouseInteractable {
  id: string;
  meshIds: string[] = [];
  group: THREE.Group;
  existsInScene: boolean = false;
  private readonly stickLength: number = 0;
  private mouseControlsShown = false;
  private moveButton: THREE.Mesh;
  private rotateButton: THREE.Mesh;
  private initialControlButtonScale: THREE.Vector3;
  private moveButtonSelected = false;
  private rotateButtonSelected = false;

  private plane = new THREE.Plane();
  private planeIntersect = new THREE.Vector3(); // point of intersection with the plane
  private pIntersect = new THREE.Vector3(); // point of intersection with an object (plane's point)
  private shift = new THREE.Vector3(); // distance between position of an object and points of intersection with the object
  private initialClickToCentre = new THREE.Vector3();

  constructor(
    private readonly interactionService: InteractionService,
    private readonly stickRadius: number,
    private readonly material: THREE.Material,
    readonly moveMaterial: THREE.Material,
    readonly rotateMaterial: THREE.Material,
    readonly startPosition: THREE.Vector3,
    readonly endPosition: THREE.Vector3
  ) {
    this.group = new THREE.Group();
    this.id = this.group.uuid;

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

    const controlButtonRadiusScale = 0.1;
    this.moveButton = generateSphere(
      this.stickRadius * controlButtonRadiusScale,
      localStartPosition,
      moveMaterial
    );

    this.rotateButton = generateSphere(
      this.stickRadius * controlButtonRadiusScale,
      localEndPosition,
      rotateMaterial
    );

    this.initialControlButtonScale = this.moveButton.scale.clone();

    this.meshIds.push(
      body.uuid,
      topCap.uuid,
      bottomCap.uuid,
      this.moveButton.uuid,
      this.rotateButton.uuid
    );

    this.group.add(body);
    this.group.add(topCap);
    this.group.add(bottomCap);
    this.group.add(this.moveButton);
    this.group.add(this.rotateButton);

    const centrePoint = computeMidpoint(this.startPosition, this.endPosition);
    this.group.position.set(centrePoint.x, centrePoint.y, centrePoint.z);

    const axisOfRotation = new THREE.Vector3(0, 1, 0);
    const axisOfAlignment = this.endPosition
      .sub(this.startPosition)
      .normalize();

    this.group.quaternion.setFromUnitVectors(axisOfRotation, axisOfAlignment);
  }

  onMouseDown(
    event: MouseEvent,
    intersection: THREE.Intersection | undefined
  ): void {
    if (!intersection) {
      return;
    }

    this.pIntersect.copy(intersection.point);
    this.plane.setFromNormalAndCoplanarPoint(
      this.interactionService.getCameraWorldDirection(),
      this.pIntersect
    );
    this.shift.subVectors(intersection.object.position, intersection.point);

    const intersectionUuid = intersection?.object.uuid;

    if (intersectionUuid === this.moveButton.uuid) {
      this.moveButtonSelected = true;
      this.rotateButtonSelected = false;
    } else if (intersectionUuid === this.rotateButton.uuid) {
      this.rotateButtonSelected = true;
      this.moveButtonSelected = false;
    } else {
      this.rotateButtonSelected = false;
      this.moveButtonSelected = false;
    }

    if (this.moveButtonSelected) {
      const initialClickPosition = this.calculateIntersectingPosition();
      this.initialClickToCentre = initialClickPosition
        .clone()
        .sub(this.group.position);
    }
  }

  onMouseUp(
    event: MouseEvent,
    intersection: THREE.Intersection | undefined
  ): void {
    this.moveButtonSelected = false;
    this.rotateButtonSelected = false;
  }

  onMouseMove(
    event: MouseEvent,
    intersection: THREE.Intersection | undefined
  ): void {
    if (this.moveButtonSelected) {
      const newPosition = this.calculateIntersectingPosition();
      const offsetPosition = newPosition.sub(this.initialClickToCentre);
      this.group.position.set(
        offsetPosition.x,
        offsetPosition.y,
        offsetPosition.z
      );
    }
  }

  onWheel(
    event: WheelEvent,
    intersection: THREE.Intersection | undefined
  ): void {
    throw new Error('Method not implemented.');
  }

  update() {}

  showMouseControls(): void {
    if (this.mouseControlsShown) {
      return;
    }

    const scaleFactor = 10;
    const updatedScale = new THREE.Vector3(
      this.initialControlButtonScale.x * scaleFactor,
      this.initialControlButtonScale.y * scaleFactor,
      this.initialControlButtonScale.z * scaleFactor
    );

    this.updateButtonScale(updatedScale);
    this.mouseControlsShown = true;
  }

  hideMouseControls(): void {
    if (!this.mouseControlsShown) {
      return;
    }

    this.updateButtonScale(this.initialControlButtonScale);
    this.mouseControlsShown = false;
  }

  private calculateIntersectingPosition(): THREE.Vector3 {
    this.interactionService.raycaster.ray.intersectPlane(
      this.plane,
      this.planeIntersect
    );

    const newPosition = new THREE.Vector3().addVectors(
      this.planeIntersect,
      this.shift
    );

    return newPosition;
  }

  private updateButtonScale(scale: THREE.Vector3) {
    this.moveButton.scale.set(scale.x, scale.y, scale.z);
    this.rotateButton.scale.set(scale.x, scale.y, scale.z);
  }

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
