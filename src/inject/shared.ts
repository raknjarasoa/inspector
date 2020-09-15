import { APP_EXT_PROP_SELECT_TYPE, APP_EXT_PROP_VIEW_ID } from "../constants";
import { getPropertyHTML } from "./html-generators";
import { activePopovers, activePopoverIndex, activeNgComponent } from "./listeners";
import { listenForBoolean } from "./listeners/boolean-checkbox";
import { listenForValueChange } from "./listeners/edit-button";
import { listenForEmit } from "./listeners/emit-button";
import { listenForSelect } from "./listeners/select";
import { listenForObjectUpdate } from "./listeners/update-button";

declare const ng: any;

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
      const propType: "input" | "output" = getPropType(componentProp.constructor.name);

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

/**
 * Use `ng.getComponent(element)` to get Angular component.
 * If current `element` is not an Angular component, get it's `owningComponent`.
 * If `owningComponent` is null, then traverse upto first child of `<body>` to find the component.
 *
 * @param {(Element | HTMLElement)} element
 * @returns {*}
 */
export function getNgComponent(element: Element | HTMLElement): any {
  let nGComponent = ng.getComponent(element);

  // if it's not a component, get owning component
  if (!nGComponent) {
    nGComponent = ng.getOwningComponent(element);

    // if it's not a component, get parent element and get it's component
    // but we won't go to body
    if (!nGComponent && element.parentElement && element.parentElement.tagName !== "BODY") {
      nGComponent = getNgComponent(element.parentElement);
    }
  }
  return nGComponent;
}

export function updateViewContent(element: HTMLInputElement, properties: Properties, shouldListenForSelect = false) {
  const activeProp = element.value;
  const propType = element.getAttribute(APP_EXT_PROP_SELECT_TYPE);

  if (propType === "inputs" || propType === "outputs") {
    const viewDIV = document.getElementById(APP_EXT_PROP_VIEW_ID);
    if (viewDIV) {
      let html = "";
      if (activeProp && activeProp !== "Choose...") {
        html = getPropertyHTML(activeProp, properties[propType][activeProp], activeNgComponent);
        activePopovers[activePopoverIndex].setProps({
          placement: "auto-end",
        });
      }

      viewDIV.innerHTML = html;
      listenForEmit();
      listenForValueChange();
      listenForBoolean();
      listenForObjectUpdate();
      if (shouldListenForSelect) {
        listenForSelect();
      }
    }
  }
}
