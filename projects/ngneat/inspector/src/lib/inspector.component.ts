import { Component, ElementRef, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { fromEvent, Observable, Subject, Subscription } from 'rxjs';
import { filter, takeUntil, takeWhile } from 'rxjs/operators';
import { DragNDropDirective } from './directives/drag-n-drop.directive';
import { NgComponent } from './inspector.model';
import { getNgComponent } from './shared/helpers';

@Component({
  selector: 'ngneat-inspector',
  templateUrl: 'inspector.component.html',
  styleUrls: ['../styles/main.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class InspectorComponent implements OnInit {
  isEnabled = false;
  isHidden = false;
  isExpanded = false;
  isErrored = false;

  private escKeySub$: Subscription;
  private mouseOver$: Subscription;
  private mouseClick$: Subscription;

  activeComponent: NgComponent;

  @ViewChild(DragNDropDirective) ngneatDrag: DragNDropDirective;

  constructor(private host: ElementRef<HTMLElement>) {}

  ngOnInit(): void {}

  private get origin(): HTMLElement {
    return this.host.nativeElement;
  }

  startInspecting(): void {
    this.isEnabled = true;

    let element: HTMLElement;
    let originalOutline: string;
    const endMouseClick$ = new Subject();
    const endMouseOut$ = new Subject();

    this.escKeySub$ = this.escapeKeyDown(document).subscribe(() => {
      if (element) {
        element.style.outline = originalOutline;
      }
      this.stopInspecting();
    });

    this.mouseOver$ = this.documentMouseOver(this.origin).subscribe((ev: MouseEvent) => {
      if (ev.target instanceof HTMLElement) {
        element = ev.target as HTMLElement;
        originalOutline = element.style.outline;
        this.highlightElement(element, originalOutline, endMouseOut$);
      }
    });

    this.mouseClick$ = this.documentMouseClick(this.origin)
      .pipe(takeUntil(endMouseClick$))
      .subscribe((ev: MouseEvent) => {
        if (ev.target instanceof HTMLElement && ev.target === element) {
          ev.preventDefault();
          ev.stopImmediatePropagation();
          ev.stopPropagation();
          element.style.outline = originalOutline;
          endMouseClick$.next();
          endMouseOut$.next();

          // read component
          try {
            this.activeComponent = getNgComponent(element);
          } catch (e) {
            this.isErrored = true;
          }
          this.stopInspecting();
          this.expandInspectorPanel();
        }
      });
  }

  private highlightElement(element: HTMLElement, originalOutline: string, endMouseOut$: Subject<any>): void {
    element.style.outline = '2px solid red';

    this.listenElementMouseOut(element, endMouseOut$, originalOutline);
  }

  private listenElementMouseOut(element: HTMLElement, endMouseOut$: Subject<unknown>, originalOutline: string): void {
    fromEvent(element, 'mouseout')
      .pipe(
        takeUntil(endMouseOut$),
        takeWhile(() => this.isEnabled)
      )
      .subscribe(() => {
        element.style.outline = originalOutline;
        endMouseOut$.next();
      });
  }

  stopInspecting(): void {
    this.isEnabled = false;
  }

  showInspector(): void {
    this.isHidden = false;
  }

  hideInspector(): void {
    this.isHidden = true;
  }

  expandInspectorPanel(): void {
    this.isExpanded = true;
  }

  collapseInspectorPanel(): void {
    this.isExpanded = false;
    this.ngneatDrag.resetPosition();
  }

  escapeKeyDown(target: HTMLElement | Document): Observable<KeyboardEvent> {
    return fromEvent<KeyboardEvent>(target, 'keydown').pipe(
      filter((ev: KeyboardEvent) => {
        return ev.key === 'Escape';
      }),
      takeWhile(() => this.isEnabled)
    );
  }

  documentMouseOver(origin: HTMLElement): Observable<MouseEvent> {
    return fromEvent<MouseEvent>(document, 'mouseover').pipe(
      filter((ev: MouseEvent) => {
        const overTarget = ev.target as HTMLElement;
        const notBody = overTarget.tagName.toUpperCase() !== 'BODY';
        const notOrigin = overTarget !== origin; // the inspector
        return notOrigin && notBody;
      }),
      takeWhile(() => this.isEnabled)
    );
  }

  documentMouseClick(origin: HTMLElement): Observable<MouseEvent> {
    return fromEvent<MouseEvent>(document, 'click', { capture: true }).pipe(
      filter((ev: MouseEvent) => {
        const overTarget = ev.target as HTMLElement;
        const notBody = overTarget.tagName.toUpperCase() !== 'BODY';
        const notOrigin = overTarget !== origin; // the inspector
        return notOrigin && notBody;
      }),
      takeWhile(() => this.isEnabled)
    );
  }
}
