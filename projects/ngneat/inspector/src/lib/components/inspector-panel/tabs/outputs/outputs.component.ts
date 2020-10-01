import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AbstractControl, FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { CallFunctionOrOutput, FunctionOrOutput } from '../../../../inspector.model';

@Component({
  selector: 'ngneat-tab-outputs',
  templateUrl: './outputs.component.html',
  styles: [],
})
export class OutputsComponent implements OnInit {
  @Input() type: 'outputs' | 'functions' = 'outputs';
  @Input() outputs: FunctionOrOutput[];
  @Output() emitOutput: EventEmitter<CallFunctionOrOutput> = new EventEmitter();
  outputForm = new FormGroup({
    outputName: new FormControl('', Validators.required),
    outputValue: new FormArray([]),
  });
  faTimes = faTimes;

  constructor() {}

  ngOnInit(): void {
    this.outputName.setValue(this.outputs[0].name);
    this.outputValue.push(new FormControl(''));
  }

  callOutput(): void {
    this.emitOutput.emit({
      args: this.outputValue.value,
      name: this.outputName.value,
    });
  }

  addArgument(): void {
    this.outputValue.push(new FormControl(''));
  }

  removeArgument(index: number): void {
    this.outputValue.removeAt(index);
  }

  get outputName(): AbstractControl {
    return this.outputForm.get('outputName');
  }
  get outputValue(): FormArray {
    return this.outputForm.get('outputValue') as FormArray;
  }
}
