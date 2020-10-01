import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ReactiveFormsModule } from '@angular/forms';

import { InspectorPanelComponent } from './components/inspector-panel/inspector-panel.component';
import { InspectorComponent } from './inspector.component';
import { PropertiesComponent } from './components/inspector-panel/tabs/properties/properties.component';
import { OutputsComponent } from './components/inspector-panel/tabs/outputs/outputs.component';
import { FunctionsComponent } from './components/inspector-panel/tabs/functions/functions.component';

@NgModule({
  declarations: [
    InspectorComponent,
    InspectorPanelComponent,
    PropertiesComponent,
    OutputsComponent,
    FunctionsComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    ReactiveFormsModule,
    FontAwesomeModule,
    DragDropModule,
    TabsModule.forRoot(),
    BsDropdownModule.forRoot(),
  ],
  exports: [InspectorComponent],
})
export class InspectorModule {}
