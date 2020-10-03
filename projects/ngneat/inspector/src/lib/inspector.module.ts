import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ReactiveFormsModule } from '@angular/forms';
import { PortalModule } from '@angular/cdk/portal';

import { InspectorPanelComponent } from './components/inspector-panel/inspector-panel.component';
import { InspectorComponent } from './inspector.component';
import { PropertiesComponent } from './components/inspector-panel/tabs/properties/properties.component';
import { OutputsComponent } from './components/inspector-panel/tabs/outputs/outputs.component';
import { TypeSelectorComponent } from './components/inspector-panel/form-fields/type-selector/type-selector.component';
import { TStringComponent } from './components/inspector-panel/form-fields/types/t-string/t-string.component';
import { TNumberComponent } from './components/inspector-panel/form-fields/types/t-number/t-number.component';
import { TBooleanComponent } from './components/inspector-panel/form-fields/types/t-boolean/t-boolean.component';
import { TObjectComponent } from './components/inspector-panel/form-fields/types/t-object/t-object.component';
import { TArrayComponent } from './components/inspector-panel/form-fields/types/t-array/t-array.component';
import { TNotSupportedComponent } from './components/inspector-panel/form-fields/types/t-not-supported/t-not-supported.component';
import { FieldHostDirective } from './directives/field-host.directive';

@NgModule({
  declarations: [
    InspectorComponent,
    InspectorPanelComponent,
    PropertiesComponent,
    OutputsComponent,
    TypeSelectorComponent,
    TStringComponent,
    TNumberComponent,
    TBooleanComponent,
    TObjectComponent,
    TArrayComponent,
    TNotSupportedComponent,
    FieldHostDirective,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    FontAwesomeModule,
    DragDropModule,
    TabsModule,
    BsDropdownModule,
    PortalModule,
  ],
  exports: [InspectorComponent],
})
export class InspectorModule {}
