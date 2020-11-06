import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { InspectorModule } from '@ngneat/inspector';

import { AppComponent } from './app.component';
import { ChildComponent } from './child/child.component';
import { environment } from '../environments/environment';
import { MaterialModule } from './material/material.module';
import { MatDropdownComponent } from './mat-dropdown/mat-dropdown.component';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [AppComponent, ChildComponent, MatDropdownComponent],
  imports: [
    BrowserModule,
    environment.production ? [] : InspectorModule.forRoot(),
    BrowserAnimationsModule,
    MaterialModule,
    ReactiveFormsModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
