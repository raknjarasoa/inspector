import { Instance, createSingleton } from "tippy.js";
import {
  APP_EXT_CONST,
  APP_EXT_PROP_EMIT_BUTTON_CLASS,
  APP_EXT_BUTTON_PROP,
  APP_EXT_PROP_VALUE_SPAN_CLASS,
  APP_EXT_PROP_VALUE_INPUT_CLASS,
  APP_EXT_PROP_VALUE_BUTTON_CLASS,
} from "./constants";
import { isAngularAppRunning } from "./ng-check";

declare const ng: any;
declare const tippy: any;
declare const Popper: any;

let activePopovers: Instance[] = [];
let activeTarget: Element = null;
let activeNgComponent: any = null;
const singletonInstance = createSingleton(activePopovers, {
  moveTransition: "transform 0.3s ease-in-out",
  allowHTML: true,
  arrow: false,
  theme: "light-border",
  interactive: true,
  appendTo: () => document.body,
  overrides: ["onShown", "onHidden", "content"],
});
const inAppMethods = { enabled: false };

initInAppScript();

function initInAppScript(): void {
  if (typeof tippy !== "undefined" && typeof Popper !== "undefined") {
    window.addEventListener("message", (event) => {
      if (event.source != window) {
        return;
      }
      if (event.data.command === "destroy") {
        disableInAppMethods();
      } else if (
        event.data.command === "start-ng-check" ||
        event.data.command === "start"
      ) {
        if (isAngularAppRunning()) {
          enableInAppMethods(event.data.command === "start");
        } else {
          window.postMessage(
            { type: "ng-check-status", isAngular: false },
            "*"
          );
        }
      }
    });
  } else {
    window.postMessage({ type: "error", error: "tippy-popper-not-found" }, "*");
  }
}

function disableInAppMethods() {
  if (inAppMethods.enabled) {
    document.removeEventListener("mouseover", handleMouseOver(), true);
    destroyTippy();
    window.postMessage({ response: "destroyed" }, "*");
    inAppMethods.enabled = false;
  }
}

function enableInAppMethods(startingAgain: boolean) {
  if (!inAppMethods.enabled) {
    singletonInstance.enable();
    startDocumentOverListen();
    inAppMethods.enabled = true;
  }
  if (!startingAgain) {
    window.postMessage({ type: "ng-check-status", isAngular: true }, "*");
  }
}

/**
 * Start listening to `mouseover` of `document`. Fetch the hovered target and find the Angular component
 * for it, by traversing to the top-level of `event.target` using `parentElement`. Then find Angular
 * component's properties and show a popover with all controls.
 *
 */
function startDocumentOverListen(): void {
  document.addEventListener("mouseover", handleMouseOver(), true);
}

function handleMouseOver(): (this: Document, ev: MouseEvent) => any {
  return (ev: MouseEvent) => {
    const element = ev.target as Element;
    if (element !== activeTarget) {
      activeTarget = element;
      const { nGComponent } = getNgComponent(element);
      const isPopoverActive = parseInt(element.getAttribute(APP_EXT_CONST));
      if (nGComponent) {
        activeNgComponent = nGComponent;
        if (isNaN(isPopoverActive)) {
          let html = buildHTML(nGComponent, activePopovers.length + 1 + "");
          const tippyInstance = tippy(element, {
            content: html,
            onShown: () => {
              listenForSelect();
              // listenForEmit();
              // listenForValueChange();
            },
          });
          activePopovers.push(tippyInstance);
          singletonInstance.setInstances(activePopovers);
          element.setAttribute(APP_EXT_CONST, activePopovers.length - 1 + "");
        } else if (isPopoverActive) {
          if (activePopovers[isPopoverActive]) {
            let html = buildHTML(nGComponent, isPopoverActive + "");
            activePopovers[isPopoverActive].setProps({
              content: html,
            });
            singletonInstance.setInstances(activePopovers);
          }
        }
      }
    }
  };
}

function buildHTML(nGComponent: any, attrValue: string) {
  const properties = getProperties(nGComponent);
  let html = `<h4><strong>Component:</strong>${nGComponent.constructor.name}</h4>`;
  html += `<h4><strong>Selector:</strong>${nGComponent.constructor.decorators[0].args[0].selector}</h4>`;
  html += "<hr/>";

  html += `<select class="select-class" ${APP_EXT_CONST}="${attrValue}">
          <option value="">--Please choose a property--</option>`;
  for (const prop in properties) {
    html += `<option value="${prop}">${prop}</option>`;
  }
  html += "</select>";

  html += "<div class='select-next-div'></div>";
  return html;
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

/**
 * Pass component returned from `ng.getComponent(element)` and get it's properties,
 * except `__ngContext__`.
 *
 * @param {*} ngComponent
 * @returns {{ [key: string]: any }}
 */
function getProperties(ngComponent: any): { [key: string]: any } {
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

/**
 * Generate `input` and `button` html elements based on ngComponent properties.
 * If property is `string` or `number`, simple text with edit button will be shown and
 * user can click on edit and then update the properties. If property is an `object` and if it's
 * an `EventEmitter`, then an `input` with `button{Emit}` will be shown, user can enter value
 * in input and click on Emit to simulate output.
 *
 * @param {*} prop
 * @param {*} value
 * @param {*} nGComponent
 * @returns {string}
 */
function getPropertyHTML(prop: any, value: any, nGComponent: any): string {
  let html = value;
  switch (value.constructor.name) {
    case "EventEmitter_":
      html = `<input type="text"><button class="${APP_EXT_PROP_EMIT_BUTTON_CLASS}" ${APP_EXT_BUTTON_PROP}="${prop}">Emit</button>`;
      break;
    case "String":
    case "Number":
      html = `
          <span class="${APP_EXT_PROP_VALUE_SPAN_CLASS}">${value}</span>
          <input type="text" class="${APP_EXT_PROP_VALUE_INPUT_CLASS}" value="${value}">
          <button class="${APP_EXT_PROP_VALUE_BUTTON_CLASS}" ${APP_EXT_BUTTON_PROP}="${prop}">✏️</button>
          `;
      break;
    default:
      html = value;
      break;
  }
  return html;
}

function listenForSelect(): void {
  const selectList = document.getElementsByClassName("select-class");
  if (selectList.length) {
    for (let i = 0; i < selectList.length; i++) {
      const selectElement = selectList.item(i);
      selectElement.addEventListener("change", (event) => {
        const properties = getProperties(activeNgComponent);
        const activeProp = (event.target as any).value;

        const selectNextDiv = selectElement.nextElementSibling;

        let html = "<table><tbody>";

        if (activeProp) {
          html +=
            "<tr><th>" +
            activeProp +
            "</th><td>" +
            getPropertyHTML(
              activeProp,
              properties[activeProp],
              activeNgComponent
            ) +
            "</td></tr>";
        }

        html += "</tbody></table>";
        selectNextDiv.innerHTML = html;
        listenForEmit();
        listenForValueChange();
      });
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
          if (activeNgComponent) {
            const inputValue = ((event.target as Element)
              .previousElementSibling as HTMLInputElement).value;
            if (inputValue) {
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
          if (valueButton.innerHTML !== "✏️") {
            const prop = (event.target as Element).getAttribute(
              APP_EXT_BUTTON_PROP
            );
            if (activeNgComponent) {
              const inputValue = ((event.target as Element)
                .previousElementSibling as HTMLInputElement).value;
              if (inputValue) {
                activeNgComponent[prop] = inputValue;
                ng.applyChanges(activeNgComponent);
              } else {
              }
            } else {
            }
          } else {
            valueButton.innerHTML = "Update";
            (document
              .getElementsByClassName(APP_EXT_PROP_VALUE_INPUT_CLASS)
              .item(i) as HTMLElement).style.display = "inline-block";
            (document
              .getElementsByClassName(APP_EXT_PROP_VALUE_SPAN_CLASS)
              .item(i) as HTMLElement).style.display = "none";
          }
        });
      } else {
      }
    }
  }
}

function destroyTippy(): void {
  singletonInstance.disable();
}
