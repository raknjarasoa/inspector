import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { ReactiveFormsModule } from '@angular/forms';
import { PortalModule } from '@angular/cdk/portal';

import { InspectorPanelComponent } from './components/inspector-panel/inspector-panel.component';
import { InspectorComponent } from './inspector.component';
import { TypeSelectorComponent } from './components/inspector-panel/form-fields/type-selector/type-selector.component';
import { TStringComponent } from './components/inspector-panel/form-fields/types/t-string/t-string.component';
import { TNumberComponent } from './components/inspector-panel/form-fields/types/t-number/t-number.component';
import { TBooleanComponent } from './components/inspector-panel/form-fields/types/t-boolean/t-boolean.component';
import { TObjectComponent } from './components/inspector-panel/form-fields/types/t-object/t-object.component';
import { TArrayComponent } from './components/inspector-panel/form-fields/types/t-array/t-array.component';
import { TNotSupportedComponent } from './components/inspector-panel/form-fields/types/t-not-supported/t-not-supported.component';
import { FieldHostDirective } from './directives/field-host.directive';
import { TabHostDirective } from './directives/tab-host.directive';
import { InspectorTabComponent } from './components/inspector-panel/inspector-tab/inspector-tab.component';

@NgModule({
  declarations: [
    InspectorComponent,
    InspectorPanelComponent,
    TypeSelectorComponent,
    TStringComponent,
    TNumberComponent,
    TBooleanComponent,
    TObjectComponent,
    TArrayComponent,
    TNotSupportedComponent,
    FieldHostDirective,
    TabHostDirective,
    InspectorTabComponent,
  ],
  imports: [BrowserModule, BrowserAnimationsModule, ReactiveFormsModule, DragDropModule, PortalModule],
  exports: [InspectorComponent],
})
export class InspectorModule {}
