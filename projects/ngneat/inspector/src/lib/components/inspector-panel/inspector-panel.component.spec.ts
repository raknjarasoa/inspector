import { HttpClientTestingModule } from '@angular/common/http/testing';
import { BrowserTestingModule } from '@angular/platform-browser/testing';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { Spectator, createComponentFactory } from '@ngneat/spectator';
import { TabsModule } from 'ngx-bootstrap/tabs';

import { NgComponent } from '../../inspector.model';

import { InspectorPanelComponent } from './inspector-panel.component';

describe('InspectorPanelComponent', () => {
  let spectator: Spectator<InspectorPanelComponent>;
  const createComponent = createComponentFactory({
    component: InspectorPanelComponent,
    imports: [BrowserTestingModule, HttpClientTestingModule, FontAwesomeModule, TabsModule.forRoot()],
  });

  const dummyNgComponent: NgComponent = {
    name: 'Dummy Component',
    selector: 'dummy-comp',
    functions: [],
    properties: [],
    rawComponent: undefined,
    outputs: [],
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
