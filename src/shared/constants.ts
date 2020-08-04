export const APP_EXT_CONST = "chrome-ext-ng-properties";
export const APP_EXT_PROP_EMIT_BUTTON_CLASS =
  "chrome-ext-ng-properties-emit-btn";
export const APP_EXT_BUTTON_PROP = "chrome-ext-ng-properties-prop";
export const APP_EXT_PROP_VALUE_SPAN_CLASS =
  "chrome-ext-ng-properties-prop-value";
export const APP_EXT_PROP_VALUE_INPUT_CLASS =
  "chrome-ext-ng-properties-prop-input-value";
export const APP_EXT_PROP_VALUE_BUTTON_CLASS =
  "chrome-ext-ng-properties-value-btn";
export const ACTIVE_TAB_QUERY = { active: true, currentWindow: true };
export const APP_EXT_CONST_STORAGE_KEY_PREFIX = APP_EXT_CONST + "_TABS_";
export const MESSAGES: { [key: string]: string } = {
  "tippy-popper-not-found":
    "Tippy.js is required to run this extension properly.",
};

export function TOOLTIP_HTML(stylesheet: string): string {
  return `
    <div>
      <style scoped>
      .${APP_EXT_CONST}-style {
        ${stylesheet}
      }
      </style>
      <div class="${APP_EXT_CONST}-style">
        <div class="container-fluid">
          <h4>Component:<%= name %></h4>
        </div>
      </div>
    </div>
  `;
}
