import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { BrowserTestingModule } from '@angular/platform-browser/testing';
import { Spectator, createComponentFactory } from '@ngneat/spectator';
import { FieldHostDirective } from '../../../../directives/field-host.directive';

import { TypeSelectorComponent } from './type-selector.component';

describe('TypeSelectorComponent', () => {
  let spectator: Spectator<TypeSelectorComponent>;
  const createComponent = createComponentFactory({
    component: TypeSelectorComponent,
    imports: [BrowserTestingModule, ReactiveFormsModule],
    declarations: [FieldHostDirective],
  });

  beforeEach(() => {
    spectator = createComponent({
      props: { inputFormControl: new FormControl(''), typeSelectorFormControl: new FormControl('') },
    });
  });

  it('should create', () => {
    expect(spectator.component).toBeTruthy();
  });
});
