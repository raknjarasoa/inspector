import { Component, ElementRef, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { InputComponent } from '../../type-selector/type-selector.component';

@Component({
  selector: 'ngneat-t-array',
  templateUrl: './t-array.component.html',
  styles: [],
})
export class TArrayComponent implements OnInit, InputComponent {
  @Input() formControl: FormControl;
  @Input() inputId: string;
  constructor(private elementRef: ElementRef) {}

  ngOnInit(): void {}

  addClass(className: string): void {
    this.elementRef.nativeElement.classList.add(className);
  }
}
