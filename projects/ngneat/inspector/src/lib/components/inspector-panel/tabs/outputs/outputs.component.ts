import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { CallFunctionOrOutput, FunctionOrOutput } from '../../../../inspector.model';

@Component({
  selector: 'ngneat-tab-outputs',
  templateUrl: './outputs.component.html',
  styles: [],
})
export class OutputsComponent implements OnInit {
  @Input() outputs: FunctionOrOutput[];
  @Output() emitOutput: EventEmitter<CallFunctionOrOutput> = new EventEmitter();
  outputForm = new FormGroup({
    outputName: new FormControl('', Validators.required),
    outputValue: new FormControl('', Validators.required),
  });

  constructor() {}

  ngOnInit(): void {
    this.outputName.setValue(this.outputs[0].name);
  }

  callOutput(): void {
    console.log('outputForm', this.outputForm.value);
    this.emitOutput.emit({
      arguments: [this.outputValue.value],
      name: this.outputName.value,
    });
  }

  get outputName(): AbstractControl {
    return this.outputForm.get('outputName');
  }
  get outputValue(): AbstractControl {
    return this.outputForm.get('outputValue');
  }
}
