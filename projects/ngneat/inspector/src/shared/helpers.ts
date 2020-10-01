import { FunctionOrOutput, NG, NgComponent, Property } from '../lib/inspector.model';

declare const ng: NG;

/**
 * Get processed component from ng.getComponent or ng.getOwningComponent
 *
 * @export
 */
export function getNgComponent(element: HTMLElement): NgComponent {
  const ngRawComponent = ng.getComponent(element) || ng.getOwningComponent(element);
  const componentName = ngRawComponent.constructor.name;
  const hostElement = ng.getHostElement(ngRawComponent);
  const functions: FunctionOrOutput[] = [];

  Object.keys(ngRawComponent.constructor.prototype)
    .filter((v) => !this.nonFunctionNames.includes(v))
    .forEach((functionName) => {
      functions.push({ name: functionName, function: ngRawComponent.constructor.prototype[functionName] });
    });

  const properties: { name: string; value: any }[] = [];
  const outputs: FunctionOrOutput[] = [];

  Object.keys(ngRawComponent)
    .filter((v) => v !== '__ngContext__')
    .forEach((propName) => {
      const componentPropValueOrFunction = ngRawComponent[propName];
      const propType: 'input' | 'output' =
        componentPropValueOrFunction.constructor.name === 'EventEmitter_' ? 'output' : 'input';

      if (propType === 'output') {
        outputs.push({ function: componentPropValueOrFunction, name: propName });
      } else {
        properties.push({ value: componentPropValueOrFunction, name: propName });
      }
    });

  return {
    functions,
    hostElement,
    name: componentName,
    outputs,
    properties,
    selector: hostElement.tagName.toLowerCase(),
    rawComponent: ngRawComponent,
  };
}

export function updateComponent(ngComponent: NgComponent, property: Property): void {
  ng.applyChanges(Object.assign(ngComponent.rawComponent, { [property.name]: property.value }));
}
