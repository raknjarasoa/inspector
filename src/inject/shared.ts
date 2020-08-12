/**
 * Pass component returned from `ng.getComponent(element)` and get it's properties,
 * except `__ngContext__`.
 *
 * @param {*} ngComponent
 * @returns {{ [key: string]: any }}
 */
export function getProperties(ngComponent: any): Properties {
  let inputProperties = {};
  let outputProperties = {};
  Object.keys(ngComponent)
    .filter((v) => v !== "__ngContext__")
    .forEach((propName) => {
      const componentProp = ngComponent[propName];
      const propType: "input" | "output" = getPropType(
        componentProp.constructor.name
      );

      if (propType === "output") {
        outputProperties = Object.assign(outputProperties, {
          [propName]: componentProp,
        });
      } else {
        inputProperties = Object.assign(inputProperties, {
          [propName]: componentProp,
        });
      }
    });
  return { inputs: inputProperties, outputs: outputProperties };
}
function getPropType(constructorName: any): "input" | "output" {
  return constructorName === "EventEmitter_" ? "output" : "input";
}
