import { Injectable } from '@angular/core';
import * as THREE from 'three';
import {
  DEFAULTCAMERAPOSITION,
  DEFAULTMOUSESENSITIVITY,
  FARCLIPPINGPLANE,
  FOV,
  NEARCLIPPINGPLANE,
} from '../../constants';
import {
  getCartesianCoordinate,
  getSphericalCoordinate,
} from '../../helpers/coordinate-helpers';
import { IKeyboardInteractable } from '../../interfaces/keyboard-interactable';
import { IMouseInteractable } from '../../interfaces/mouse-interactable';

enum MouseButton {
  Left,
  Middle,
  Right,
}

@Injectable({
  providedIn: 'root',
})
export class CameraService
  implements IMouseInteractable, IKeyboardInteractable
{
  private readonly camera: THREE.PerspectiveCamera;
  private mouseDown = false;
  private shiftPressed = false;
  private controlPressed = false;
  private mouseButton: MouseButton = MouseButton.Left;

  constructor() {
    this.camera = new THREE.PerspectiveCamera(
      FOV,
      window.innerWidth / window.innerHeight,
      NEARCLIPPINGPLANE,
      FARCLIPPINGPLANE
    );

    this.camera.position.set(
      DEFAULTCAMERAPOSITION.x,
      DEFAULTCAMERAPOSITION.y,
      DEFAULTCAMERAPOSITION.z
    );

    this.camera.lookAt(0, 0, 0);
  }

  onKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Shift') {
      this.shiftPressed = true;
    } else if (event.key === 'Control') {
      this.controlPressed = true;
    }
  }

  onKeyUp(event: KeyboardEvent): void {
    if (event.key === 'Shift') {
      this.shiftPressed = false;
    } else if (event.key === 'Control') {
      this.controlPressed = true;
    }
  }

  onMouseDown(event: MouseEvent): void {
    this.mouseDown = true;
    this.mouseButton = event.button;
  }

  onMouseUp(event: MouseEvent): void {
    this.mouseDown = false;
    this.shiftPressed = false;
    this.controlPressed = false;
  }

  onMouseMove(event: MouseEvent): void {
    // TODO: use spherical coordinates
    if (!this.mouseDown) {
      return;
    }

    if (this.mouseButton === MouseButton.Left) {
      const spherical = getSphericalCoordinate(this.camera.position);

      const xMovement = event.movementX * DEFAULTMOUSESENSITIVITY;
      const yMovement = event.movementY * DEFAULTMOUSESENSITIVITY;

      spherical.phi += xMovement;
      spherical.theta += yMovement;

      console.log(spherical.phi, spherical.theta);

      // Limit to avoid jank
      const floorLimit = Math.PI / 2;
      if (spherical.theta > floorLimit) {
        spherical.theta = floorLimit;
      }

      const heightLimit = 1e-3;
      if (spherical.theta < heightLimit) {
        spherical.theta = heightLimit;
      }

      const newPosition = getCartesianCoordinate(spherical);

      this.camera.position.set(newPosition.x, newPosition.y, newPosition.z);

      this.camera.lookAt(0, 0, 0);
    }
  }

  onWheel(event: WheelEvent): void {
    let cameraDirection = new THREE.Vector3();
    this.camera.getWorldDirection(cameraDirection);

    if (event.deltaY > 0) {
      cameraDirection.negate();
    }

    this.appendPosition(cameraDirection);
  }

  updatePosition(position: THREE.Vector3) {
    this.camera.position.x = position.x;
    this.camera.position.y = position.y;
    this.camera.position.z = position.z;
  }

  appendPosition(position: THREE.Vector3) {
    this.camera.position.x = position.x + this.camera.position.x;
    this.camera.position.y = position.y + this.camera.position.y;
    this.camera.position.z = position.z + this.camera.position.z;
  }

  getCamera(): THREE.PerspectiveCamera {
    return this.camera;
  }

  rescale(aspectRatio: number) {
    this.camera.aspect = aspectRatio;
    this.camera.updateProjectionMatrix();
  }
}
