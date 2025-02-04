import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Color, MeshBasicMaterial, Vector3 } from 'three';
import { Stick } from '../../objects/stick';
import { ThreeService } from '../../services/rendering/three.service';

@Component({
  selector: 'app-creator',
  standalone: true,
  imports: [],
  templateUrl: `./creator.component.html`,
  styleUrl: './creator.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreatorComponent {
  constructor(public readonly threeService: ThreeService) {}

  onItemClick(cellId: number, event: any) {
    let stickMaterial = new MeshBasicMaterial({
      color: new Color(0x2e2d2a).multiplyScalar(0.5),
      polygonOffset: true,
      polygonOffsetFactor: 1,
      polygonOffsetUnits: 1,
    });

    let moveMaterial = new MeshBasicMaterial({
      color: new Color(0xff8800).multiplyScalar(0.5),
      polygonOffset: true,
      polygonOffsetFactor: 1,
      polygonOffsetUnits: 1,
    });

    let rotateMaterial = new MeshBasicMaterial({
      color: new Color(0xff0000).multiplyScalar(0.5),
      polygonOffset: true,
      polygonOffsetFactor: 1,
      polygonOffsetUnits: 1,
    });

    let stick = new Stick(
      1,
      stickMaterial,
      moveMaterial,
      rotateMaterial,
      new Vector3(0, 5, 0),
      new Vector3(0, 15, 0)
    );

    this.threeService.addObjectToScene(stick);
  }
}
