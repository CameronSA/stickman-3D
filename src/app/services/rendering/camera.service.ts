import { Injectable } from '@angular/core';
import * as THREE from 'three';
import { FARCLIPPINGPLANE, FOV, NEARCLIPPINGPLANE } from '../../constants';
import { IKeyboardInteractable } from '../../interfaces/keyboard-interactable';
import { IMouseInteractable } from '../../interfaces/mouse-interactable';

@Injectable({
  providedIn: 'root',
})
export class CameraService
  implements IMouseInteractable, IKeyboardInteractable
{
  private readonly camera: THREE.PerspectiveCamera;

  constructor() {
    this.camera = new THREE.PerspectiveCamera(
      FOV,
      window.innerWidth / window.innerHeight,
      NEARCLIPPINGPLANE,
      FARCLIPPINGPLANE
    );
  }

  onKeyDown(event: KeyboardEvent): void {}

  onKeyUp(event: KeyboardEvent): void {}

  onMouseDown(event: MouseEvent): void {}

  onMouseUp(event: MouseEvent): void {}

  onMouseMove(event: MouseEvent): void {}

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
