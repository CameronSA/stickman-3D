import { Injectable } from '@angular/core';
import { throttle } from 'lodash-es';
import * as THREE from 'three';
import {
  DEFAULTBACKGROUND,
  DEFAULTFOG,
  DEFAULTWORLDSIZE,
  FPS,
} from '../../constants';
import { ISceneObject } from '../../interfaces/scene-object';
import { Floor } from '../../objects/floor';
import { Grid } from '../../objects/grid';
import { Light } from '../../objects/light';
import { Origin } from '../../objects/origin';
import { InteractionService } from '../interaction/interaction.service';
import { CameraService } from './camera.service';
import { ObjectTrackerService } from './object-tracker.service';

@Injectable({
  providedIn: 'root',
})
export class ThreeService {
  private lastRenderTime: number = new Date().getTime();
  private scene: THREE.Scene;

  constructor(
    private readonly objectTrackerService: ObjectTrackerService,
    private readonly cameraService: CameraService,
    private readonly interactionService: InteractionService
  ) {
    this.scene = new THREE.Scene();
  }

  createThreeJsBox(): void {
    this.interactionService.addInteractable(this.cameraService);
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(devicePixelRatio);
    document.body.appendChild(renderer.domElement);

    this.addObjectToScene(new Light());
    this.addObjectToScene(new Origin());
    this.addObjectToScene(new Floor());
    this.addObjectToScene(new Grid(DEFAULTWORLDSIZE, DEFAULTWORLDSIZE * 2));
    // this.addObjectToScene(new Cube(0, -2, 0));
    // this.addObjectToScene(new Cube(1, 1, 2));
    // this.addObjectToScene(new Cube(-4, 0, 1));
    const animate = () => {
      const currentTime = new Date().getTime();
      if (currentTime - this.lastRenderTime > 1000 / FPS) {
        this.lastRenderTime += 1000 / FPS;
        this.updateObjects();
        renderer.render(this.scene, this.cameraService.getCamera());
      }
    };

    renderer.setClearColor(DEFAULTBACKGROUND);
    renderer.setAnimationLoop(animate);

    this.scene.fog = DEFAULTFOG;

    window.addEventListener(
      'resize',
      throttle(
        () => {
          this.cameraService.rescale(window.innerWidth / window.innerHeight);
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
      if (trackedObject.group.id === sceneObject.group.id) {
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
