import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[ngneatFieldHost]',
})
export class FieldHostDirective {
  constructor(public viewContainerRef: ViewContainerRef) {}
}
