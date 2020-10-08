import { Directive, ElementRef, InjectionToken } from '@angular/core';

@Directive({
  selector: '[ngneatDragHandle]',
})
export class DragHandleDirective {
  constructor(private elementRef: ElementRef<HTMLElement>) {}

  get element(): HTMLElement {
    return this.elementRef.nativeElement;
  }
}
