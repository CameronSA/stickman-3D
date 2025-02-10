import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CreatorComponent } from '../creator/creator.component';
import { DevToolsComponent } from '../dev-tools/dev-tools.component';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, CreatorComponent, DevToolsComponent],
  templateUrl: `./sidebar.component.html`,
  styleUrl: './sidebar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidebarComponent {}
