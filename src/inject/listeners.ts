import tippy, { Instance, createSingleton, Props } from "tippy.js";
import {
  APP_EXT_CONST,
  APP_EXT_PROP_EMIT_BUTTON_ID,
  APP_EXT_BUTTON_PROP,
  APP_EXT_PROP_VALUE_SPAN_CLASS,
  APP_EXT_PROP_VALUE_INPUT_CLASS,
  APP_EXT_PROP_VALUE_BUTTON_CLASS,
  APP_EXT_PROP_SELECT_CLASS,
  APP_EXT_PROP_OUTPUT_JSON_ID,
  APP_EXT_PROP_SELECT_TYPE,
  APP_EXT_PROP_BOOLEAN_ID,
  APP_EXT_PROP_OBJECT_BUTTON_ID,
  APP_EXT_CLOSE_BUTTON_ID,
  APP_EXT_PROP_OBJECT_VALUE,
  APP_EXT_PROP_OBJECT_VALUE_ERROR,
  APP_EXT_PROP_OUTPUT_VALUE,
  APP_EXT_TOGGLE_BTN_ID,
  APP_EXT_PROP_VIEW_ID,
  APP_EXT_PROP_TYPE_RADIO_NAME,
  APP_EXT_INPUT_SELECT_ID,
  APP_EXT_OUTPUT_SELECT_ID,
} from "../shared/constants";
import {
  buildHTML,
  buildNotFoundHTML,
  getPropertyHTML,
} from "./html-generators";
import { getProperties } from "./shared";

declare const ng: any;

export let activePopovers: Instance[] = [];
let activeTarget: Element;
let activeNgComponent: any = null;

const defaultTippyOptions: Partial<Props> = {
  allowHTML: true,
  arrow: false,
  theme: "light-border",
  interactive: true,
  appendTo: () => document.body,
  maxWidth: 600,
  placement: "auto",
  delay: [null, 100],
  trigger: "manual",
  hideOnClick: false,
  moveTransition: "transform 0.2s ease-out",
};

export let activePopoverIndex = -1;
export let oldActivePopoverIndex = -1;

/**
 * Start listening to `mouseover` of `document`. Fetch the hovered target and find the Angular component
 * for it, by traversing to the top-level of `event.target` using `parentElement`. Then find Angular
 * component's properties and show a popover with all controls.
 *
 */
export function startDocumentOverListen(): void {
  document.addEventListener("contextmenu", handleContextMenu(), true);
}

export function stopDocumentOverListen(): void {
  document.removeEventListener("contextmenu", handleContextMenu(), true);
}

export function handleContextMenu(): (this: Document, ev: MouseEvent) => any {
  return (ev: MouseEvent) => {
    oldActivePopoverIndex = activePopoverIndex;
    const element = ev.target as Element;
    if (element !== activeTarget) {
      activeTarget = element;
      const nGComponent = getNgComponent(element);
      const attributeValue = element.getAttribute(APP_EXT_CONST);
      activePopoverIndex = attributeValue ? parseInt(attributeValue, 10) : -1;
      if (nGComponent) {
        activeNgComponent = nGComponent;
        if (activePopoverIndex < 0) {
          let html = buildHTML(nGComponent, activePopovers.length + 1 + "");
          const tippyInstance = tippy(element, {
            ...defaultTippyOptions,
            content: html,
            onShown: () => {
              listenForRadio();
              listenForSelect();
              listenForCloseButton();
            },
          });
          activePopovers.push(tippyInstance);
          activePopoverIndex = activePopovers.length - 1;
          element.setAttribute(APP_EXT_CONST, activePopovers.length - 1 + "");
        } else {
          if (activePopovers[activePopoverIndex]) {
            let html = buildHTML(nGComponent, activePopoverIndex + "");
            activePopovers[activePopoverIndex].setProps({
              content: html,
              onShown: () => {
                listenForRadio();
                listenForSelect();
                listenForCloseButton();
              },
            });
          }
        }
      } else {
        let html = buildNotFoundHTML();
        const tippyInstance = tippy(element, {
          ...defaultTippyOptions,
          content: html,
          onShown: () => {
            listenForCloseButton();
          },
        });
        activePopovers.push(tippyInstance);
        activePopoverIndex = activePopovers.length - 1;
        element.setAttribute(APP_EXT_CONST, activePopovers.length - 1 + "");
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
  let nGComponent = ng.getComponent(element);

  // if it's not a component, get owning component
  if (!nGComponent) {
    nGComponent = ng.getOwningComponent(element);

    // if it's not a component, get parent element and get it's component
    // but we won't go to body
    if (
      !nGComponent &&
      element.parentElement &&
      element.parentElement.tagName !== "BODY"
    ) {
      nGComponent = getNgComponent(element.parentElement);
    }
  }
  return nGComponent;
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
          updateViewContent(element, properties);
        });
      }
    }
  }
}

function updateViewContent(
  element: HTMLInputElement,
  properties: Properties,
  shouldListenForSelect = false
) {
  const activeProp = element.value;
  const propType = element.getAttribute(APP_EXT_PROP_SELECT_TYPE);

  if (propType === "inputs" || propType === "outputs") {
    const viewDIV = document.getElementById(APP_EXT_PROP_VIEW_ID);
    if (viewDIV) {
      let html = "";
      if (activeProp && activeProp !== "Choose...") {
        html = getPropertyHTML(
          activeProp,
          properties[propType][activeProp],
          activeNgComponent
        );
        activePopovers[activePopoverIndex].setProps({
          placement: "auto",
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

/**
 * As soon as tooltip is shown, we can start listening to `emit buttons`, so that we can
 * capture events and update the component.
 *
 */
function listenForEmit(): void {
  const emitButton = document.getElementById(APP_EXT_PROP_EMIT_BUTTON_ID);
  if (emitButton) {
    emitButton.addEventListener("click", (event) => {
      const prop = (event.target as Element).getAttribute(APP_EXT_BUTTON_PROP);
      if (activeNgComponent && prop) {
        const element = document.getElementById(
          APP_EXT_PROP_OUTPUT_VALUE
        ) as HTMLInputElement;
        const inputValue = element && element.value;
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

/**
 * As soon as tooltip is shown, we can start listening to `update buttons`, so that we can
 * capture events and update the component.
 *
 */
function listenForObjectUpdate(): void {
  const valueButton = document.getElementById(APP_EXT_PROP_OBJECT_BUTTON_ID);
  if (valueButton) {
    valueButton.addEventListener("click", (event) => {
      const prop = (event.target as Element).getAttribute(APP_EXT_BUTTON_PROP);
      if (activeNgComponent && prop) {
        const element = document.getElementById(APP_EXT_PROP_OBJECT_VALUE);
        const inputValue = element && element.innerText;
        if (inputValue) {
          // thanks to https://stackoverflow.com/a/48632166
          const jsonString = inputValue.replace(/("[^"]*")|([ \s]+)/g, (x) => {
            return x.charCodeAt(0) == 34 ? x : "";
          });
          if (jsonString) {
            try {
              activeNgComponent[prop] = JSON.parse(jsonString);
              ng.applyChanges(activeNgComponent);
            } catch (e) {
              const errorElement = document.getElementById(
                APP_EXT_PROP_OBJECT_VALUE_ERROR
              );
              if (errorElement) {
                errorElement.innerText = "⚠️ Error while parsing JSON!";
              }
            }
          }
        } else {
        }
      } else {
      }
    });
  } else {
  }
}

/**
 * As soon as tooltip is shown, we can start listening to `close buttons`, so that we can
 * close the tooltip
 *
 */
function listenForCloseButton(): void {
  const closeButton = document.getElementById(APP_EXT_CLOSE_BUTTON_ID);
  if (closeButton) {
    closeButton.addEventListener("click", (event) => {
      if (
        activePopovers.length &&
        activePopoverIndex > -1 &&
        activePopovers[activePopoverIndex]
      ) {
        activePopovers[activePopoverIndex].hide();
      }
    });
  } else {
  }
}

/**
 * As soon as tooltip is shown, we can start listening to `radio buttons`, so that we can
 * capture events and update the component.
 *
 */
function listenForRadio(): void {
  const radioButtons = document.querySelectorAll(
    "input[name='" + APP_EXT_PROP_TYPE_RADIO_NAME + "']"
  );
  radioButtons.forEach((radioButton) => {
    const element = radioButton as HTMLInputElement;
    element.addEventListener("change", (event) => {
      const targetElement = event.target as HTMLInputElement;
      if (targetElement.checked) {
        const value = targetElement.value;
        const inputSelect = document.getElementById(
          APP_EXT_INPUT_SELECT_ID
        ) as HTMLInputElement;
        const outputSelect = document.getElementById(
          APP_EXT_OUTPUT_SELECT_ID
        ) as HTMLInputElement;
        if (value === "input") {
          inputSelect.disabled = false;
          outputSelect.disabled = true;
          const properties = getProperties(activeNgComponent);
          updateViewContent(inputSelect, properties, true);
        } else {
          inputSelect.disabled = true;
          outputSelect.disabled = false;
          const properties = getProperties(activeNgComponent);
          updateViewContent(outputSelect, properties, true);
        }
      }
    });
  });
}
