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

  onKeyDown(event: KeyboardEvent): void {
    throw new Error('Method not implemented.');
  }

  onKeyUp(event: KeyboardEvent): void {
    throw new Error('Method not implemented.');
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

  updatePosition(position: THREE.Vector3) {
    this.camera.position.x = position.x;
    this.camera.position.y = position.y;
    this.camera.position.z = position.z;
  }

  getCamera(): THREE.PerspectiveCamera {
    return this.camera;
  }

  rescale(aspectRatio: number) {
    this.camera.aspect = aspectRatio;
    this.camera.updateProjectionMatrix();
  }
}
