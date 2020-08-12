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
export const APP_EXT_PROP_OUTPUT_JSON_ID =
  "chrome-ext-ng-properties-prop-is-json";
export const APP_EXT_PROP_SELECT_TYPE =
  "chrome-ext-ng-properties-prop-select-type";
export const ACTIVE_TAB_QUERY = { active: true, currentWindow: true };
export const APP_EXT_CONST_STORAGE_KEY_PREFIX = APP_EXT_CONST + "_TABS_";
export const APP_EXT_PROP_BOOLEAN_ID = APP_EXT_CONST + '-boolean-prop';
export const MESSAGES: { [key: string]: string } = {
  "tippy-popper-not-found":
    "Tippy.js is required to run this extension properly.",
};

export function TOOLTIP_HTML(runtimeData: runtimeData): string {
  // TODO: Move content to index.ejs and try to read it
  return `
  <div class="${APP_EXT_CONST}">
  <div class="container-fluid pb-3 position-relative">
    <h5>Component: <code class="h4"><%= name %></code></h5>
    <h5>Selector: <code class="h4">&lt;<%= selector %>&gt;</code></h5>
    <hr class="my-2" />
    <small class="form-text text-muted d-block mb-2 text-center">
      Change the property from below dropdowns.
    </small>
    <div class="container-fluid px-0">
      <div class="row">
        <div class="col-6 border-right">
          <div class="input-group mb-3">
            <div class="input-group-prepend">
              <label class="input-group-text" for="inputsSelect">Inputs</label>
            </div>
            <% if (Object.keys(properties.inputs).length === 0) { %>
            <select
              class="custom-select ${APP_EXT_PROP_SELECT_CLASS}"
              id="inputsSelect"
              ${APP_EXT_CONST}="<%- propertySelectAttrValue %>"
              ${APP_EXT_PROP_SELECT_TYPE}="inputs"
              disabled
            >
              <option selected>Choose...</option>
            </select>
            <% } else { %>
            <select
              class="custom-select ${APP_EXT_PROP_SELECT_CLASS}"
              id="inputsSelect"
              ${APP_EXT_CONST}="<%- propertySelectAttrValue %>"
              ${APP_EXT_PROP_SELECT_TYPE}="inputs"
            >
              <option selected>Choose...</option>
              <% for (const prop in properties.inputs) { %>
              <option value="<%- prop %>"><%- prop %></option>
              <% } %>
            </select>
            <% } %>
          </div>
          <div class="${APP_EXT_PROP_VIEW_CLASS}"></div>
        </div>
        <div class="col-6 border-left">
          <div class="input-group mb-3">
            <div class="input-group-prepend">
              <label class="input-group-text" for="outputsSelect"
                >Outputs</label
              >
            </div>
            <% if (Object.keys(properties.outputs).length === 0) { %>
            <select
              class="custom-select ${APP_EXT_PROP_SELECT_CLASS}"
              id="outputsSelect"
              ${APP_EXT_CONST}="<%- propertySelectAttrValue %>"
              ${APP_EXT_PROP_SELECT_TYPE}="outputs"
              disabled
            >
              <option selected>Choose...</option>
            </select>
            <% } else { %>
            <select
              class="custom-select ${APP_EXT_PROP_SELECT_CLASS}"
              id="outputsSelect"
              ${APP_EXT_CONST}="<%- propertySelectAttrValue %>"
              ${APP_EXT_PROP_SELECT_TYPE}="outputs"
            >
              <option selected>Choose...</option>
              <% for (const prop in properties.outputs) { %>
              <option value="<%- prop %>"><%- prop %></option>
              <% } %>
            </select>
            <% } %>
          </div>
          <div class="${APP_EXT_PROP_VIEW_CLASS}"></div>
        </div>
      </div>
    </div>
  </div>

  <div class="position-absolute" style="bottom: 4px; right: 4px;">
    <img src="${runtimeData.paths.assets}/images/ngneat_16.png" /><small
      ><small><strong>inspector</strong></small></small
    >
  </div>
</div>

  `;
}
