import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { BrowserTestingModule } from '@angular/platform-browser/testing';
import { Spectator, createComponentFactory } from '@ngneat/spectator';

import { TBooleanComponent } from './t-boolean.component';

describe('TBooleanComponent', () => {
  let spectator: Spectator<TBooleanComponent>;
  const createComponent = createComponentFactory({
    component: TBooleanComponent,
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
