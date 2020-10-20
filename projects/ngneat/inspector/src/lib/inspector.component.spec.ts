import { BrowserTestingModule } from '@angular/platform-browser/testing';
import { Spectator, createComponentFactory } from '@ngneat/spectator';

import { InspectorComponent } from './inspector.component';
import { InspectorConfig } from './inspector.model';

describe('InspectorComponent', () => {
  let spectator: Spectator<InspectorComponent>;
  const createComponent = createComponentFactory({
    component: InspectorComponent,
    imports: [BrowserTestingModule],
  });

  it('should create', () => {
    const defaultConfig = new InspectorConfig();
    spectator = createComponent({
      props: {
        zIndex: defaultConfig.zIndex,
        outline: defaultConfig.outline,
        position: defaultConfig.position,
        keyCombo: defaultConfig.keyCombo,
        closeOnEsc: defaultConfig.closeOnEsc,
        enableKeyCombo: defaultConfig.enableKeyCombo,
        hideNonSupportedProps: defaultConfig.hideNonSupportedProps,
      },
    });

    expect(spectator.component).toBeTruthy();
  });
});
