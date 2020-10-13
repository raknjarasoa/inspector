import { DOCUMENT } from '@angular/common';
import { AfterContentChecked, AfterViewInit, ContentChild, Directive, ElementRef, Inject, Input } from '@angular/core';
import { fromEvent, Subscription } from 'rxjs';
import { DragHandleDirective } from './drag-handle.directive';

@Directive({
  selector: '[ngneatDragNDrop]',
})
export class DragNDropDirective implements AfterViewInit, AfterContentChecked {
  private readonly DEFAULT_DROP_TARGET_QUERY = 'body';
  private readonly SPACE_MARGIN = 10; // this is same as $host-spacing at projects\ngneat\inspector\src\styles\_variables.scss

  private _dropTarget: any;
  private _startEvents = false;
  private _dragDisabled = false;

  private currentX: number;
  private currentY: number;
  private initialX: number;
  private initialY: number;
  private xOffset = 0;
  private yOffset = 0;

  dragStart$: Subscription;
  dragEnd$: Subscription;
  drag$: Subscription;
  handleElement: HTMLElement;
  element: HTMLElement;
  prevHandleElement: HTMLElement;
  dropTargetBoundaries: DOMRect;

  @Input()
  set ngneatDragDisabled(disabled: boolean) {
    this._dragDisabled = disabled;
  }
  @Input() ngneatDropTarget = this.DEFAULT_DROP_TARGET_QUERY;

  @ContentChild(DragHandleDirective) _handle: DragHandleDirective;

  constructor(public elementRef: ElementRef, @Inject(DOCUMENT) private document: any) {}

  ngAfterViewInit(): void {
    this._dropTarget = (this.document as Document).querySelector(this.ngneatDropTarget);
    if (!this._dropTarget) {
      throw new Error("Couldn't find any element with query: " + this.ngneatDropTarget);
    } else {
      this.dropTargetBoundaries = (this._dropTarget as HTMLElement | HTMLBodyElement).getClientRects()[0];
      this.element = this.elementRef.nativeElement as HTMLElement;
      this.handleElement = (this._handle && this._handle.element) || this.element;
      this.prevHandleElement = this.handleElement;
      this.startDragOperations();
    }
  }

  ngAfterContentChecked(): void {
    if (this._handle && this.prevHandleElement !== this._handle.element) {
      this.handleElement = this._handle.element;
      this.prevHandleElement = this.handleElement;
      this.resetDragOperations();
    } else if (!this._handle && this.prevHandleElement !== this.element) {
      this.handleElement = this.element;
      this.prevHandleElement = this.handleElement;
      this.resetDragOperations();
    }
  }

  private resetDragOperations(): void {
    this.dragStart$.unsubscribe();
    this.dragEnd$.unsubscribe();
    this.drag$.unsubscribe();
    this.startDragOperations();
  }

  private startDragOperations(): void {
    const dragStart = fromEvent<MouseEvent>(this.handleElement, 'mousedown');
    const dragEnd = fromEvent<MouseEvent>(this.document, 'mouseup');
    const drag = fromEvent<MouseEvent>(this.document, 'mousemove');

    this.dragStart$ = dragStart.subscribe((event: MouseEvent) => {
      this.initialX = event.clientX - this.xOffset;
      this.initialY = event.clientY - this.yOffset;
      this._startEvents = true;
      this.element.classList.add('ngneat-drag-dragging');
    });

    this.dragEnd$ = dragEnd.subscribe((event: MouseEvent) => {
      this.initialX = this.currentX;
      this.initialY = this.currentY;
      this._startEvents = false;
      this.element.classList.remove('ngneat-drag-dragging');
    });

    this.drag$ = drag.subscribe((event: MouseEvent) => {
      if (this._startEvents && !this._dragDisabled) {
        event.preventDefault();
        this.updatePosition(event.clientX - this.initialX, event.clientY - this.initialY);
      }
    });
  }

  private updatePosition(x: number, y: number): void {
    if (
      x <= this.dropTargetBoundaries.left &&
      this.element.offsetWidth - x <= this.dropTargetBoundaries.right &&
      y >= this.dropTargetBoundaries.top &&
      y + this.element.offsetHeight <= this.dropTargetBoundaries.bottom
    ) {
      this.currentX = x;
      this.currentY = y;
      this.xOffset = this.currentX;
      this.yOffset = this.currentY;
      this.element.style.transform = 'translate3d(' + this.currentX + 'px, ' + this.currentY + 'px, 0)';
    }
  }

  resetPosition(): void {
    this.element.style.transition = 'transform 0.2s ease-in-out';
    this.currentX = 0;
    this.currentY = 0;
    this.xOffset = this.currentX;
    this.yOffset = this.currentY;
    this.element.style.transform = 'translate3d(' + this.currentX + 'px, ' + this.currentY + 'px, 0)';
    setTimeout(() => {
      this.element.style.transition = 'none';
    }, 201);
  }
}
