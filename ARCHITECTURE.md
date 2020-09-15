# Architecture

## Overview

### Functionality

ngneat-inspector is a chrome extension, which helps developers to modify components of an Angular application without changing the code and see the results realtime. Broadly, we are injecting a script which does below things:

1. Check if application is Angular 9+ with [ng-check.ts](./src/inject.inject/ng-check.ts)
2. Listen for right-click on document, which is [`contextmenu`](https://developer.mozilla.org/en-US/docs/Web/API/Element/contextmenu_event) event
3. Grab the event target element with use of `event.target` and store it locally in a variable, say `activeTarget`
4. Pass the `activeTarget` to a function, which returns (using `ng.getComponent` or `ng.geOwningComponent`) a JSON object of all components properties
5. Generate HTML from those properties using [`ejs`](https://ejs.co/)
6. Beautify that HTML with [Bootstrap](https://getbootstrap.com/)
7. And show the HTML in a tooltip using [Tippy.js](https://atomiks.github.io/tippyjs/)

### Build Process

We are using [`gulpfile.js`](./gulpfile.js) to build and generate dist.
