import { FormControl } from '@angular/forms';
import { Spectator, createComponentFactory } from '@ngneat/spectator';

import { TObjectComponent } from './t-object.component';

describe('TObjectComponent', () => {
  let spectator: Spectator<TObjectComponent>;
  const createComponent = createComponentFactory({
    component: TObjectComponent,
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
