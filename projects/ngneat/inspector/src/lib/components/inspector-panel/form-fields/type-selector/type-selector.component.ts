import { Component, Input, OnInit, ComponentFactoryResolver, ViewChild, EventEmitter, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { FieldHostDirective } from '../../../../directives/field-host.directive';
import { PropertyValueType } from '../../../../inspector.model';
import { TBooleanComponent } from '../types/t-boolean/t-boolean.component';
import { TNotSupportedComponent } from '../types/t-not-supported/t-not-supported.component';
import { TNumberComponent } from '../types/t-number/t-number.component';
import { TObjectComponent } from '../types/t-object/t-object.component';
import { TStringComponent } from '../types/t-string/t-string.component';

@Component({
  selector: 'ngneat-type-selector',
  templateUrl: './type-selector.component.html',
  styleUrls: ['type-selector.component.scss'],
})
export class TypeSelectorComponent implements OnInit {
  @Input() inputFormControl: FormControl;
  @Input() typeSelectorFormControl: FormControl;
  @Input() showTypeSelector = false;
  @Input() className = '';
  @Input() appendButton: string;
  @Input() inputId: string;
  @Output() appendButtonClick = new EventEmitter();
  @ViewChild(FieldHostDirective, { static: true }) adHost: FieldHostDirective;

  typesToSelect: { [key in PropertyValueType]: { component: any } } = {
    [PropertyValueType.array]: {
      component: TObjectComponent,
    },
    [PropertyValueType.boolean]: {
      component: TBooleanComponent,
    },
    [PropertyValueType['not-supported']]: {
      component: TNotSupportedComponent,
    },
    [PropertyValueType.number]: {
      component: TNumberComponent,
    },
    [PropertyValueType.object]: {
      component: TObjectComponent,
    },
    [PropertyValueType.string]: {
      component: TStringComponent,
    },
  };
  typesToSelectIterable = Object.keys(this.typesToSelect).filter((i) => i !== PropertyValueType['not-supported']);

  constructor(private componentFactoryResolver: ComponentFactoryResolver) {}

  ngOnInit(): void {
    this.loadComponent(this.typeSelectorFormControl.value);
    this.typeSelectorFormControl.valueChanges.subscribe((val) => this.loadComponent(val));
  }

  loadComponent(fieldType: PropertyValueType): void {
    if (fieldType) {
      const component =
        this.typesToSelect[fieldType] && this.typesToSelect[fieldType].component
          ? this.typesToSelect[fieldType].component
          : this.typesToSelect['Not Supported'].component;

      const componentFactory = this.componentFactoryResolver.resolveComponentFactory<InputComponent>(component);

      const viewContainerRef = this.adHost.viewContainerRef;
      viewContainerRef.clear();

      const componentRef = viewContainerRef.createComponent<InputComponent>(componentFactory);

      componentRef.instance.formControl = this.inputFormControl;
      componentRef.instance.inputId = this.inputId;
      componentRef.instance.addClass('ngneat-field-host');
      componentRef.instance.type = fieldType;
    }
  }
}

export interface InputComponent {
  inputId: string;
  formControl: FormControl;
  addClass: (className: string) => void;
  type?: string;
}
