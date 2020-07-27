/**
 * Pass component returned from `ng.getComponent(element)` and get it's properties,
 * except `__ngContext__`.
 *
 * @param {*} ngComponent
 * @returns {{ [key: string]: any }}
 */
export function getProperties(ngComponent: any): { [key: string]: any } {
  let properties = {};
  Object.keys(ngComponent)
    .filter((v) => v !== "__ngContext__")
    .forEach((propName) => {
      properties = Object.assign(properties, {
        [propName]: ngComponent[propName],
      });
    });
  return properties;
}
