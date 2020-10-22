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
import { jsonValidator } from '../../../shared/json-validator';

@Component({
  selector: 'ngneat-inspector-tab',
  templateUrl: './inspector-tab.component.html',
})
export class InspectorTabComponent implements OnInit, TabComponent {
  members: (Property | FunctionOrOutput)[];
  membersToShow: (Property | FunctionOrOutput)[];
  hideNonSupportedProps: boolean;
  type: TabType;
  emitter: EventEmitter<TabOutput> = new EventEmitter();
  form = new FormGroup({
    name: new FormControl('', Validators.required),
    value: new FormArray([]),
    valueType: new FormArray([]),
  });
  readonly TabType = TabType;
  readonly PropertyValueType = PropertyValueType;
  constructor() {}

  ngOnInit(): void {
    if (this.hideNonSupportedProps) {
      this.membersToShow = this.members.filter(
        (i) =>
          !((i as Property).value && !Object.values(PropertyValueType).includes((i as Property).value.constructor.name))
      );
    } else {
      this.membersToShow = this.members.slice();
    }
    if (this.membersToShow.length) {
      setTimeout(() => {
        const { selectedPropertyName, selectedPropertyValueList } = this.getFormData(this.membersToShow[0]);
        if (selectedPropertyName && selectedPropertyValueList.length) {
          this.formName.setValue(selectedPropertyName);
          this.updateFormData(selectedPropertyValueList);
        }

        this.formName.valueChanges.subscribe((name: string) => {
          const { selectedPropertyValueList: updatedValueList } = this.getFormData(
            this.members.filter((item) => item.name === name)[0]
          );

          this.updateFormData(updatedValueList);
        });
      });
    }
  }

  private updateFormData(updatedValueList: any[]): void {
    this.formValue.clear();
    this.formValueType.clear();
    updatedValueList.forEach((i) => {
      const valueType: PropertyValueType = i.constructor.name;
      this.formValue.push(
        new FormControl(
          valueType === PropertyValueType.array || valueType === PropertyValueType.object
            ? JSON.stringify(i, null, 2)
            : i,
          valueType === PropertyValueType.array || valueType === PropertyValueType.object ? jsonValidator : null
        )
      );
      this.formValueType.push(new FormControl(valueType));
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
