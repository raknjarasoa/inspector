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
import { config as aceConfig } from 'ace-builds';

@Injectable()
export class InspectorService {
  private _defaultConfig = new InspectorConfig();
  private _enabled = this._defaultConfig.enabled;
  private _zIndex = this._defaultConfig.zIndex;
  private _outline = this._defaultConfig.outline;
  private _position = this._defaultConfig.position;
  private _keyCombo = this._defaultConfig.keyCombo;
  private _closeOnEsc = this._defaultConfig.closeOnEsc;
  private _enableKeyCombo = this._defaultConfig.enableKeyCombo;
  private _hideNonSupportedProps = this._defaultConfig.hideNonSupportedProps;
  private _filterProps = this._defaultConfig.filterProps;

  constructor(private injector: Injector, @Optional() config: InspectorConfig) {
    if (config) {
      this._enabled = Object.prototype.hasOwnProperty.call(config, 'enabled') ? config.enabled : this._enabled;
      this._zIndex = Object.prototype.hasOwnProperty.call(config, 'zIndex') ? config.zIndex : this._zIndex;
      this._outline = Object.prototype.hasOwnProperty.call(config, 'outline')
        ? Object.assign(this._outline, config.outline)
        : this._outline;
      this._position = Object.prototype.hasOwnProperty.call(config, 'position')
        ? Object.assign(this._position, config.position)
        : this._position;
      this._keyCombo = Object.prototype.hasOwnProperty.call(config, 'keyCombo') ? config.keyCombo : this._keyCombo;
      this._closeOnEsc = Object.prototype.hasOwnProperty.call(config, 'closeOnEsc')
        ? config.closeOnEsc
        : this._closeOnEsc;
      this._enableKeyCombo = Object.prototype.hasOwnProperty.call(config, 'enableKeyCombo')
        ? config.enableKeyCombo
        : this._enableKeyCombo;
      this._hideNonSupportedProps = Object.prototype.hasOwnProperty.call(config, 'hideNonSupportedProps')
        ? config.hideNonSupportedProps
        : this._hideNonSupportedProps;
      this._filterProps = Object.prototype.hasOwnProperty.call(config, 'filterProps')
        ? config.filterProps
        : this._filterProps;
    }
  }

  init(): void {
    if (this._enabled) {
      aceConfig.set('basePath', 'https://unpkg.com/ace-builds@1.4.12/src-noconflict');
      aceConfig.set('fontSize', '14px');
      const appRef = this.injector.get(ApplicationRef);
      const componentFactoryResolver = this.injector.get(ComponentFactoryResolver);

      const componentRef = componentFactoryResolver.resolveComponentFactory(InspectorComponent).create(this.injector);
      componentRef.instance.zIndex = this._zIndex;
      componentRef.instance.outline = this._outline;
      componentRef.instance.position = this._position;
      componentRef.instance.keyCombo = this._keyCombo;
      componentRef.instance.closeOnEsc = this._closeOnEsc;
      componentRef.instance.enableKeyCombo = this._enableKeyCombo;
      componentRef.instance.hideNonSupportedProps = this._hideNonSupportedProps;
      componentRef.instance.filterProps = this._filterProps;

      // 2. Attach component to the appRef so that it's inside the ng component tree
      appRef.attachView(componentRef.hostView);

      // 3. Get DOM element from component
      const domElem = (componentRef.hostView as EmbeddedViewRef<any>).rootNodes[0] as HTMLElement;

      // 4. Append DOM element to the body
      document.body.appendChild(domElem);
    }
  }
}
