import { FunctionOrOutput, NG, NgComponent, Property, PropertyValueType, TabType } from '../inspector.model';

declare const ng: NG;

const supportedTypes: any[] = Object.values(PropertyValueType);
supportedTypes.push('EventEmitter_');

/**
 * Get processed component from ng.getComponent or ng.getOwningComponent
 *
 * @export
 */
export function getNgComponent(element: HTMLElement, hideNonSupportedProps: boolean, filterProps: RegExp): NgComponent {
  const ngRawComponent = ng.getComponent(element) || ng.getOwningComponent(element);
  const componentName = ngRawComponent.constructor.name;
  const hostElement = ng.getHostElement(ngRawComponent);
  const functions: FunctionOrOutput[] = [];

  // TODO: Use AST to get functions
  // Object.getOwnPropertyNames(ngRawComponent.constructor.prototype)
  //   .filter((v) => !nonFunctionNames.includes(v))
  //   .forEach((functionName) => {
  //     const actualFunction = ngRawComponent.constructor.prototype[functionName];
  //     functions.push({ name: functionName, actualFunction });
  //   });

  const properties: { name: string; value: any }[] = [];
  const outputs: FunctionOrOutput[] = [];

  Object.keys(ngRawComponent)
    .filter(
      (v) =>
        (filterProps ? v.search(filterProps) < 0 : true) &&
        (hideNonSupportedProps ? supportedTypes.includes(ngRawComponent[v].constructor.name) : true)
    )
    .forEach((propName) => {
      const componentPropValueOrFunction = ngRawComponent[propName];
      const propType: 'input' | 'output' =
        componentPropValueOrFunction.constructor.name === 'EventEmitter_' ? 'output' : 'input';

      if (propType === 'output') {
        outputs.push({
          actualFunction: componentPropValueOrFunction,
          name: propName,
        });
      } else {
        properties.push({ value: componentPropValueOrFunction, name: propName });
      }
    });

  return {
    [TabType.functions]: functions,
    hostElement,
    name: componentName,
    [TabType.outputs]: outputs,
    [TabType.properties]: properties,
    selector: hostElement.tagName.toLowerCase(),
    rawComponent: ngRawComponent,
  };
}

export function updateComponent(ngComponent: NgComponent, property: Property): void {
  ng.applyChanges(Object.assign(ngComponent.rawComponent, { [property.name]: property.value }));
}
