import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Output,
} from '@angular/core';

@Component({
  selector: 'app-creator',
  standalone: true,
  imports: [CommonModule],
  templateUrl: `./creator.component.html`,
  styleUrl: './creator.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreatorComponent {
  @Output() closed = new EventEmitter();

  onCloseClick() {
    this.closed.emit();
  }
}
