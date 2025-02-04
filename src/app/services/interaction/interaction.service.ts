import { Injectable } from '@angular/core';
import * as THREE from 'three';
import { IKeyboardInteractable } from '../../interfaces/keyboard-interactable';
import { IMouseInteractable } from '../../interfaces/mouse-interactable';
import { ISceneObject } from '../../interfaces/scene-object';
import { IStickObject } from '../../interfaces/stick-object';
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
  private selectedMouseInteractable: IMouseInteractable | undefined = undefined;
  private mouseDepressed: boolean = false;
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

  private getSceneIntersections(
    event: MouseEvent
  ): IMouseInteractable | undefined {
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

    if (intersects.length < 0) {
      return undefined;
    }

    for (let intersection of intersects) {
      if (!intersection.object.parent) {
        continue;
      }

      try {
        const targetId = intersection.object.parent?.uuid;

        for (let sceneObject of sceneObjects) {
          if (sceneObject.meshIds.includes(targetId)) {
            return this.toMouseInteractable(sceneObject);
          }
        }
      } catch {
        continue;
      }
    }

    return undefined;
  }

  private isMouseInteractable(object: ISceneObject): boolean {
    return 'onMouseDown' in object;
  }

  private toMouseInteractable(object: ISceneObject): IMouseInteractable {
    return object as unknown as IMouseInteractable;
  }

  private isStickObject(object: any): boolean {
    return 'showMouseControls' in object;
  }

  private toStickObject(object: any): IStickObject {
    return object as unknown as IStickObject;
  }

  private onMouseDown(event: MouseEvent): void {
    if (!this.interactionEnabled) {
      return;
    }

    const sceneObject = this.getSceneIntersections(event);
    if (sceneObject) {
      this.selectedMouseInteractable = sceneObject;
    }

    for (let interactable of this.mouseInteractables) {
      interactable.onMouseDown(event);
    }

    this.mouseDepressed = true;
  }

  private onMouseUp(event: MouseEvent): void {
    if (!this.interactionEnabled) {
      return;
    }

    this.selectedMouseInteractable = undefined;

    for (let interactable of this.mouseInteractables) {
      interactable.onMouseUp(event);
    }

    this.mouseDepressed = false;
  }

  private onMouseMove(event: MouseEvent): void {
    if (!this.interactionEnabled) {
      return;
    }

    if (!this.selectedMouseInteractable) {
      this.cameraService.onMouseMove(event);
    } else {
      this.selectedMouseInteractable.onMouseMove(event);
    }

    if (this.mouseDepressed) {
      return;
    }

    const sceneObject = this.getSceneIntersections(event);

    if (sceneObject && this.isStickObject(sceneObject)) {
      this.toStickObject(sceneObject).showMouseControls();
    }

    for (let object of this.objectTrackerService.getObjects()) {
      if (this.isStickObject(object)) {
        if (object.id !== sceneObject?.id) {
          this.toStickObject(object).hideMouseControls();
        }
      }
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
