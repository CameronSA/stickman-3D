import { Injectable } from '@angular/core';
import * as THREE from 'three';
import { IKeyboardInteractable } from '../../interfaces/keyboard-interactable';
import { IMouseInteractable } from '../../interfaces/mouse-interactable';
import { ISceneObject } from '../../interfaces/scene-object';
import { CameraService } from '../rendering/camera.service';
import { ObjectTrackerService } from '../rendering/object-tracker.service';

@Injectable({
  providedIn: 'root',
})
export class InteractionService {
  private readonly mouseInteractables: IMouseInteractable[] = [];
  private readonly keyboardInteractables: IKeyboardInteractable[] = [];
  private readonly raycaster = new THREE.Raycaster();
  private sceneSize = new THREE.Vector2();
  private sceneOffset = new THREE.Vector2();

  private interactionEnabled: boolean = true;

  constructor(
    private readonly cameraService: CameraService,
    private readonly objectTrackerService: ObjectTrackerService
  ) {
    window.addEventListener('mousedown', (event) => this.onMouseDown(event));
    window.addEventListener('mouseup', (event) => this.onMouseUp(event));
    window.addEventListener('mousemove', (event) => this.onMouseMove(event));
    window.addEventListener('keydown', (event) => this.onKeyDown(event));
    window.addEventListener('keyup', (event) => this.onKeyUp(event));
    window.addEventListener('wheel', (event) => this.onWheel(event), {
      passive: false,
    });
  }

  updateSceneChildren() {}

  setSceneSize(element: HTMLElement) {
    this.sceneSize = new THREE.Vector2(
      element.offsetWidth,
      element.offsetHeight
    );

    this.sceneOffset = new THREE.Vector2(element.offsetLeft, element.offsetTop);
  }

  addMouseInteractable(interactable: IMouseInteractable): void {
    this.mouseInteractables.push(interactable);
  }

  addKeyboardInteractable(interactable: IKeyboardInteractable): void {
    this.keyboardInteractables.push(interactable);
  }

  addInteractable<
    TInteractable extends IMouseInteractable & IKeyboardInteractable
  >(interactable: TInteractable): void {
    this.mouseInteractables.push(interactable as IMouseInteractable);
    this.keyboardInteractables.push(interactable as IKeyboardInteractable);
  }

  toggleInteractions(enabled: boolean): void {
    this.interactionEnabled = enabled;
  }

  private mousePositionToThreeSpace(posX: number, posY: number): THREE.Vector2 {
    // calculate pointer position in normalized device coordinates
    // (-1 to +1) for both components

    const normalizedPosX =
      ((posX - this.sceneOffset.x) / this.sceneSize.x) * 2 - 1;
    const normalizedPosY =
      -((posY - this.sceneOffset.y) / this.sceneSize.y) * 2 + 1;

    return new THREE.Vector2(normalizedPosX, normalizedPosY);
  }

  private getSceneIntersections(event: MouseEvent) {
    this.raycaster.setFromCamera(
      this.mousePositionToThreeSpace(event.clientX, event.clientY),
      this.cameraService.getCamera()
    );

    const sceneObjects = this.objectTrackerService.getObjects();
    const interactableObjects: THREE.Object3D[] = [];
    for (let sceneObject of sceneObjects) {
      if (this.isMouseInteractable(sceneObject)) {
        interactableObjects.push(sceneObject.group);
      }
    }

    const intersects = this.raycaster.intersectObjects(interactableObjects);

    for (let i = 0; i < intersects.length; i++) {
      (intersects[i].object as THREE.Mesh).material =
        new THREE.MeshBasicMaterial({
          color: new THREE.Color(0xff0000).multiplyScalar(0.5),
        });
    }

    if (intersects.length > 0) {
      console.log(interactableObjects);
      console.log(intersects);
    }
  }

  private isMouseInteractable(object: ISceneObject): boolean {
    return 'onMouseDown' in object;
  }

  private onMouseDown(event: MouseEvent): void {
    if (!this.interactionEnabled) {
      return;
    }

    for (let interactable of this.mouseInteractables) {
      interactable.onMouseDown(event);
    }
  }

  private onMouseUp(event: MouseEvent): void {
    if (!this.interactionEnabled) {
      return;
    }

    for (let interactable of this.mouseInteractables) {
      interactable.onMouseUp(event);
    }
  }

  private onMouseMove(event: MouseEvent): void {
    if (!this.interactionEnabled) {
      return;
    }

    const sceneIntersections = this.getSceneIntersections(event);

    for (let interactable of this.mouseInteractables) {
      interactable.onMouseMove(event);
    }
  }

  private onKeyDown(event: KeyboardEvent): void {
    if (!this.interactionEnabled) {
      return;
    }

    for (let interactable of this.keyboardInteractables) {
      interactable.onKeyDown(event);
    }
  }

  private onKeyUp(event: KeyboardEvent): void {
    if (!this.interactionEnabled) {
      return;
    }

    for (let interactable of this.keyboardInteractables) {
      interactable.onKeyUp(event);
    }
  }

  private onWheel(event: WheelEvent): void {
    if (!this.interactionEnabled) {
      return;
    }

    for (let interactable of this.mouseInteractables) {
      interactable.onWheel(event);
    }
  }
}
