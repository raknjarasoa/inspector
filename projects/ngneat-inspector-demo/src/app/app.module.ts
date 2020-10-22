import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { InspectorModule } from '@ngneat/inspector';
import { CodeEditorModule } from '@ngstack/code-editor';

import { AppComponent } from './app.component';
import { ChildComponent } from './child/child.component';
import { environment } from '../environments/environment';

@NgModule({
  declarations: [AppComponent, ChildComponent],
  imports: [
    BrowserModule,
    environment.production ? [] : InspectorModule.forRoot(),
    BrowserAnimationsModule,
    CodeEditorModule.forRoot(),
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
