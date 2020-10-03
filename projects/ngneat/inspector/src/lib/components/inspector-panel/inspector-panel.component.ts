import { Component, Input, OnInit } from '@angular/core';
import { updateComponent } from '../../shared/helpers';
import { CallFunctionOrOutput, NgComponent, Property } from '../../inspector.model';

@Component({
  selector: 'ngneat-inspector-panel',
  templateUrl: './inspector-panel.component.html',
  styleUrls: ['./inspector-panel.component.scss'],
})
export class InspectorPanelComponent implements OnInit {
  @Input() ngComponent: NgComponent;

  constructor() {}

  ngOnInit(): void {
    console.log('ngComponent', this.ngComponent);
  }

  updateProperty(property: Property): void {
    updateComponent(this.ngComponent, property);
  }

  callOutput(output: CallFunctionOrOutput): void {
    this.ngComponent.rawComponent[output.name].emit(...output.args);
  }
  callFunction(functionToCall: CallFunctionOrOutput): void {
    this.ngComponent.rawComponent.constructor.prototype[functionToCall.name](...functionToCall.args);
  }
}
