import { Component, ElementRef, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { InputComponent } from '../../type-selector/type-selector.component';
import Prism from 'prismjs';

@Component({
  selector: 'ngneat-t-array',
  templateUrl: './t-object.component.html',
  styles: [],
})
export class TObjectComponent implements OnInit, InputComponent {
  @Input() formControl: FormControl;
  @Input() inputId: string;
  codeHtml = '';
  constructor(private elementRef: ElementRef) {}

  ngOnInit(): void {
    this.codeHtml = Prism.highlight(this.formControl.value, Prism.languages.javascript, 'javascript');
  }

  addClass(className: string): void {
    this.elementRef.nativeElement.classList.add(className);
  }

  setValue(text: string): void {
    // we need to replace all white space characters between html tags
    // generated due to prism.js/
    // thanks to https://stackoverflow.com/a/48632166
    const jsonString = text.replace(/("[^"]*")|([ \s]+)/g, (x) => {
      return x.charCodeAt(0) === 34 ? x : '';
    });

    this.formControl.setValue(jsonString);
    Prism.highlightAll();
  }
}
