import { DOCUMENT } from '@angular/common';
import { AfterContentChecked, AfterViewInit, ContentChild, Directive, ElementRef, Inject, Input } from '@angular/core';
import { fromEvent, Subscription } from 'rxjs';
import { DragHandleDirective } from './drag-handle.directive';

@Directive({
  selector: '[ngneatDragNDrop]',
})
export class DragNDropDirective implements AfterViewInit, AfterContentChecked {
  private readonly DEFAULT_DROP_TARGET_QUERY = 'body';

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
      this.element = this.elementRef.nativeElement as HTMLElement;
      this.handleElement = (this._handle && this._handle.element) || this.element;
      this.startDragOperations();
    }
  }

  ngAfterContentChecked(): void {
    if (this._handle && this.handleElement !== this._handle.element) {
      this.handleElement = this._handle.element;
      this.resetDragOperations();
    } else if (this.handleElement !== this.element) {
      this.handleElement = this.element;
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
    const dropTargetBoundaries = (this._dropTarget as HTMLElement | HTMLBodyElement).getClientRects()[0];
    const elementTargetBoundaries = this.element.getClientRects()[0].toJSON();
    const dragStart = fromEvent<MouseEvent>(this.handleElement, 'mousedown');
    const dragEnd = fromEvent<MouseEvent>(this.handleElement, 'mouseup');
    const drag = fromEvent<MouseEvent>(this.handleElement, 'mousemove');

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
        this.currentX = event.clientX - this.initialX;
        this.currentY = event.clientY - this.initialY;
        this.xOffset = this.currentX;
        this.yOffset = this.currentY;

        elementTargetBoundaries.left += this.currentX;
        elementTargetBoundaries.right -= this.currentX;
        elementTargetBoundaries.top -= this.currentY;
        elementTargetBoundaries.bottom += this.currentY;

        // if (
        //   elementTargetBoundaries.left >= dropTargetBoundaries.left &&
        //   elementTargetBoundaries.right <= dropTargetBoundaries.right &&
        //   elementTargetBoundaries.top >= dropTargetBoundaries.top &&
        //   elementTargetBoundaries.bottom <= dropTargetBoundaries.bottom
        // ) {
        this.element.style.transform = 'translate3d(' + this.currentX + 'px, ' + this.currentY + 'px, 0)';
        // }
      }
    });
  }
}
