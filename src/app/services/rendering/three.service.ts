import { Injectable } from '@angular/core';
import { throttle } from 'lodash-es';
import * as THREE from 'three';
import { DEFAULTBACKGROUND, DEFAULTFOG, FPS } from '../../constants';
import { ISceneObject } from '../../interfaces/scene-object';
import { Light } from '../../objects/light';
import { InteractionService } from '../interaction/interaction.service';
import { CameraService } from './camera.service';
import { ObjectTrackerService } from './object-tracker.service';

@Injectable({
  providedIn: 'root',
})
export class ThreeService {
  private lastRenderTime: number = new Date().getTime();
  private scene: THREE.Scene;
  private container: HTMLElement | undefined = undefined;

  constructor(
    private readonly objectTrackerService: ObjectTrackerService,
    private readonly cameraService: CameraService,
    private readonly interactionService: InteractionService
  ) {
    this.scene = new THREE.Scene();
  }

  createThreeJsBox(containerElementId: string): void {
    this.container = document.getElementById(containerElementId) as HTMLElement;
    this.interactionService.addInteractable(this.cameraService);
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(this.container.offsetWidth, this.container.offsetHeight);
    renderer.setPixelRatio(devicePixelRatio);
    this.container.appendChild(renderer.domElement);

    this.addObjectToScene(new Light());
    // this.addObjectToScene(new Floor());
    const animate = () => {
      const currentTime = new Date().getTime();
      if (currentTime - this.lastRenderTime > 1000 / FPS) {
        this.lastRenderTime += 1000 / FPS;
        this.updateObjects();
        renderer.render(this.scene, this.cameraService.getCamera());
        this.cameraService.updatePositionIfMoving();
      }
    };

    renderer.setClearColor(DEFAULTBACKGROUND);
    renderer.setAnimationLoop(animate);

    this.scene.fog = DEFAULTFOG;

    window.addEventListener(
      'resize',
      throttle(
        () => {
          this.cameraService.rescale(
            this.container?.offsetWidth! / this.container?.offsetHeight!
          );
          renderer.setSize(
            this.container?.offsetWidth!,
            this.container?.offsetHeight!
          );
        },
        1000 / FPS,
        { trailing: true }
      ),
      false
    );
  }

  addObjectToScene(sceneObject: ISceneObject) {
    if (sceneObject.existsInScene) {
      return;
    }

    this.scene.add(sceneObject.group);
    sceneObject.existsInScene = true;

    if (!this.objectIsTracked(sceneObject)) {
      this.objectTrackerService.addObject(sceneObject);
    }
  }

  addObjectsToScene(sceneObjects: ISceneObject[]) {
    for (let sceneObject of sceneObjects) {
      this.addObjectToScene(sceneObject);
    }
  }

  removeObjectFromScene(sceneObject: ISceneObject) {
    this.objectTrackerService.deleteObject(sceneObject);

    this.deleteChildren(sceneObject.group);

    this.scene.remove(sceneObject.group);
    sceneObject.existsInScene = false;
  }

  removeObjectsFromScene(sceneObjects: ISceneObject[]) {
    for (let sceneObject of sceneObjects) {
      this.removeObjectFromScene(sceneObject);
    }
  }

  private deleteChildren(parent: THREE.Object3D): void {
    if (parent.children.length === 0) {
      return;
    }

    for (let child of parent.children) {
      if (child.children.length > 0) {
        this.deleteChildren(child);
      } else {
        if (child instanceof THREE.Mesh) {
          let mesh = child as THREE.Mesh;
          mesh.geometry.dispose();
        }
      }
    }
  }

  private objectIsTracked(sceneObject: ISceneObject): boolean {
    for (let trackedObject of this.objectTrackerService.getObjects()) {
      if (trackedObject.id.equals(sceneObject.id)) {
        return true;
      }
    }

    return false;
  }

  private updateObjects() {
    for (let sceneObject of this.objectTrackerService.getObjects()) {
      sceneObject.update();
    }
  }
}
