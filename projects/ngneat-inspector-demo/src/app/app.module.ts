import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { InspectorModule } from '@ngneat/inspector';

import { AppComponent } from './app.component';
import { ChildComponent } from './child/child.component';

@NgModule({
  declarations: [AppComponent, ChildComponent],
  imports: [BrowserModule, InspectorModule, BrowserAnimationsModule, TabsModule.forRoot()],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
