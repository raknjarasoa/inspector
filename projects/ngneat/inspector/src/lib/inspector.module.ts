import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { TabsModule } from 'ngx-bootstrap/tabs';

import { InspectorPanelComponent } from './components/inspector-panel/inspector-panel.component';
import { InspectorComponent } from './inspector.component';

@NgModule({
  declarations: [InspectorComponent, InspectorPanelComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FontAwesomeModule,
    DragDropModule,
    TabsModule.forRoot(),
  ],
  exports: [InspectorComponent],
})
export class InspectorModule {}
