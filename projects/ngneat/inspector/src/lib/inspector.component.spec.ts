import { DragDropModule } from '@angular/cdk/drag-drop';
import { BrowserTestingModule } from '@angular/platform-browser/testing';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { Spectator, createComponentFactory } from '@ngneat/spectator';

import { InspectorComponent } from './inspector.component';

describe('InspectorComponent', () => {
  let spectator: Spectator<InspectorComponent>;
  const createComponent = createComponentFactory({
    component: InspectorComponent,
    imports: [BrowserTestingModule, DragDropModule, FontAwesomeModule],
  });

  it('should create', () => {
    spectator = createComponent();

    expect(spectator.component).toBeTruthy();
  });
});
