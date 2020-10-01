import { Component, Input, OnInit, ComponentFactoryResolver, ViewChild, SimpleChanges, OnChanges } from '@angular/core';
import { FormControl } from '@angular/forms';
import { FieldHostDirective } from '../../../../directives/field-host.directive';
import { TNotSupportedComponent } from '../types/t-not-supported/t-not-supported.component';
import { TNumberComponent } from '../types/t-number/t-number.component';
import { TStringComponent } from '../types/t-string/t-string.component';

@Component({
  selector: 'ngneat-type-selector',
  templateUrl: './type-selector.component.html',
  styles: [],
})
export class TypeSelectorComponent implements OnInit, OnChanges {
  @Input() fc: FormControl;
  @Input() showTypeSelector = false;
  @Input() selectedType = 'String';
  @Input() className = '';
  @ViewChild(FieldHostDirective, { static: true }) adHost: FieldHostDirective;

  typesToSelect = {
    String: {
      component: TStringComponent,
    },
    Number: {
      component: TNumberComponent,
    },
    NotSupported: {
      component: TNotSupportedComponent,
    },
  };
  typesToSelectIterable = Object.keys(this.typesToSelect);
  typeSelector = new FormControl('String');

  constructor(private componentFactoryResolver: ComponentFactoryResolver) {}

  ngOnInit(): void {
    this.loadComponent();
    this.typeSelector.valueChanges.subscribe((val) => {
      this.selectedType = val;
      this.loadComponent();
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.selectedType && changes.selectedType.previousValue !== changes.selectedType.currentValue) {
      this.loadComponent();
    }
  }

  loadComponent(): void {
    const component =
      this.typesToSelect[this.selectedType] && this.typesToSelect[this.selectedType].component
        ? this.typesToSelect[this.selectedType].component
        : this.typesToSelect.NotSupported.component;

    const componentFactory = this.componentFactoryResolver.resolveComponentFactory<InputComponent>(component);

    const viewContainerRef = this.adHost.viewContainerRef;
    viewContainerRef.clear();

    const componentRef = viewContainerRef.createComponent<InputComponent>(componentFactory);

    componentRef.instance.formControl = this.fc;
    componentRef.instance.addClass('flex-grow-1');
  }
}

export interface InputComponent {
  formControl: FormControl;
  addClass: (className: string) => void;
}
