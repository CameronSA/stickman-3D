import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Grid } from '../../objects/grid';
import { Origin } from '../../objects/origin';
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
  private origin: Origin | undefined = undefined;
  private grid: Grid | undefined = undefined;

  constructor(private readonly threeService: ThreeService) {}

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
}
