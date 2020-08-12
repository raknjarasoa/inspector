import tippy, { Instance, createSingleton } from "tippy.js";
import {
  APP_EXT_CONST,
  APP_EXT_PROP_EMIT_BUTTON_CLASS,
  APP_EXT_BUTTON_PROP,
  APP_EXT_PROP_VALUE_SPAN_CLASS,
  APP_EXT_PROP_VALUE_INPUT_CLASS,
  APP_EXT_PROP_VALUE_BUTTON_CLASS,
  APP_EXT_PROP_SELECT_CLASS,
  APP_EXT_PROP_OUTPUT_JSON_ID,
  APP_EXT_PROP_SELECT_TYPE,
  APP_EXT_PROP_BOOLEAN_ID,
} from "../shared/constants";
import { buildHTML, getPropertyHTML } from "./html-generators";
import { getProperties } from "./shared";

declare const ng: any;

let activePopovers: Instance[] = [];
let activeTarget: Element;
let activeNgComponent: any = null;
const singletonInstance = createSingleton(activePopovers, {
  moveTransition: "transform 0.3s ease-in-out",
  allowHTML: true,
  arrow: false,
  theme: "light-border",
  interactive: true,
  appendTo: () => document.body,
  maxWidth: 600,
  placement: "top-start",
  delay: [null, 100],
  trigger: "click",
  hideOnClick: false,
  overrides: ["onShown", "onHidden", "content", "onShow"],
});

/**
 * Start listening to `mouseover` of `document`. Fetch the hovered target and find the Angular component
 * for it, by traversing to the top-level of `event.target` using `parentElement`. Then find Angular
 * component's properties and show a popover with all controls.
 *
 */
export function startDocumentOverListen(runtimeData: runtimeData): void {
  singletonInstance.enable();
  document.addEventListener("mouseover", handleMouseOver(runtimeData), true);
}

export function stopDocumentOverListen(): void {
  document.removeEventListener("mouseover", handleMouseOver(), true);
  singletonInstance.disable();
}

export function handleMouseOver(
  runtimeData: Partial<runtimeData> = {}
): (this: Document, ev: MouseEvent) => any {
  return (ev: MouseEvent) => {
    const element = ev.target as Element;
    if (element !== activeTarget) {
      activeTarget = element;
      const { nGComponent } = getNgComponent(element);
      const attributeValue = element.getAttribute(APP_EXT_CONST);
      const isPopoverActive = attributeValue
        ? parseInt(attributeValue, 10)
        : -1;
      if (nGComponent) {
        activeNgComponent = nGComponent;
        if (isPopoverActive < 0) {
          let html = buildHTML(
            nGComponent,
            activePopovers.length + 1 + "",
            <runtimeData>runtimeData
          );
          const tippyInstance = tippy(element, {
            content: html,
            onShown: () => {
              listenForSelect();
            },
          });
          activePopovers.push(tippyInstance);
          singletonInstance.setInstances(activePopovers);
          element.setAttribute(APP_EXT_CONST, activePopovers.length - 1 + "");
        } else {
          if (activePopovers[isPopoverActive]) {
            let html = buildHTML(
              nGComponent,
              isPopoverActive + "",
              <runtimeData>runtimeData
            );
            activePopovers[isPopoverActive].setProps({
              content: html,
              onShown: () => {
                listenForSelect();
              },
            });
            singletonInstance.setInstances(activePopovers);
          }
        }
      } else {
      }
    }
  };
}

/**
 * Use `ng.getComponent(element)` to get Angular component. If current hovered `element` is not
 * an Angular component, get it's `parentElement` and check recursively.
 *
 * @param {(Element | HTMLElement)} element
 * @returns {*}
 */
function getNgComponent(element: Element | HTMLElement): any {
  const nGComponent = ng.getComponent(element);
  if (!nGComponent && element.parentElement) {
    return getNgComponent(element.parentElement);
  }
  return { nGComponent, element };
}

function listenForSelect(): void {
  const selectList = document.getElementsByClassName(APP_EXT_PROP_SELECT_CLASS);
  if (selectList.length) {
    for (let i = 0; i < selectList.length; i++) {
      const selectElement = selectList.item(i);
      if (selectElement) {
        selectElement.addEventListener("change", (event) => {
          const element = event.target as HTMLInputElement;
          const properties = getProperties(activeNgComponent);
          const activeProp = element.value;
          const propType = element.getAttribute(APP_EXT_PROP_SELECT_TYPE);

          if (propType === "inputs" || propType === "outputs") {
            const selectNextDiv =
              selectElement.parentElement &&
              selectElement.parentElement.nextElementSibling;
            if (selectNextDiv) {
              let html = "";
              if (activeProp) {
                html = getPropertyHTML(
                  activeProp,
                  properties[propType][activeProp],
                  activeNgComponent
                );
              }

              selectNextDiv.innerHTML = html;
              listenForEmit();
              listenForValueChange();
              listenForBoolean();
            }
          }
        });
      }
    }
  }
}

/**
 * As soon as tooltip is shown, we can start listening to `emit buttons`, so that we can
 * capture events and update the component.
 *
 */
function listenForEmit(): void {
  const emitButtonList = document.getElementsByClassName(
    APP_EXT_PROP_EMIT_BUTTON_CLASS
  );
  if (emitButtonList.length) {
    for (let i = 0; i < emitButtonList.length; i++) {
      const emitButton = emitButtonList.item(i);
      if (emitButton) {
        emitButton.addEventListener("click", (event) => {
          const prop = (event.target as Element).getAttribute(
            APP_EXT_BUTTON_PROP
          );
          if (activeNgComponent && prop) {
            const parentElement = (event.target as Element).parentElement;
            const inputValue =
              parentElement &&
              (parentElement.previousElementSibling as HTMLInputElement).value;
            const isJSON = (document.getElementById(
              APP_EXT_PROP_OUTPUT_JSON_ID
            ) as HTMLInputElement).checked;
            if (inputValue && isJSON) {
              activeNgComponent[prop].emit(JSON.parse(inputValue));
            } else if (inputValue) {
              activeNgComponent[prop].emit(inputValue);
            }
          } else {
          }
        });
      }
    }
  }
}

/**
 * As soon as tooltip is shown, we can start listening to `edit / update buttons`, so that we can
 * capture events and update the component.
 *
 */
function listenForValueChange(): void {
  const valueButtonList = document.getElementsByClassName(
    APP_EXT_PROP_VALUE_BUTTON_CLASS
  );
  if (valueButtonList.length) {
    for (let i = 0; i < valueButtonList.length; i++) {
      const valueButton = valueButtonList.item(i);
      if (valueButton) {
        valueButton.addEventListener("click", (event) => {
          const prop = (event.target as Element).getAttribute(
            APP_EXT_BUTTON_PROP
          );
          if (activeNgComponent && prop) {
            const parentElement = (event.target as Element).parentElement;
            const inputValue =
              parentElement &&
              (parentElement.previousElementSibling as HTMLInputElement).value;
            if (inputValue) {
              activeNgComponent[prop] = inputValue;
              ng.applyChanges(activeNgComponent);
            } else {
            }
          } else {
          }
        });
      } else {
      }
    }
  }
}

/**
 * As soon as tooltip is shown, we can start listening to `boolean checkboxes`, so that we can
 * capture events and update the component.
 *
 */
function listenForBoolean(): void {
  const checkbox = document.getElementById(APP_EXT_PROP_BOOLEAN_ID);
  if (checkbox) {
    checkbox.addEventListener("change", (event) => {
      const element = event.target as HTMLInputElement;
      const prop = element.getAttribute(APP_EXT_BUTTON_PROP);
      if (activeNgComponent && prop) {
        const checkboxValue = element.checked;
        activeNgComponent[prop] = checkboxValue;
        ng.applyChanges(activeNgComponent);
      } else {
      }
    });
  }
}
