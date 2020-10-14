import {
  ApplicationRef,
  ComponentFactoryResolver,
  EmbeddedViewRef,
  Injectable,
  Injector,
  Optional,
} from '@angular/core';
import { InspectorComponent } from '../inspector.component';
import { InspectorConfig } from '../inspector.model';

@Injectable()
export class InspectorService {
  private _enabled = true;
  constructor(private injector: Injector, @Optional() config: InspectorConfig) {
    if (config) {
      this._enabled = config.enabled;
    }
  }

  init(): void {
    if (this._enabled) {
      const appRef = this.injector.get(ApplicationRef);
      const componentFactoryResolver = this.injector.get(ComponentFactoryResolver);

      const componentRef = componentFactoryResolver.resolveComponentFactory(InspectorComponent).create(this.injector);

      // 2. Attach component to the appRef so that it's inside the ng component tree
      appRef.attachView(componentRef.hostView);

      // 3. Get DOM element from component
      const domElem = (componentRef.hostView as EmbeddedViewRef<any>).rootNodes[0] as HTMLElement;

      // 4. Append DOM element to the body
      document.body.appendChild(domElem);
    }
  }
}
