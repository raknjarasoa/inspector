import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { BrowserTestingModule } from '@angular/platform-browser/testing';
import { Spectator, createComponentFactory } from '@ngneat/spectator';

import { TObjectComponent } from './t-object.component';

describe('TObjectComponent', () => {
  let spectator: Spectator<TObjectComponent>;
  const createComponent = createComponentFactory({
    component: TObjectComponent,
    imports: [ReactiveFormsModule],
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
