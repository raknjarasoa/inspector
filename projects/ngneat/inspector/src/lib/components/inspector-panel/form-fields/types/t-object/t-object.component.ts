import { Component, ElementRef, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { InputComponent } from '../../type-selector/type-selector.component';
import { CodeModel } from '@ngstack/code-editor';
import { editor } from 'monaco-editor';

@Component({
  selector: 'ngneat-t-array',
  templateUrl: './t-object.component.html',
  styles: [],
})
export class TObjectComponent implements OnInit, InputComponent {
  @Input() formControl: FormControl;
  @Input() inputId: string;
  @Input() fieldType: string;
  codeModel: CodeModel = { language: 'json', uri: '', value: '{}' };
  editorOptions: editor.IEditorOptions = {};
  show = false;
  constructor(private elementRef: ElementRef) {}

  ngOnInit(): void {
    this.codeModel.value = this.formControl.value;
    this.codeModel.uri = 'main' + this.inputId + '.json';

    // a tick's delay is needed to properly render editor
    setTimeout(() => {
      this.show = true;
    });
  }

  addClass(className: string): void {
    this.elementRef.nativeElement.classList.add(className);
  }

  setValue(text: string): void {
    this.formControl.setValue(text);
  }
}
