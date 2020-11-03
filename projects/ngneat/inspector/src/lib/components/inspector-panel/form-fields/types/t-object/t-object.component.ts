import { AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { InputComponent } from '../../type-selector/type-selector.component';
import * as ace from 'ace-builds';

@Component({
  selector: 'ngneat-t-array',
  templateUrl: './t-object.component.html',
  styles: [],
})
export class TObjectComponent implements OnInit, InputComponent, AfterViewInit {
  @Input() formControl: FormControl;
  @Input() inputId: string;
  @Input() fieldType: string;
  @ViewChild('editor') editor: ElementRef<HTMLElement>;
  constructor(private elementRef: ElementRef) {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    const editorElement = this.editor.nativeElement;
    const aceEditor = ace.edit(editorElement);
    aceEditor.setTheme('ace/theme/tomorrow');
    aceEditor.session.setMode('ace/mode/javascript');
    aceEditor.setOption('hScrollBarAlwaysVisible', true);
    aceEditor.setOption('vScrollBarAlwaysVisible', true);
    aceEditor.session.setValue(this.formControl.value);
    aceEditor.on('change', () => {
      this.formControl.setValue(aceEditor.getValue());
    });
  }

  addClass(className: string): void {
    this.elementRef.nativeElement.classList.add(className);
  }

  setValue(text: string): void {
    this.formControl.setValue(text);
  }
}
