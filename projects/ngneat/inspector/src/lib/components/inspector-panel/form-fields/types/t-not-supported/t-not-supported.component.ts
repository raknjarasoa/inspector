import { Component, ElementRef, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { InputComponent } from '../../type-selector/type-selector.component';

@Component({
  selector: 'ngneat-t-not-supported',
  templateUrl: './t-not-supported.component.html',
  styles: [],
})
export class TNotSupportedComponent implements OnInit, InputComponent {
  @Input() formControl: FormControl;
  @Input() inputId: string;
  @Input() fieldType: string;
  constructor(private elementRef: ElementRef) {}

  ngOnInit(): void {}

  addClass(className: string): void {
    this.elementRef.nativeElement.classList.add(className);
  }
}
