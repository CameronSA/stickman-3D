import { Injectable } from '@angular/core';
import * as THREE from 'three';
import { throttle } from 'lodash-es';
import {
  FARCLIPPINGPLANE,
  FOV,
  FPS,
  NEARCLIPPINGPLANE,
  DEFAULTBACKGROUND,
} from '../constants';
import { ObjectTrackerService } from './object-tracker.service';
import { ISceneObject } from '../objects/scene-object';
import { Cube } from '../objects/cube/cube';

@Injectable({
  providedIn: 'root',
})
export class ThreeService {
  private lastRenderTime: number = new Date().getTime();
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;

  constructor(private readonly objectTrackerService: ObjectTrackerService) {
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(
      FOV,
      window.innerWidth / window.innerHeight,
      NEARCLIPPINGPLANE,
      FARCLIPPINGPLANE
    );
  }

  createThreeJsBox(): void {
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    this.addObjectToScene(new Cube());

    this.camera.position.z = 5;

    const animate = () => {
      const currentTime = new Date().getTime();
      if (currentTime - this.lastRenderTime > 1000 / FPS) {
        this.lastRenderTime += 1000 / FPS;
        this.updateObjects();
        renderer.render(this.scene, this.camera);
      }
    };

    renderer.setClearColor(DEFAULTBACKGROUND);
    renderer.setAnimationLoop(animate);

    window.addEventListener(
      'resize',
      throttle(
        () => {
          this.camera.aspect = window.innerWidth / window.innerHeight;
          this.camera.updateProjectionMatrix();
          renderer.setSize(window.innerWidth, window.innerHeight);
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
