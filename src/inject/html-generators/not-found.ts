import { APP_EXT_CONST } from "../../constants";

export function componentNotFoundHTML(): string {
  return `
    <div class="${APP_EXT_CONST}">
    <div class="position-absolute" style="top: 0px;right: 0px;z-index: 1;">
      <button type="button" class="btn btn-sm" aria-label="Close" id="chrome-ext-ng-properties-close-btn" title="Close inspector">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#6c757d" width="24px" height="24px"><path d="M0 0h24v24H0z" fill="none"></path><path d="M12 2C6.47 2 2 6.47 2 12s4.47 10 10 10 10-4.47 10-10S17.53 2 12 2zm5 13.59L15.59 17 12 13.41 8.41 17 7 15.59 10.59 12 7 8.41 8.41 7 12 10.59 15.59 7 17 8.41 13.41 12 17 15.59z"></path></svg>
      </button>
    </div>
    <div class="container-fluid pb-3 position-relative">
      <h5>Not an Angular component</h5>
      <p>We couldn't find any Angular component for corresponding element.</p>
    </div>
    <div class="position-absolute" style="bottom: 4px; right: 4px;">
    <img
      style="display: inline"
      src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAACnElEQVQ4T42TW0gUYRTH/7MXb+stL2yaq9viJYmySBRKaO0h8iExNHoKrISSihUCkXqo1CAo2B4kvCQGvQSCRBdqoQcfVpBQyFBRTBfZzSx3d3ZnJ2fGucV828ruUtA8nfnOOb9zvvP9D4V/fLmw5joOOp3M+gb/gr3b7Yc/8rdQKulQ327tu9FW2v3AqEsxaT52zkdCdlSBmeAGesaFJ0MAlFgeATQUtNivVz4dzUspsiVXiQHizwPKj5WhXz2XZ6WPbg2gc9lVOT7AVAak7AGMWYAcpCFsyWDXJLCrUgK/lbboSAcuu6rGPDojUNYGcJtAfi3gGw/A3JgGkVEw3xuGGsdopS0UAXywyyIFnUGzrRcARQQCM4DlHMB5Ikgv1kPmVYTnRayNsqSWAlk4T1vTCGCiIbxpMmSbNbv8CsB6gEwrYMgAjBkcNt7xEPwy8utSsdAfJgBGDXovhWpKCWCwds69P/PwCS2h8DiQdwyADAg0kFHIg/VI4HwS/NM7YBZF0s2yOOu6zbacIYCuqhFnU1FHl3Z/20UgtAiIIcB8EuC9DLbcArgNGcZsHRmmGFbwhhu595zvvU8Ap83tZ29Vj73W7MpOIK0AEIIAVEAMssipNoJZEhH5KmHtWXQGzkhno1t6O0kAFTmHbANHv6wSwLXoDLIrAMoAUPI2tqaiHZjKDFgdjgKu0g3Ffqx//6PEknSX3bsde8qSZiDLBvA/gcx9HEILIlQRWHrM7OqglbakagLdlfJY/crn4vTymv9Rok9e+eRgTtVrsQm7UJVVW/XoyOR0qt6UGwPFS5lTWf+dUEvdOpY9CbuQXLVpb0eb48DwSwqUXgOoUCTntqN5Snj1Pjk2eRsT/DcrBh+y3m/sGN/Xn5wY+/8NCHEWIcyJZ9sAAAAASUVORK5CYII="
      alt="ngneat logo"
    /><small
      ><small><strong>inspector</strong></small></small
    >
  </div>
    </div>
    `;
}