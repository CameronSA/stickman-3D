import { ChangeDetectionStrategy, Component } from '@angular/core';
import * as THREE from 'three';
import { CameraPlane } from '../../objects/camera-plane';
import { InteractionService } from '../../services/interaction/interaction.service';
import { ThreeService } from '../../services/rendering/three.service';

@Component({
  selector: 'app-dev-tools',
  standalone: true,
  imports: [],
  templateUrl: `./dev-tools.component.html`,
  styleUrl: './dev-tools.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DevToolsComponent {
  private showPlane = false;

  private cameraPlane: CameraPlane;

  constructor(
    private readonly interactionService: InteractionService,
    private readonly threeService: ThreeService
  ) {
    const cameraPlaneMaterial = new THREE.MeshStandardMaterial({
      color: 0x99ffff,
      side: THREE.DoubleSide,
      opacity: 0.7,
      transparent: true,
    });
    this.cameraPlane = new CameraPlane(
      this.interactionService,
      cameraPlaneMaterial,
      35
    );
  }

  onTogglePlaneClick() {
    this.showPlane = !this.showPlane;

    if (this.showPlane) {
      this.threeService.addObjectToScene(this.cameraPlane);
    } else {
      this.threeService.removeObjectFromScene(this.cameraPlane);
    }
  }
}
