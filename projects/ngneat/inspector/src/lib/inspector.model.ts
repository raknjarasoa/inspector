export class InspectorConfig {
  enabled = true;
  hidden = false;
}

export interface NG {
  applyChanges: (component: NgComponentRaw) => void;
  getComponent: (element: HTMLElement) => NgComponentRaw;
  getOwningComponent: (element: HTMLElement) => NgComponentRaw;
  getHostElement: (component: NgComponentRaw) => HTMLElement;
}

export interface NgComponentRaw {
  constructor: {
    name: string;
    prototype: { [key: string]: () => any };
  };
  __ngContext__: any;
}

export interface FunctionOrOutput {
  name: string;
  function: () => any;
}

export interface NgComponent {
  functions: FunctionOrOutput[];
  name: string;
  properties: { name: string; value: any }[];
  selector: string;
  outputs: FunctionOrOutput[];
  hostElement: HTMLElement;
  rawComponent: NgComponentRaw;
}
