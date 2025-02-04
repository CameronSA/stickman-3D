import { Intersection } from 'three';
import { IInteractable } from './interactable';

export interface IMouseInteractable extends IInteractable {
  onMouseDown(event: MouseEvent, intersection: Intersection | undefined): void;
  onMouseUp(event: MouseEvent, intersection: Intersection | undefined): void;
  onMouseMove(event: MouseEvent, intersection: Intersection | undefined): void;
  onWheel(event: WheelEvent, intersection: Intersection | undefined): void;
}
