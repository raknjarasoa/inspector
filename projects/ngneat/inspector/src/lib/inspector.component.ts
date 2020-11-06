import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { fromEvent, Observable, Subscription } from 'rxjs';
import { filter, takeWhile } from 'rxjs/operators';
import tinykeys from 'tinykeys';
import { DragNDropDirective } from './directives/drag-n-drop.directive';
import { InspectorConfigOutline, InspectorConfigPosition, NgComponent } from './inspector.model';
import { getNgComponent } from './shared/helpers';

@Component({
  selector: 'ngneat-inspector',
  templateUrl: 'inspector.component.html',
  styleUrls: ['../styles/main.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class InspectorComponent implements OnInit, AfterViewInit, OnDestroy {
  isEnabled = false;
  isHidden = false;
  isExpanded = false;
  isErrored = false;

  // inspector config
  zIndex: number;
  outline: InspectorConfigOutline;
  position: InspectorConfigPosition = {};
  keyCombo: string;
  closeOnEsc: boolean;
  enableKeyCombo: boolean;
  hideNonSupportedProps: boolean;
  filterProps: RegExp;

  activeElement: HTMLElement;
  activeElementOriginalOutline: string;

  private escKeySub: Subscription;
  private mouseOverSub: Subscription;
  private mouseClickSub: Subscription;
  private mouseOutSub: Subscription;

  activeComponent: NgComponent;

  @ViewChild(DragNDropDirective) ngneatDrag: DragNDropDirective;
  @ViewChild('inspectorHost') inspectorHost: ElementRef<HTMLElement>;

  error: any;

  constructor(private host: ElementRef<HTMLElement>) {}

  ngOnInit(): void {
    if (this.enableKeyCombo) {
      this.listenForKeyboardShortcut();
    }
  }

  ngAfterViewInit(): void {
    this.inspectorHost.nativeElement.style.zIndex = this.zIndex.toString();
    Object.keys(this.position).forEach((p) => {
      this.inspectorHost.nativeElement.style[p] = this.position[p];
    });
  }

  private get origin(): HTMLElement {
    return this.host.nativeElement;
  }

  startInspecting(): void {
    this.isEnabled = true;

    this.escKeySub = this.escapeKeyDown(document).subscribe(() => {
      this.closeInspector();
    });

    this.mouseOverSub = this.documentMouseOver(this.origin).subscribe((ev: MouseEvent) => {
      if (ev.target instanceof HTMLElement) {
        this.activeElement = ev.target as HTMLElement;
        this.activeElementOriginalOutline = this.activeElement.style.outline;
        this.highlightElement();
      }
    });

    this.mouseClickSub = this.documentMouseClick(this.origin).subscribe((ev: MouseEvent) => {
      if (ev.target instanceof HTMLElement && ev.target === this.activeElement) {
        ev.preventDefault();
        ev.stopImmediatePropagation();
        ev.stopPropagation();
        this.activeElement.style.outline = this.activeElementOriginalOutline;

        // read component
        try {
          this.activeComponent = getNgComponent(this.activeElement, this.hideNonSupportedProps, this.filterProps);
          this.error = null;
          this.isErrored = false;
        } catch (e) {
          console.error('Path: projects/ngneat/inspector/src/lib/inspector.component.ts\nError: ', e);
          this.isErrored = true;
        }
        this.stopInspecting();
        this.expandInspectorPanel();
      }
    });
  }

  closeInspector(): void {
    if (this.isEnabled) {
      if (this.activeElement && this.activeElementOriginalOutline !== undefined) {
        this.activeElement.style.outline = this.activeElementOriginalOutline;
      }
      this.stopInspecting();
    }
    this.reset();
  }

  private reset(): void {
    this.mouseOverSub.unsubscribe();
    this.mouseOutSub.unsubscribe();
    this.mouseClickSub.unsubscribe();
    this.escKeySub.unsubscribe();
    this.isExpanded = false;
    this.ngneatDrag.resetPosition();
    this.activeComponent = null;
    this.activeElement = null;
    this.activeElementOriginalOutline = undefined;
  }

  private highlightElement(): void {
    this.activeElement.style.outline = `${this.outline.width} ${this.outline.style} ${this.outline.color}`;

    this.mouseOutSub = this.listenElementMouseOut();
  }

  private listenElementMouseOut(): Subscription {
    return fromEvent(this.activeElement, 'mouseout', { once: true })
      .pipe(takeWhile(() => this.isEnabled))
      .subscribe(() => {
        this.activeElement.style.outline = this.activeElementOriginalOutline;
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

  escapeKeyDown(target: HTMLElement | Document): Observable<KeyboardEvent> {
    return fromEvent<KeyboardEvent>(target, 'keydown').pipe(
      filter((ev: KeyboardEvent) => {
        return ev.key === 'Escape';
      }),
      takeWhile(() => this.closeOnEsc)
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
    return fromEvent<MouseEvent>(document, 'click', { capture: true, once: true }).pipe(
      filter((ev: MouseEvent) => {
        const overTarget = ev.target as HTMLElement;
        const notBody = overTarget.tagName.toUpperCase() !== 'BODY';
        const notOrigin = overTarget !== origin; // the inspector
        return notOrigin && notBody;
      }),
      takeWhile(() => this.isEnabled)
    );
  }

  listenForKeyboardShortcut(): void {
    tinykeys(window, {
      [this.keyCombo]: () => {
        if (!this.isEnabled && !this.activeComponent) {
          this.startInspecting();
        }
        // else if (this.isExpanded) {
        //   this.closeInspector();
        //   this.startInspecting();
        // } else {
        //   this.closeInspector();
        // }
      },
    });
  }

  ngOnDestroy(): void {
    this.mouseOutSub.unsubscribe();
    this.escKeySub.unsubscribe();
    this.mouseOverSub.unsubscribe();
    this.mouseClickSub.unsubscribe();
  }
}
