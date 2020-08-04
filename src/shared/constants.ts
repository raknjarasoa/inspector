export const APP_EXT_CONST = "chrome-ext-ng-properties";
export const APP_EXT_PROP_EMIT_BUTTON_CLASS =
  "chrome-ext-ng-properties-emit-btn";
export const APP_EXT_BUTTON_PROP = "chrome-ext-ng-properties-prop";
export const APP_EXT_PROP_VALUE_SPAN_CLASS =
  "chrome-ext-ng-properties-prop-value";
export const APP_EXT_PROP_VALUE_INPUT_CLASS =
  "chrome-ext-ng-properties-prop-input-value";
export const APP_EXT_PROP_VALUE_TEXTAREA_CLASS =
  "chrome-ext-ng-properties-prop-textarea-value";
export const APP_EXT_PROP_VALUE_BUTTON_CLASS =
  "chrome-ext-ng-properties-value-btn";
export const APP_EXT_PROP_SELECT_CLASS = "chrome-ext-ng-properties-select";
export const APP_EXT_PROP_VIEW_CLASS = "chrome-ext-ng-properties-view";
export const APP_EXT_PROP_OUTPUT_JSON_ID = 'chrome-ext-ng-properties-prop-is-json'
export const ACTIVE_TAB_QUERY = { active: true, currentWindow: true };
export const APP_EXT_CONST_STORAGE_KEY_PREFIX = APP_EXT_CONST + "_TABS_";
export const MESSAGES: { [key: string]: string } = {
  "tippy-popper-not-found":
    "Tippy.js is required to run this extension properly.",
};

export function TOOLTIP_HTML(runtimeData: runtimeData): string {
  return `
        <div class="${APP_EXT_CONST}">
              <div class="container-fluid pb-3 position-relative">
                <h5>Component: <code class="h4"><%= name %></code></h5>
                <h5>Selector: <code class="h4">&lt;<%= selector %>&gt;</code></h5>
                <hr class="my-2">
                <div class="input-group mb-3">
                  <div class="input-group-prepend">
                    <label class="input-group-text" for="propertiesSelect">Properties</label>
                  </div>
                  <select class="custom-select ${APP_EXT_PROP_SELECT_CLASS}" id="propertiesSelect" ${APP_EXT_CONST}="<%- propertySelectAttrValue %>">
                    <option selected>Choose...</option>
                    <% for (const prop in properties) { %>
                      <option value="<%- prop %>"><%- prop %></option>
                    <% } %>
                  </select>
                  <div class="w-100"></div>
                  <small class="form-text text-muted d-block">
                    Change the property from above dropdown.
                  </small>
                </div>
                <div class="${APP_EXT_PROP_VIEW_CLASS}"></div>
                <div class="position-absolute" style="bottom: 0;right: 0;">
                  <img src="${runtimeData.paths.assets}/images/ngneat_16.png"><small><small>inspector</small></small>
                </div>
              </div>
        </div>
  `;
}
