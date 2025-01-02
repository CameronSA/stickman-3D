import { Injectable } from '@angular/core';
import { IKeyboardInteractable } from '../../interfaces/keyboard-interactable';
import { IMouseInteractable } from '../../interfaces/mouse-interactable';

@Injectable({
  providedIn: 'root',
})
export class InteractionService {
  private readonly mouseInteractables: IMouseInteractable[] = [];
  private readonly keyboardInteractables: IKeyboardInteractable[] = [];
  private interactionEnabled: boolean = true;

  constructor() {
    window.addEventListener('mousedown', (event) => this.onMouseDown(event));
    window.addEventListener('mouseup', (event) => this.onMouseUp(event));
    window.addEventListener('mousemove', (event) => this.onMouseMove(event));
    window.addEventListener('keydown', (event) => this.onKeyDown(event));
    window.addEventListener('keyup', (event) => this.onKeyUp(event));
    window.addEventListener('wheel', (event) => this.onWheel(event), {
      passive: false,
    });
  }

  addMouseInteractable(interactable: IMouseInteractable): void {
    this.mouseInteractables.push(interactable);
  }

  addKeyboardInteractable(interactable: IKeyboardInteractable): void {
    this.keyboardInteractables.push(interactable);
  }

  addInteractable<
    TInteractable extends IMouseInteractable & IKeyboardInteractable
  >(interactable: TInteractable): void {
    this.mouseInteractables.push(interactable as IMouseInteractable);
    this.keyboardInteractables.push(interactable as IKeyboardInteractable);
  }

  toggleInteractions(enabled: boolean): void {
    this.interactionEnabled = enabled;
  }

  private onMouseDown(event: MouseEvent): void {
    if (!this.interactionEnabled) {
      return;
    }

    for (let interactable of this.mouseInteractables) {
      interactable.onMouseDown(event);
    }
  }

  private onMouseUp(event: MouseEvent): void {
    if (!this.interactionEnabled) {
      return;
    }

    for (let interactable of this.mouseInteractables) {
      interactable.onMouseUp(event);
    }
  }

  private onMouseMove(event: MouseEvent): void {
    if (!this.interactionEnabled) {
      return;
    }

    for (let interactable of this.mouseInteractables) {
      interactable.onMouseMove(event);
    }
  }

  private onKeyDown(event: KeyboardEvent): void {
    if (!this.interactionEnabled) {
      return;
    }

    for (let interactable of this.keyboardInteractables) {
      interactable.onKeyDown(event);
    }
  }

  private onKeyUp(event: KeyboardEvent): void {
    if (!this.interactionEnabled) {
      return;
    }

    for (let interactable of this.keyboardInteractables) {
      interactable.onKeyUp(event);
    }
  }

  private onWheel(event: WheelEvent): void {
    if (!this.interactionEnabled) {
      return;
    }

    for (let interactable of this.mouseInteractables) {
      interactable.onWheel(event);
    }
  }
}
