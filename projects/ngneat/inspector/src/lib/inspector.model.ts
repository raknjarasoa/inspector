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
    prototype: { [key: string]: (...args: any) => any };
  };
  __ngContext__: any;
  [key: string]: any | ((...args: any) => any);
}

export interface FunctionOrOutput {
  name: string;
  actualFunction: (...args: any) => any;
}

export interface CallFunctionOrOutput {
  args: any[];
  name: string;
}

export interface Property {
  name: string;
  value: any;
}

export interface NgComponent {
  functions: FunctionOrOutput[];
  name: string;
  properties: Property[];
  selector: string;
  outputs: FunctionOrOutput[];
  hostElement: HTMLElement;
  rawComponent: NgComponentRaw;
}
