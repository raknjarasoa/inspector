import { Component, ComponentFactoryResolver, Input, OnInit, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';

import { updateComponent } from '../../shared/helpers';
import {
  CallFunctionOrOutput,
  NgComponent,
  Property,
  PropertyValueType,
  TabOutput,
  TabType,
} from '../../inspector.model';
import { TabHostDirective } from '../../directives/tab-host.directive';
import { InspectorTabComponent } from './inspector-tab/inspector-tab.component';

@Component({
  selector: 'ngneat-inspector-panel',
  templateUrl: './inspector-panel.component.html',
})
export class InspectorPanelComponent implements OnInit {
  @Input() ngComponent: NgComponent;

  activeTab: TabType;
  allTabs: { value: TabType; label: string }[] = [
    { value: TabType.properties, label: 'Properties' },
    { value: TabType.outputs, label: 'Outputs' },
    { value: TabType.functions, label: 'Functions' },
  ];
  tabsToShow: { value: TabType; label: string }[] = [];
  @ViewChild(TabHostDirective, { static: true }) tabHost: TabHostDirective;
  tabEmitter$: Subscription;

  constructor(private componentFactoryResolver: ComponentFactoryResolver) {}

  ngOnInit(): void {
    // console.log('ngComponent', this.ngComponent);
    this.tabsToShow = this.allTabs.filter((tab) => {
      return this.ngComponent[tab.value].length;
    });
    if (this.tabsToShow.length) {
      this.activeTab = this.tabsToShow[0].value;
      this.loadTab(this.activeTab);
    }
  }

  loadTab(tab: TabType): void {
    if (this.tabEmitter$) {
      this.tabEmitter$.unsubscribe();
    }

    this.activeTab = tab;

    const componentFactory = this.componentFactoryResolver.resolveComponentFactory<InspectorTabComponent>(
      InspectorTabComponent
    );

    const viewContainerRef = this.tabHost.viewContainerRef;
    viewContainerRef.clear();

    const componentRef = viewContainerRef.createComponent<InspectorTabComponent>(componentFactory);

    componentRef.instance.type = this.activeTab;
    componentRef.instance.members = this.ngComponent[this.activeTab];
    const tabEmitter = componentRef.instance.emitter;
    this.tabEmitter$ = tabEmitter.subscribe((val: TabOutput) => {
      if (this.activeTab === TabType.properties) {
        const property: Property = {
          name: val.name,
          value: this.getProcessedPropertyValue(val),
        };
        this.updateProperty(property);
      } else if (this.activeTab === TabType.outputs) {
        const callOutput: CallFunctionOrOutput = { name: val.name, args: this.getProcessedOutputValue(val) };
        this.callOutput(callOutput);
      } else if (this.activeTab === TabType.functions) {
        const callFunction: CallFunctionOrOutput = { name: val.name, args: this.getProcessedOutputValue(val) };
        this.callFunction(callFunction);
      }
    });
  }

  updateProperty(property: Property): void {
    updateComponent(this.ngComponent, property);
    this.ngComponent[TabType.properties].find((p) => p.name === property.name).value = property.value;
  }

  callOutput(output: CallFunctionOrOutput): void {
    this.ngComponent.rawComponent[output.name].emit(...output.args);
    this.ngComponent[TabType.outputs].find((o) => o.name === output.name).args = output.args.slice();
  }
  callFunction(functionToCall: CallFunctionOrOutput): void {
    this.ngComponent.rawComponent.constructor.prototype[functionToCall.name](...functionToCall.args);
    this.ngComponent[TabType.functions].find((o) => o.name === functionToCall.name).args = functionToCall.args.slice();
  }
  getProcessedPropertyValue(val: TabOutput): any {
    return val.valueType[0] === PropertyValueType.array || val.valueType[0] === PropertyValueType.object
      ? JSON.parse(val.value[0])
      : val.value[0];
  }
  getProcessedOutputValue(val: TabOutput): any {
    return val.value.map((v, i) =>
      val.valueType[i] === PropertyValueType.array || val.valueType[i] === PropertyValueType.object ? JSON.parse(v) : v
    );
  }
}
