import { Injectable } from '@angular/core';
import * as THREE from 'three';
import {
  DEFAULTCAMERAPOSITION,
  DEFAULTMOUSESENSITIVITY,
  FARCLIPPINGPLANE,
  FOV,
  NEARCLIPPINGPLANE,
} from '../../constants';
import { IKeyboardInteractable } from '../../interfaces/keyboard-interactable';
import { IMouseInteractable } from '../../interfaces/mouse-interactable';
import { ISceneObject } from '../../interfaces/scene-object';
import { CameraBoom } from '../../objects/camera-boom';

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
  private readonly cameraBoom: ISceneObject;
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

    this.cameraBoom = new CameraBoom(0, 0, 0);
    this.cameraBoom.group.add(this.camera);
    this.camera.position.set(
      DEFAULTCAMERAPOSITION.x,
      DEFAULTCAMERAPOSITION.y,
      DEFAULTCAMERAPOSITION.z
    );

    this.camera.lookAt(0, 0, 0);
  }

  getCameraBoom(): CameraBoom {
    return this.cameraBoom;
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

    if (
      this.mouseButton === MouseButton.Left ||
      this.mouseButton === MouseButton.Middle
    ) {
      if (this.shiftPressed || this.mouseButton === MouseButton.Middle) {
        this.cameraBoom.group.rotation.y -=
          event.movementX * DEFAULTMOUSESENSITIVITY;
        this.camera.lookAt(0, 0, 0);
      }

      if (this.controlPressed || this.mouseButton === MouseButton.Middle) {
        this.cameraBoom.group.rotation.x +=
          event.movementY * DEFAULTMOUSESENSITIVITY;
        this.camera.lookAt(0, 0, 0);
      }

      if (!this.controlPressed && !this.shiftPressed) {
        this.camera.position.y += event.movementY * DEFAULTMOUSESENSITIVITY;
        this.camera.position.x -= event.movementX * DEFAULTMOUSESENSITIVITY;
      }
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
