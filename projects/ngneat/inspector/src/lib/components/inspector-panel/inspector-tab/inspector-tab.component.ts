import { Component, EventEmitter, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import {
  FunctionOrOutput,
  Property,
  PropertyValueType,
  TabComponent,
  TabOutput,
  TabType,
} from '../../../inspector.model';

@Component({
  selector: 'ngneat-inspector-tab',
  templateUrl: './inspector-tab.component.html',
})
export class InspectorTabComponent implements OnInit, TabComponent {
  members: (Property | FunctionOrOutput)[];
  type: TabType;
  emitter: EventEmitter<TabOutput> = new EventEmitter();
  form = new FormGroup({
    name: new FormControl('', Validators.required),
    value: new FormArray([]),
    valueType: new FormArray([]),
  });
  readonly TabType = TabType;
  constructor() {}

  ngOnInit(): void {
    const { selectedPropertyName, selectedPropertyValueList } = this.getFormData(this.members[0]);
    if (selectedPropertyName && selectedPropertyValueList.length) {
      this.formName.setValue(selectedPropertyName);
      selectedPropertyValueList.forEach((i) => {
        this.formValue.push(new FormControl(i));
        this.formValueType.push(new FormControl(i.constructor.name));
      });
    }

    this.formName.valueChanges.subscribe((name: string) => {
      this.formValue.clear();
      this.formValueType.clear();
      const { selectedPropertyValueList: updatedValueList } = this.getFormData(
        this.members.filter((item) => item.name === name)[0]
      );

      updatedValueList.forEach((i) => {
        this.formValue.push(new FormControl(i));
        this.formValueType.push(new FormControl(i.constructor.name));
      });
    });
  }

  private getFormData(
    member: Property | FunctionOrOutput
  ): { selectedPropertyName: string; selectedPropertyValueList: any[] } {
    const activeMember = member;
    if (activeMember) {
      const selectedPropertyName = activeMember.name;
      const selectedPropertyValueList =
        this.type === TabType.properties
          ? [(activeMember as Property).value]
          : (activeMember as FunctionOrOutput).args
          ? (activeMember as FunctionOrOutput).args
          : [''];
      return { selectedPropertyName, selectedPropertyValueList };
    }
    return { selectedPropertyName: undefined, selectedPropertyValueList: [] };
  }

  get formName(): FormControl {
    return this.form.get('name') as FormControl;
  }
  get formValue(): FormArray {
    return this.form.get('value') as FormArray;
  }
  get formValueType(): FormArray {
    return this.form.get('valueType') as FormArray;
  }

  addArgument(): void {
    this.formValue.push(new FormControl(''));
    this.formValueType.push(new FormControl(PropertyValueType.string));
  }

  removeArgument(index: number): void {
    this.formValue.removeAt(index);
    this.formValueType.removeAt(index);
  }

  callEmitter(): void {
    this.emitter.emit(this.form.value);
  }
}
