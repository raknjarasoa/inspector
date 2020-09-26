import { createServiceFactory, SpectatorService } from '@ngneat/spectator';
import { InspectorService } from './inspector.service';

describe('InspectorService', () => {
  let spectator: SpectatorService<InspectorService>;
  const createService = createServiceFactory(InspectorService);

  beforeEach(() => (spectator = createService()));

  it('should...', () => {
    expect(spectator.service).toBeTruthy();
  });
});
