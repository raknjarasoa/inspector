import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { Property } from '../../../../inspector.model';

@Component({
  selector: 'ngneat-tab-properties',
  templateUrl: './properties.component.html',
  styles: [],
})
export class PropertiesComponent implements OnInit {
  @Input() properties: Property[];
  @Output() updateProperty: EventEmitter<Property> = new EventEmitter();
  propertyForm = new FormGroup({
    propertyName: new FormControl('', Validators.required),
    propertyValue: new FormControl('', Validators.required),
  });

  constructor() {}

  ngOnInit(): void {
    this.propertyName.setValue(this.properties[0].name);
    this.propertyValue.setValue(this.properties[0].value);

    this.propertyName.valueChanges.subscribe((name: string) => {
      this.propertyValue.setValue(this.properties.filter((item) => item.name === name)[0].value);
    });

    this.propertyValue.valueChanges.subscribe((value: any) => {
      this.properties.filter((item) => item.name === this.propertyName.value)[0].value = value;
    });
  }

  get propertyName(): AbstractControl {
    return this.propertyForm.get('propertyName');
  }
  get propertyValue(): AbstractControl {
    return this.propertyForm.get('propertyValue');
  }

  update(): void {
    this.updateProperty.emit({
      name: this.propertyForm.value.propertyName,
      value: this.propertyForm.value.propertyValue,
    });
  }
}
