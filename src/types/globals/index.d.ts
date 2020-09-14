type Properties = {
  inputs: { [key: string]: any };
  outputs: { [key: string]: any };
};

type RunTimeData = {
  paths: { [key in paths]: string };
};

declare enum paths {
  tooltip = "tooltip",
}
