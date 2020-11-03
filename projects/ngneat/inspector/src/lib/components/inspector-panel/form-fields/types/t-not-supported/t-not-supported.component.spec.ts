import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { BrowserTestingModule } from '@angular/platform-browser/testing';
import { Spectator, createComponentFactory } from '@ngneat/spectator';

import { TNotSupportedComponent } from './t-not-supported.component';

describe('TNotSupportedComponent', () => {
  let spectator: Spectator<TNotSupportedComponent>;
  const createComponent = createComponentFactory({
    component: TNotSupportedComponent,
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
