import { CdkDrag, CdkDragEnd, CdkDragMove } from '@angular/cdk/drag-drop';
import { ConnectionPositionPair, Overlay, PositionStrategy } from '@angular/cdk/overlay';
import { DomPortal, TemplatePortal } from '@angular/cdk/portal';
import { NgClass } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  TemplateRef,
  ViewChild,
  ViewContainerRef,
  ViewEncapsulation,
} from '@angular/core';
import { fromEvent, fromEventPattern, merge, Observable, Subject, Subscription } from 'rxjs';
import { debounceTime, filter, takeUntil, takeWhile } from 'rxjs/operators';
import { FunctionOrOutput, NG, NgComponent } from './inspector.model';
import { faGripVertical, faTimes } from '@fortawesome/free-solid-svg-icons';
import { getNgComponent } from './shared/helpers';

declare const ng: NG;

@Component({
  selector: 'ngneat-inspector',
  templateUrl: 'inspector.component.html',
  styleUrls: ['inspector.component.scss'],
})
export class InspectorComponent implements OnInit {
  isEnabled = false;
  isHidden = false;
  isExpanded = false;

  private readonly nonFunctionNames = [
    'construcstor',
    'ngOnInit',
    'ngOnChanges',
    'ngDoCheck',
    'ngAfterContentInit',
    'ngAfterContentChecked',
    'ngAfterViewInit',
    'ngAfterViewChecked',
    'ngOnDestroy',
  ];

  private escKeySub$: Subscription;
  private mouseOver$: Subscription;

  activeComponent: NgComponent;

  @ViewChild(CdkDrag) cdkDrag!: CdkDrag;

  faGripVertical = faGripVertical;
  faTimes = faTimes;

  constructor(private host: ElementRef<HTMLElement>) {}

  ngOnInit(): void {}

  private get origin(): HTMLElement {
    return this.host.nativeElement;
  }

  startInspecting(): void {
    console.log('start inspecting');
    this.isEnabled = true;

    let element: HTMLElement;
    let originalOutline: string;

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
        this.highlightElement(element, originalOutline);
      }
    });
  }

  private highlightElement(element: HTMLElement, originalOutline: string): void {
    element.style.outline = '2px solid red';
    const endMouseOut$ = new Subject();
    const endMouseClick$ = new Subject();

    this.listenElementMouseOut(element, endMouseOut$, originalOutline);

    this.listenElementClick(element, endMouseClick$, originalOutline, endMouseOut$);
  }

  private listenElementClick(
    element: HTMLElement,
    endMouseClick$: Subject<unknown>,
    originalOutline: string,
    endMouseOut$: Subject<unknown>
  ): void {
    fromEvent<MouseEvent>(element, 'click')
      .pipe(
        takeUntil(endMouseClick$),
        takeWhile(() => this.isEnabled)
      )
      .subscribe((clickEvent) => {
        clickEvent.stopPropagation();
        clickEvent.stopImmediatePropagation();
        clickEvent.preventDefault();
        element.style.outline = originalOutline;
        endMouseOut$.next();
        endMouseClick$.next();

        // read component
        this.activeComponent = getNgComponent(element);
        this.stopInspecting();
        this.expandInspectorPanel();
      });
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
    console.log('stop inspecting');
    this.isEnabled = false;
  }

  showInspector(): void {
    console.log('show inspector');
    this.isHidden = false;
  }

  hideInspector(): void {
    console.log('hide inspector');
    this.isHidden = true;
  }

  expandInspectorPanel(): void {
    console.log('expand inspector');
    this.isExpanded = true;
  }

  collapseInspectorPanel(): void {
    console.log('collapse inspector');
    this.isExpanded = false;
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
}
