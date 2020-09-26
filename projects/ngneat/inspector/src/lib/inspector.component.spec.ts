import { Spectator, createComponentFactory } from '@ngneat/spectator';

import { InspectorComponent } from './inspector.component';

describe('InspectorComponent', () => {
  let spectator: Spectator<InspectorComponent>;
  const createComponent = createComponentFactory(InspectorComponent);

  it('should create', () => {
    spectator = createComponent();

    expect(spectator.component).toBeTruthy();
  });
});
