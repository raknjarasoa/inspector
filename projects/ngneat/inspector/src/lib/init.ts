import { InspectorService } from './services/inspector.service';

export function init(inspectorService: InspectorService): any {
  return () => {
    inspectorService.init();
  };
}
