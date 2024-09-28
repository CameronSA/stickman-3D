import { IInteractable } from './interactable';

export interface IMouseInteractable extends IInteractable {
  onMouseDown(event: MouseEvent): void;
  onMouseUp(event: MouseEvent): void;
  onMouseMove(event: MouseEvent): void;
  onWheel(event: WheelEvent): void;
}
