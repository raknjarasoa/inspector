import { FormControl } from '@angular/forms';
import { Spectator, createComponentFactory } from '@ngneat/spectator';

import { TArrayComponent } from './t-array.component';

describe('InspectorTabComponent', () => {
  let spectator: Spectator<TArrayComponent>;
  const createComponent = createComponentFactory({
    component: TArrayComponent,
  });

  beforeEach(() => {
    spectator = createComponent({
      props: {
        formControl: new FormControl(''),
      },
    });
  });

  it('should create', () => {
    expect(spectator.component).toBeTruthy();
  });
});
