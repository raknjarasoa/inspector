import { NgModule } from '@angular/core';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

import { InspectorComponent } from './inspector.component';

@NgModule({
  declarations: [InspectorComponent],
  imports: [DragDropModule, MatIconModule, MatButtonModule],
  exports: [InspectorComponent],
})
export class InspectorModule {}
