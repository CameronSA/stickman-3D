import * as THREE from 'three';
import { RotationSetting } from '../components/enums/rotation-setting';
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
  private rotateButtons: THREE.Mesh[] = [];
  private initialControlButtonScale: THREE.Vector3;
  private moveButtonSelected = false;
  private rotateButtonSelectedIndex = -1;
  private rotationSetting = RotationSetting.AroundFarRotationPoint;

  private plane = new THREE.Plane();
  private planeIntersect = new THREE.Vector3(); // point of intersection with the plane
  private pIntersect = new THREE.Vector3(); // point of intersection with an object (plane's point)
  private shift = new THREE.Vector3(); // distance between position of an object and points of intersection with the object
  private initialClickToCentre = new THREE.Vector3();
  private initialClickPosition = new THREE.Vector3();
  private cameraDirection = new THREE.Vector3();

  constructor(
    private readonly interactionService: InteractionService,
    private readonly stickRadius: number,
    private readonly material: THREE.Material,
    readonly moveMaterial: THREE.Material,
    readonly rotateMaterial: THREE.Material,
    public startPosition: THREE.Vector3,
    public endPosition: THREE.Vector3
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
      computeMidpoint(localStartPosition, localEndPosition),
      moveMaterial
    );

    this.rotateButtons.push(
      generateSphere(
        this.stickRadius * controlButtonRadiusScale,
        localStartPosition,
        rotateMaterial
      )
    );

    this.rotateButtons.push(
      generateSphere(
        this.stickRadius * controlButtonRadiusScale,
        localEndPosition,
        rotateMaterial
      )
    );

    this.initialControlButtonScale = this.moveButton.scale.clone();

    this.meshIds.push(
      body.uuid,
      topCap.uuid,
      bottomCap.uuid,
      this.moveButton.uuid
    );

    this.group.add(body);
    this.group.add(topCap);
    this.group.add(bottomCap);
    this.group.add(this.moveButton);

    for (const rotateButton of this.rotateButtons) {
      this.meshIds.push(rotateButton.uuid);
      this.group.add(rotateButton);
    }

    const centrePoint = computeMidpoint(this.startPosition, this.endPosition);
    this.group.position.set(centrePoint.x, centrePoint.y, centrePoint.z);

    const axisOfRotation = new THREE.Vector3(0, 1, 0);
    const axisOfAlignment = this.endPosition
      .clone()
      .sub(this.startPosition)
      .normalize();

    this.group.quaternion.setFromUnitVectors(axisOfRotation, axisOfAlignment);
  }

  setRotationSetting(rotationSetting: RotationSetting): void {
    this.rotationSetting = rotationSetting;
  }

  getCurrentCenterPosition(): THREE.Vector3 {
    if (
      this.moveButtonSelected ||
      this.rotationSetting === RotationSetting.AroundCenter
    ) {
      return this.group.position;
    }

    if (
      this.rotationSetting === RotationSetting.AroundFarRotationPoint &&
      this.rotateButtonSelectedIndex > -1
    ) {
      if (this.rotateButtonSelectedIndex === 0) {
        return this.endPosition;
      }

      return this.startPosition;
    }

    return new THREE.Vector3();
  }

  onMouseDown(
    event: MouseEvent,
    intersection: THREE.Intersection | undefined
  ): void {
    if (!intersection) {
      return;
    }

    this.cameraDirection = this.interactionService.getCameraWorldDirection();

    // this.axisOfRotation = this.calculateAxisOfRotation();

    this.pIntersect.copy(intersection.point);
    this.plane.setFromNormalAndCoplanarPoint(
      this.cameraDirection,
      this.pIntersect
    );
    this.shift.subVectors(intersection.object.position, intersection.point);

    const intersectionUuid = intersection?.object.uuid;

    if (intersectionUuid === this.moveButton.uuid) {
      this.moveButtonSelected = true;
      this.rotateButtonSelectedIndex = -1;
    } else {
      this.rotateButtonSelectedIndex = -1;
      for (let i = 0; i < this.rotateButtons.length; i++) {
        if (this.rotateButtons[i].uuid === intersectionUuid) {
          this.rotateButtonSelectedIndex = i;
          break;
        }
      }

      this.moveButtonSelected = false;
    }

    this.initialClickPosition = this.calculateIntersectingPosition();
    this.initialClickToCentre = this.initialClickPosition
      .clone()
      .sub(this.group.position);
  }

  onMouseUp(
    event: MouseEvent,
    intersection: THREE.Intersection | undefined
  ): void {
    this.moveButtonSelected = false;
    this.rotateButtonSelectedIndex = -1;
  }

  onMouseMove(
    event: MouseEvent,
    intersection: THREE.Intersection | undefined
  ): void {
    const newPosition = this.calculateIntersectingPosition();
    const offsetPosition = newPosition.sub(this.initialClickToCentre);
    const vectorMoved = offsetPosition.clone().sub(this.group.position);
    if (this.moveButtonSelected) {
      this.startPosition.add(vectorMoved);
      this.endPosition.add(vectorMoved);

      this.group.position.set(
        offsetPosition.x,
        offsetPosition.y,
        offsetPosition.z
      );
    } else if (this.rotateButtonSelectedIndex > -1) {
      if (this.rotationSetting === RotationSetting.AroundCenter) {
        this.handleRotationAboutCentre(
          vectorMoved,
          this.rotateButtonSelectedIndex === 0 ? -1 : 1
        );
      } else if (
        this.rotationSetting === RotationSetting.AroundFarRotationPoint
      ) {
        this.handleRotationAboutOppositeRotationPoint(
          vectorMoved,
          this.rotateButtonSelectedIndex === 0 ? -1 : 1
        );
      }
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

    const scaleFactor = 11;
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

  private handleRotationAboutCentre(
    vectorMoved: THREE.Vector3,
    lengthSignMultiplier: number
  ) {
    const projectedEndPosition = this.endPosition.clone().add(vectorMoved);
    const projectedLength =
      lengthSignMultiplier *
      this.group.position.distanceTo(projectedEndPosition);
    const lengthFraction = this.stickLength / (2 * projectedLength);

    this.endPosition = this.group.position
      .clone()
      .add(projectedEndPosition)
      .multiplyScalar(lengthFraction);

    this.startPosition = this.group.position
      .clone()
      .sub(projectedEndPosition)
      .multiplyScalar(lengthFraction);

    const axisOfRotation = new THREE.Vector3(0, 1, 0);
    const axisOfAlignment = this.endPosition
      .clone()
      .sub(this.startPosition)
      .normalize();

    this.group.quaternion.setFromUnitVectors(axisOfRotation, axisOfAlignment);
  }

  private handleRotationAboutOppositeRotationPoint(
    vectorMoved: THREE.Vector3,
    lengthSignMultiplier: number
  ) {
    const projectedEndPosition = this.endPosition.clone().add(vectorMoved);
    const projectedLength =
      lengthSignMultiplier *
      this.startPosition.distanceTo(projectedEndPosition);
    const lengthFraction = this.stickLength / projectedLength;

    this.endPosition = this.startPosition
      .clone()
      .add(projectedEndPosition)
      .multiplyScalar(lengthFraction);

    const axisOfRotation = new THREE.Vector3(0, 1, 0);
    const axisOfAlignment = this.endPosition
      .clone()
      .sub(this.startPosition)
      .normalize();

    const newPosition = computeMidpoint(this.startPosition, this.endPosition);
    this.group.position.set(newPosition.x, newPosition.y, newPosition.z);
    this.group.quaternion.setFromUnitVectors(axisOfRotation, axisOfAlignment);
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

    for (const rotateButton of this.rotateButtons) {
      rotateButton.scale.set(scale.x, scale.y, scale.z);
    }
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
