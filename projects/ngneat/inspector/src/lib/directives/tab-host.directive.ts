import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[ngneatTabHost]',
})
export class TabHostDirective {
  constructor(public viewContainerRef: ViewContainerRef) {}
}
