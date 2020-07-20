declare const ng: any;

export function isAngular(): boolean {
  if (
    typeof ng !== "undefined" &&
    ng.getComponent &&
    typeof ng.getComponent === "function"
  ) {
    return true;
  }
  return false;
}

if (isAngular()) {
  window.postMessage({ isAngular: true }, "*");
} else {
  window.postMessage({ isAngular: false }, "*");
}
