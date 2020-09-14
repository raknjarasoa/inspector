import tippy, { Instance, Props } from "tippy.js";
import { APP_EXT_CONST } from "../../constants";
import { buildHTML } from "../html-generators";
import { componentNotFoundHTML } from "../html-generators/not-found";
import { getNgComponent } from "../shared";
import { stopListenForBoolean } from "./boolean-checkbox";
import { listenForCloseButton, stopListenForCloseButton } from "./close-button";
import { stopListenForValueChange } from "./edit-button";
import { stopListenForEmit } from "./emit-button";
import { listenForSelect, stopListenForSelect } from "./select";
import { listenForRadio, stopListenForRadio } from "./type-radio";
import { stopListenForObjectUpdate } from "./update-button";

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
 * Start listening to `contextmenu` of `document`. Fetch the target and find the Angular component
 * for it, by traversing to the top-level of `event.target` using `parentElement`. Then find Angular
 * component's properties and show a popover with all controls.
 *
 */
export function startContextMenuListen(runTimeData: RunTimeData): void {
  document.addEventListener("contextmenu", handleContextMenu(runTimeData));
}

export function stopDocumentContextMenuListen(runTimeData: RunTimeData): void {
  document.removeEventListener("contextmenu", handleContextMenu(runTimeData));
}

export function handleContextMenu(
  runTimeData: RunTimeData
): (this: Document, ev: MouseEvent) => any {
  return async (ev: MouseEvent) => {
    oldActivePopoverIndex = activePopoverIndex;
    const element = ev.target as Element;
    if (element !== activeTarget) {
      activeTarget = element;
      const nGComponent = getNgComponent(element);
      const attributeValue = element.getAttribute(
        "data-chrome-ext-ng-properties"
      );
      activePopoverIndex = attributeValue ? parseInt(attributeValue, 10) : -1;
      if (nGComponent) {
        activeNgComponent = nGComponent;
        if (activePopoverIndex < 0) {
          let html = await buildHTML(
            nGComponent,
            activePopovers.length + 1 + "",
            runTimeData
          );
          const tippyInstance = tippy(element, {
            ...defaultTippyOptions,
            content: html,
            onShown: () => {
              listenForRadio(activeNgComponent);
              listenForSelect(activeNgComponent);
              listenForCloseButton(activePopovers, activePopoverIndex);
            },
            onHidden: () => {
              stopListening(
                activeNgComponent,
                activePopovers,
                activePopoverIndex
              );
            },
          });
          activePopovers.push(tippyInstance);
          activePopoverIndex = activePopovers.length - 1;
          element.setAttribute(APP_EXT_CONST, activePopovers.length - 1 + "");
        } else {
          if (activePopovers[activePopoverIndex]) {
            let html = await buildHTML(
              nGComponent,
              activePopoverIndex + "",
              runTimeData
            );
            activePopovers[activePopoverIndex].setProps({
              content: html,
              onShown: () => {
                listenForRadio(activeNgComponent);
                listenForSelect(activeNgComponent);
                listenForCloseButton(activePopovers, activePopoverIndex);
              },
              onHidden: () => {
                stopListening(
                  activeNgComponent,
                  activePopovers,
                  activePopoverIndex
                );
              },
            });
          }
        }
      } else {
        let html = componentNotFoundHTML();
        const tippyInstance = tippy(element, {
          ...defaultTippyOptions,
          content: html,
          onShown: () => {
            listenForCloseButton(activePopovers, activePopoverIndex);
          },
        });
        activePopovers.push(tippyInstance);
        activePopoverIndex = activePopovers.length - 1;
        element.setAttribute(APP_EXT_CONST, activePopovers.length - 1 + "");
      }
    }
  };
}

function stopListening(
  activeNgComponent: any,
  activePopovers: Instance[],
  activePopoverIndex: number
) {
  stopListenForBoolean(activeNgComponent);
  stopListenForCloseButton(activePopovers, activePopoverIndex);
  stopListenForEmit(activeNgComponent);
  stopListenForObjectUpdate(activeNgComponent);
  stopListenForRadio(activeNgComponent);
  stopListenForSelect(activeNgComponent);
  stopListenForValueChange(activeNgComponent);
}
