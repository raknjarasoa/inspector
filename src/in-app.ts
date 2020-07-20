import { Instance, createSingleton } from "tippy.js";
import {
  APP_EXT_CONST,
  APP_EXT_PROP_EMIT_BUTTON_CLASS,
  APP_EXT_BUTTON_PROP,
  APP_EXT_PROP_VALUE_SPAN_CLASS,
  APP_EXT_PROP_VALUE_INPUT_CLASS,
  APP_EXT_PROP_VALUE_BUTTON_CLASS,
} from "./constants";

declare const ng: any;
declare const tippy: any;

export let activePopovers: Instance[] = [];
let currentTarget: Element = null;
let activeNgComponent: any = null;
export const singletonInstance = createSingleton(activePopovers, {
  moveTransition: "transform 0.3s ease-in-out",
  allowHTML: true,
  arrow: false,
  theme: "light-border",
  appendTo: () => document.body,
  overrides: ["interactive", "onShown", "onHidden", "content"],
});
let destroy = false;

/**
 * Start listening to `mouseover` of `document`. Fetch the hovered target and find the Angular component
 * for it, by traversing to the top-level of `event.target` using `parentElement`. Then find Angular
 * component's properties and show a popover with all controls.
 *
 */
function init(): void {
  document.addEventListener("mouseover", (ev: MouseEvent) => {
    if (!destroy) {
      const element = ev.target as Element;
      const { nGComponent, element: activeElement } = getNgComponent(element);
      const isPopoverActive = parseInt(element.getAttribute(APP_EXT_CONST));
      currentTarget = activeElement;
      if (nGComponent) {
        if (isNaN(isPopoverActive)) {
          const tippyInstance = tippy(element, {
            allowHTML: true,
            arrow: false,
            theme: "light-border",
            interactive: true,
            onShown: () => {
              listenForEmit();
              listenForValueChange();
              activeNgComponent = nGComponent;
            },
            onHidden: () => {
              activeNgComponent = null;
            },
          });
          const properties = getProperties(nGComponent);
          let html = `<h4><strong>Component:</strong>${nGComponent.constructor.name}</h4>`;
          html += `<h4><strong>Selector:</strong>${nGComponent.constructor.decorators[0].args[0].selector}</h4>`;
          html += "<hr/>";
          html += "<table><tbody>";
          for (const prop in properties) {
            html +=
              "<tr><th>" +
              prop +
              "</th><td>" +
              getPropertyHTML(prop, properties[prop], nGComponent) +
              "</td></tr>";
          }
          html += "</tbody></table>";
          tippyInstance.setProps({ content: html });
          activePopovers.push(tippyInstance);
          singletonInstance.setInstances(activePopovers);
          element.setAttribute(APP_EXT_CONST, activePopovers.length - 1 + "");
        } else {
          const properties = getProperties(nGComponent);
          let html = `<h4><strong>Component:</strong>${nGComponent.constructor.name}</h4>`;
          html += `<h4><strong>Selector:</strong>${nGComponent.constructor.decorators[0].args[0].selector}</h4>`;
          html += "<hr/>";
          html += "<table><tbody>";
          for (const prop in properties) {
            html +=
              "<tr><th>" +
              prop +
              "</th><td>" +
              getPropertyHTML(prop, properties[prop], nGComponent) +
              "</td></tr>";
          }
          html += "</tbody></table>";
          activePopovers[isPopoverActive].setProps({ content: html });
          singletonInstance.setInstances(activePopovers);
        }
      }
    }
  });
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

/**
 * As soon as tooltip is shown, we can start listening to `emit buttons`, so that we can
 * capture events and update the component.
 *
 */
function listenForEmit(): void {
  const emitButtonList = document.getElementsByClassName(
    APP_EXT_PROP_EMIT_BUTTON_CLASS
  );
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

/**
 * As soon as tooltip is shown, we can start listening to `edit / update buttons`, so that we can
 * capture events and update the component.
 *
 */
function listenForValueChange(): void {
  const valueButtonList = document.getElementsByClassName(
    APP_EXT_PROP_VALUE_BUTTON_CLASS
  );
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

// let's start
init();

window.addEventListener("message", (event) => {
  if (event.data.command === "destroy") {
    destroy = true;
    destroyTippy();
    window.postMessage({ response: "destroyed" }, "*");
  }
});

function destroyTippy(): void {
  for (let i = 0; i < activePopovers.length; i++) {
    activePopovers[i].destroy();
  }
  activePopovers = [];
  singletonInstance.setInstances([]);
  singletonInstance.destroy();
}
