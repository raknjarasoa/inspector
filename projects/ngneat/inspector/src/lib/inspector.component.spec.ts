import { DragDropModule } from '@angular/cdk/drag-drop';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { BrowserTestingModule } from '@angular/platform-browser/testing';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { Spectator, createComponentFactory } from '@ngneat/spectator';
import { TabsModule } from 'ngx-bootstrap/tabs';

import { InspectorComponent } from './inspector.component';

describe('InspectorComponent', () => {
  let spectator: Spectator<InspectorComponent>;
  const createComponent = createComponentFactory({
    component: InspectorComponent,
    imports: [BrowserTestingModule, HttpClientTestingModule, DragDropModule, FontAwesomeModule, TabsModule.forRoot()],
  });

  it('should create', () => {
    spectator = createComponent();

    expect(spectator.component).toBeTruthy();
  });
});
