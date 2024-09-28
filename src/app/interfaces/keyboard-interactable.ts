import { IInteractable } from './interactable';

export interface IKeyboardInteractable extends IInteractable {
  onKeyDown(event: KeyboardEvent): void;
  onKeyUp(event: KeyboardEvent): void;
}
