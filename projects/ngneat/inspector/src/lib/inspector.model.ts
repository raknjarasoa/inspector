import { EventEmitter } from '@angular/core';

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
  args?: any[];
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
  [TabType.functions]: FunctionOrOutput[];
  name: string;
  [TabType.properties]: Property[];
  selector: string;
  [TabType.outputs]: FunctionOrOutput[];
  hostElement: HTMLElement;
  rawComponent: NgComponentRaw;
}

export enum TabType {
  properties = 'PROPERTIES',
  outputs = 'OUTPUTS',
  functions = 'FUNCTIONS',
}

export interface TabComponent {
  members: (Property | FunctionOrOutput)[];
  type: TabType;
  emitter: EventEmitter<Property | CallFunctionOrOutput>;
}

export interface TabOutput {
  name: string;
  value: string[];
}

export enum PropertyValueType {
  'string' = 'String',
  'number' = 'Number',
  'array' = 'Array',
  'boolean' = 'Boolean',
  'object' = 'Object',
  'not-supported' = 'Not Supported',
}
