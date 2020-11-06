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
    .filter((v) => {
      const constructorName =
        ngRawComponent[v] !== undefined &&
        ngRawComponent[v] !== null &&
        ngRawComponent[v].constructor &&
        ngRawComponent[v].constructor.name;
      return (
        (filterProps ? v.search(filterProps) < 0 : true) &&
        (hideNonSupportedProps ? supportedTypes.includes(constructorName) : true)
      );
    })
    .forEach((propName) => {
      const componentPropValueOrFunction = ngRawComponent[propName];
      const constructorName =
        ngRawComponent[propName] !== undefined &&
        ngRawComponent[propName] !== null &&
        ngRawComponent[propName].constructor &&
        ngRawComponent[propName].constructor.name;
      const propType: 'input' | 'output' = constructorName === 'EventEmitter_' ? 'output' : 'input';

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
