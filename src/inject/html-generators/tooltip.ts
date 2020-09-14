import {
  APP_EXT_CONST,
  APP_EXT_PROP_TYPE_RADIO_NAME,
  APP_EXT_PROP_SELECT_TYPE,
  APP_EXT_PROP_VIEW_ID,
  APP_EXT_INPUT_SELECT_ID,
  APP_EXT_OUTPUT_SELECT_ID,
} from "../../constants";

export async function tooltipHTML(runTimeData: RunTimeData): Promise<string> {
  return new Promise((resolve, reject) => {
    fetch(runTimeData.paths["index-ejs"])
      .then((response) => response.text())
      .then((data) => resolve(data))
      .catch(() => reject("Unable to generate HTML"));
  });
}
