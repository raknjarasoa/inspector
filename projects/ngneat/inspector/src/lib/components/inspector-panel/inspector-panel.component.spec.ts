import { BrowserTestingModule } from '@angular/platform-browser/testing';
import { Spectator, createComponentFactory } from '@ngneat/spectator';

import { NgComponent, TabType } from '../../inspector.model';

import { InspectorPanelComponent } from './inspector-panel.component';

describe('InspectorPanelComponent', () => {
  let spectator: Spectator<InspectorPanelComponent>;
  const createComponent = createComponentFactory({
    component: InspectorPanelComponent,
    imports: [BrowserTestingModule],
  });

  const dummyNgComponent: NgComponent = {
    name: 'Dummy Component',
    selector: 'dummy-comp',
    [TabType.functions]: [],
    [TabType.properties]: [],
    rawComponent: undefined,
    [TabType.outputs]: [],
    hostElement: undefined,
  };

  beforeEach(() => {
    spectator = createComponent({
      props: {
        ngComponent: dummyNgComponent,
      },
    });
  });

  it('should create', () => {
    expect(spectator.component).toBeTruthy();
  });
});
