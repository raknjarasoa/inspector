import { ReactiveFormsModule } from '@angular/forms';
import { BrowserTestingModule } from '@angular/platform-browser/testing';
import { Spectator, createComponentFactory } from '@ngneat/spectator';
import { Property } from '../../../../inspector.model';

import { PropertiesComponent } from './properties.component';

describe('PropertiesComponent', () => {
  let spectator: Spectator<PropertiesComponent>;
  const createComponent = createComponentFactory({
    component: PropertiesComponent,
    imports: [BrowserTestingModule, ReactiveFormsModule],
  });

  const dummyProperties: Property[] = [{ name: 'DummyProperty', value: 'DummyProperyValue' }];

  beforeEach(() => {
    spectator = createComponent({
      props: {
        properties: dummyProperties,
      },
    });
  });

  it('should create', () => {
    expect(spectator.component).toBeTruthy();
  });
});
