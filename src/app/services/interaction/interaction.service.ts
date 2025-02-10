import { Injectable } from '@angular/core';
import * as THREE from 'three';
import { IMouseInteractable } from '../../interfaces/mouse-interactable';
import { ISceneObject } from '../../interfaces/scene-object';
import { IStickObject } from '../../interfaces/stick-object';
import { CameraService } from '../rendering/camera.service';
import { ObjectTrackerService } from '../rendering/object-tracker.service';

@Injectable({
  providedIn: 'root',
})
export class InteractionService {
  public readonly raycaster = new THREE.Raycaster();
  private sceneSize = new THREE.Vector2();
  private sceneOffset = new THREE.Vector2();
  private selectedMouseInteractable:
    | {
        interactable: IMouseInteractable;
        intersection: THREE.Intersection;
      }
    | undefined = undefined;
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

  toggleInteractions(enabled: boolean): void {
    this.interactionEnabled = enabled;
  }

  mousePositionToThreeSpace(posX: number, posY: number): THREE.Vector2 {
    // calculate pointer position in normalized device coordinates
    // (-1 to +1) for both components

    const normalizedPosX =
      ((posX - this.sceneOffset.x) / this.sceneSize.x) * 2 - 1;
    const normalizedPosY =
      -((posY - this.sceneOffset.y) / this.sceneSize.y) * 2 + 1;

    return new THREE.Vector2(normalizedPosX, normalizedPosY);
  }

  setRaycasterFromMouse(event: MouseEvent) {
    this.raycaster.setFromCamera(
      this.mousePositionToThreeSpace(event.clientX, event.clientY),
      this.cameraService.getCamera()
    );
  }

  getCameraWorldDirection() {
    return this.cameraService.getCameraWorldDirection();
  }

  getCameraWorldPosition() {
    return this.cameraService.getCameraWorldPosition();
  }

  private getSceneIntersections():
    | {
        interactable: IMouseInteractable;
        intersection: THREE.Intersection;
      }
    | undefined {
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
          if (sceneObject.id.includes(targetId)) {
            return {
              interactable: this.toMouseInteractable(sceneObject),
              intersection: intersection,
            };
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

  private isStickObject(object: IMouseInteractable | ISceneObject): boolean {
    return 'showMouseControls' in object;
  }

  private toStickObject(
    object: IMouseInteractable | ISceneObject
  ): IStickObject {
    return object as unknown as IStickObject;
  }

  private onMouseDown(event: MouseEvent): void {
    if (!this.interactionEnabled) {
      return;
    }

    this.setRaycasterFromMouse(event);
    const sceneObject = this.getSceneIntersections();
    if (sceneObject) {
      this.selectedMouseInteractable = sceneObject;
      this.selectedMouseInteractable.interactable.onMouseDown(
        event,
        sceneObject.intersection
      );
    } else {
      this.cameraService.onMouseDown(event);
    }

    this.mouseDepressed = true;
  }

  private onMouseUp(event: MouseEvent): void {
    if (!this.interactionEnabled) {
      return;
    }

    this.selectedMouseInteractable = undefined;

    this.cameraService.onMouseUp(event);

    this.mouseDepressed = false;
  }

  private onMouseMove(event: MouseEvent): void {
    if (!this.interactionEnabled) {
      return;
    }

    this.setRaycasterFromMouse(event);

    if (!this.selectedMouseInteractable) {
      this.cameraService.onMouseMove(event);
    } else {
      this.selectedMouseInteractable.interactable.onMouseMove(
        event,
        this.selectedMouseInteractable.intersection
      );
    }

    if (this.mouseDepressed) {
      return;
    }

    const sceneObject = this.getSceneIntersections();

    if (sceneObject && this.isStickObject(sceneObject.interactable)) {
      this.toStickObject(sceneObject.interactable).showMouseControls();
    }

    for (let object of this.objectTrackerService.getObjects()) {
      if (this.isStickObject(object)) {
        if (object.id !== sceneObject?.interactable.id) {
          this.toStickObject(object).hideMouseControls();
        }
      }
    }
  }

  private onKeyDown(event: KeyboardEvent): void {
    if (!this.interactionEnabled) {
      return;
    }
  }

  private onKeyUp(event: KeyboardEvent): void {
    if (!this.interactionEnabled) {
      return;
    }
  }

  private onWheel(event: WheelEvent): void {
    if (!this.interactionEnabled) {
      return;
    }
  }
}
