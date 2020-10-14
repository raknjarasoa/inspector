import { createServiceFactory, SpectatorService } from '@ngneat/spectator';

import { InspectorService } from './inspector.service';

describe('InspectorService', () => {
  let spectator: SpectatorService<InspectorService>;
  const createService = createServiceFactory({
    service: InspectorService,
  });

  beforeEach(() => (spectator = createService()));

  it('should be enabled', () => {
    expect(spectator.service).toBeTruthy();
  });
});
