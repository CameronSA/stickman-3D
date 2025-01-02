import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Renderer2 } from '@angular/core';
import { InteractionService } from '../../services/interaction/interaction.service';
import { CreatorComponent } from '../creator/creator.component';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, CreatorComponent],
  templateUrl: `./sidebar.component.html`,
  styleUrl: './sidebar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidebarComponent {
  public showCreator: boolean = false;

  mousemoveEvent: any;
  mouseupEvent: any;
  movedElement: any;

  curX: number = 0;
  curY: number = 0;
  offsetX: number = 0;
  offsetY: number = 0;
  xStartElementPoint: number = 0;
  yStartElementPoint: number = 0;
  xStartMousePoint: number = 0;
  yStartMousePoint: number = 0;

  constructor(
    private readonly renderer: Renderer2,
    private readonly interactionService: InteractionService
  ) {}

  onCreateClick() {
    this.showCreator = true;
  }

  mousedown(event: MouseEvent) {
    this.interactionService.toggleInteractions(false);
    this.movedElement = this.renderer.selectRootElement(event.target, true);
    this.setInitialAbsolutePos(this.movedElement);
    this.xStartElementPoint = this.curX;
    this.yStartElementPoint = this.curY;
    this.xStartMousePoint = event.pageX;
    this.yStartMousePoint = event.pageY;
    this.mousemoveEvent = this.renderer.listen(
      'document',
      'mousemove',
      this.dragging.bind(this)
    );
    this.mouseupEvent = this.renderer.listen(
      'document',
      'mouseup',
      this.mouseup.bind(this)
    );

    return false; // Call preventDefault() on the event
  }

  private dragging(event: any) {
    this.curX =
      this.xStartElementPoint +
      (event.pageX - this.xStartMousePoint + this.offsetX);
    this.curY =
      this.yStartElementPoint +
      (event.pageY - this.yStartMousePoint + this.offsetY);
    this.moveElement(this.movedElement, this.curX, this.curY);

    return false; // Call preventDefault() on the event
  }

  private mouseup(event: any) {
    this.interactionService.toggleInteractions(true);
    // Remove listeners
    this.mousemoveEvent();
    this.mouseupEvent();

    return false; // Call preventDefault() on the event
  }

  private moveElement(element: HTMLElement, curX: number, curY: number) {
    // update the position of the div:
    this.renderer.setStyle(element, 'left', curX + 'px');
    this.renderer.setStyle(element, 'top', curY + 'px');
    this.renderer.setStyle(element, 'right', 'initial'); // required in case the element was previously right-aligned...
    this.renderer.setStyle(element, 'bottom', 'initial'); // required in case the element was previously bottom-aligned...
  }

  private setInitialAbsolutePos(element: any) {
    this.curX = element.getBoundingClientRect().left;
    this.curY = element.getBoundingClientRect().top;

    // set position:absolute (if not already done)
    this.renderer.setStyle(element, 'position', 'absolute');

    // compensate for the new position:absolute
    // and/or padding / margin / borders (if present)
    // by making a move of 0 pixels and then compute the offset:
    this.moveElement(element, this.curX, this.curY);
    const afterX = element.getBoundingClientRect().left;
    const afterY = element.getBoundingClientRect().top;
    this.offsetX = this.curX - afterX;
    this.offsetY = this.curY - afterY;
    if (this.offsetX != 0 || this.offsetY != 0) {
      this.moveElement(
        element,
        this.curX + this.offsetX,
        this.curY + this.offsetY
      );
    }
  }
}
