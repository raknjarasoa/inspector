declare const ng: any;

export function isAngularAppRunning(): boolean {
  if (
    typeof ng !== "undefined" &&
    ng.getComponent &&
    typeof ng.getComponent === "function"
  ) {
    return true;
  }
  return false;
}
