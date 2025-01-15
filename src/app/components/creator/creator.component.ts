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
    console.log(event);
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
}
