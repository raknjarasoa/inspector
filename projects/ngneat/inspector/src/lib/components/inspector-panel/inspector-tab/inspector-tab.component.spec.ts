import { BrowserTestingModule } from '@angular/platform-browser/testing';
import { Spectator, createComponentFactory } from '@ngneat/spectator';
import { Property, TabType } from '../../../inspector.model';

import { InspectorTabComponent } from './inspector-tab.component';

describe('InspectorTabComponent', () => {
  let spectator: Spectator<InspectorTabComponent>;
  const createComponent = createComponentFactory({
    component: InspectorTabComponent,
    imports: [BrowserTestingModule],
  });

  beforeEach(() => {
    spectator = createComponent({
      props: {
        members: [],
        type: TabType.properties,
        hideNonSupportedProps: true,
      },
    });
  });

  it('should create', () => {
    expect(spectator.component).toBeTruthy();
  });
});
