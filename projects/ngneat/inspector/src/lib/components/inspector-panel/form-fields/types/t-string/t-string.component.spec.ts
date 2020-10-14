import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { BrowserTestingModule } from '@angular/platform-browser/testing';
import { Spectator, createComponentFactory } from '@ngneat/spectator';

import { TStringComponent } from './t-string.component';

describe('TStringComponent', () => {
  let spectator: Spectator<TStringComponent>;
  const createComponent = createComponentFactory({
    component: TStringComponent,
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
