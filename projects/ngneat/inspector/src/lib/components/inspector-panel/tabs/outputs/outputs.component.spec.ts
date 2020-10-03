import { ReactiveFormsModule } from '@angular/forms';
import { BrowserTestingModule } from '@angular/platform-browser/testing';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { Spectator, createComponentFactory } from '@ngneat/spectator';
import { FunctionOrOutput } from '../../../../inspector.model';

import { OutputsComponent } from './outputs.component';

describe('OutputsComponent', () => {
  let spectator: Spectator<OutputsComponent>;
  const createComponent = createComponentFactory(OutputsComponent);

  const dummyOutputs: FunctionOrOutput[] = [
    { actualFunction: () => console.log('dummy functions'), name: 'DummyFunction' },
  ];

  beforeEach(() => {
    spectator = createComponent({
      props: {
        outputs: dummyOutputs,
      },
    });
  });

  it('should create', () => {
    expect(spectator.component).toBeTruthy();
  });
});
