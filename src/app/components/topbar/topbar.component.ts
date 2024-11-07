import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Color, MeshBasicMaterial, Vector3 } from 'three';
import { Cube } from '../../objects/cube';
import { Grid } from '../../objects/grid';
import { Origin } from '../../objects/origin';
import { Stick } from '../../objects/stick';
import { Stickman } from '../../objects/stickman';
import { CameraService } from '../../services/rendering/camera.service';
import { ThreeService } from '../../services/rendering/three.service';

@Component({
  selector: 'app-topbar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './topbar.component.html',
  styleUrl: './topbar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TopbarComponent {
  private gridVisible: boolean = false;
  private cubesVisible: boolean = false;
  private origin: Origin | undefined = undefined;
  private grid: Grid | undefined = undefined;
  private cubes: Cube[] = [];
  private stickMan: Stickman | undefined = undefined;
  private stickManVisible: boolean = false;

  constructor(
    private readonly threeService: ThreeService,
    private readonly cameraService: CameraService
  ) {
    this.onToggleGridClick();

    let stick = new Stick(
      1,
      new MeshBasicMaterial({
        color: new Color(0xffffff).multiplyScalar(0.5),
        polygonOffset: true,
        polygonOffsetFactor: 1,
        polygonOffsetUnits: 1,
      }),
      new Vector3(0, 0, 0),
      new Vector3(10, 10, 10)
    );

    this.threeService.addObjectToScene(stick);
  }

  onToggleGridClick() {
    this.gridVisible = !this.gridVisible;

    if (!this.origin) {
      this.origin = new Origin();
    }

    if (!this.grid) {
      this.grid = new Grid();
    }

    if (this.gridVisible) {
      this.threeService.addObjectToScene(this.grid);
      this.threeService.addObjectToScene(this.origin);
    } else {
      this.threeService.removeObjectFromScene(this.origin);
      this.threeService.removeObjectFromScene(this.grid);
    }
  }

  onToggleCubesClick() {
    this.cubesVisible = !this.cubesVisible;

    function random() {
      return Math.floor(Math.random() * 100) - 50;
    }

    if (this.cubes.length === 0) {
      for (let i = 0; i < 1000; i++) {
        this.cubes.push(new Cube(random(), Math.abs(random()) + 1, random()));
      }
    }

    if (this.cubesVisible) {
      this.threeService.addObjectsToScene(this.cubes);
    } else {
      this.threeService.removeObjectsFromScene(this.cubes);
    }
  }

  onToggleStickmanClick() {
    this.stickManVisible = !this.stickManVisible;

    if (!this.stickMan) {
      this.stickMan = new Stickman(0, 3, 0);
    }

    if (this.stickManVisible) {
      this.threeService.addObjectToScene(this.stickMan);
    } else {
      this.threeService.removeObjectFromScene(this.stickMan);
    }
  }

  onResetCameraClick() {
    this.cameraService.reset();
  }
}
