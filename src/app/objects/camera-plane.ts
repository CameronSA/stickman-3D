import * as THREE from 'three';
import { IDevTool } from '../interfaces/dev-tools';
import { ISceneObject } from '../interfaces/scene-object';
import { InteractionService } from '../services/interaction/interaction.service';

export class CameraPlane implements ISceneObject, IDevTool {
  id: string;
  meshIds: string[] = [];
  group: THREE.Group;
  existsInScene: boolean = false;

  constructor(
    private readonly interactionService: InteractionService,
    readonly material: THREE.Material,
    size: number
  ) {
    this.group = new THREE.Group();
    this.id = this.group.uuid;

    const geometry = new THREE.PlaneGeometry(size, size);
    const plane = new THREE.Mesh(geometry, material);
    this.group.add(plane);
  }

  updatePostion(position: THREE.Vector3): void {
    this.group.position.set(position.x, position.y, position.z);
  }

  update() {
    const cameraDirection = this.interactionService.getCameraWorldDirection();
    this.group.lookAt(cameraDirection);
  }
}
