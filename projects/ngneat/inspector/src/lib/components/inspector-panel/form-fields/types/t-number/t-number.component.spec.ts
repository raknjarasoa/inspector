import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { BrowserTestingModule } from '@angular/platform-browser/testing';
import { Spectator, createComponentFactory } from '@ngneat/spectator';

import { TNumberComponent } from './t-number.component';

describe('TNumberComponent', () => {
  let spectator: Spectator<TNumberComponent>;
  const createComponent = createComponentFactory({
    component: TNumberComponent,
    imports: [BrowserTestingModule, ReactiveFormsModule],
  });

  beforeEach(() => {
    spectator = createComponent({
      props: {
        fieldType: '',
        formControl: new FormControl(''),
        inputId: '',
      },
    });
  });

  it('should create', () => {
    expect(spectator.component).toBeTruthy();
  });
});
