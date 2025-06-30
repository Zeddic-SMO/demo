// Description: This script creates a popup form that can be triggered by a button click or automatically after a delay.
(function () {
  const script = document.currentScript;
  const FORM_URL =
    script.getAttribute("data-form-url") ||
    "https://forms.circlehq.co/lead-gen-form";
  const BUTTON_TEXT = script.getAttribute("data-button-text") || "Open Form";
  const BUTTON_COLOR = script.getAttribute("data-button-color") || "#0052cc";
  const DELAY = parseInt(script.getAttribute("data-delay"), 10) || null;

  // Inject Styles
  const style = document.createElement("style");
  style.textContent = `
    #circlehq-popup-button {
      position: fixed;
      bottom: 20px;
      right: 20px;
      background: ${BUTTON_COLOR};
      color: white;
      padding: 12px 20px;
      border-radius: 8px;
      border: none;
      font-size: 14px;
      cursor: pointer;
      z-index: 10000;
    }
    #circlehq-popup-wrapper {
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      background: rgba(0, 0, 0, 0.5);
      display: none;
      justify-content: center;
      align-items: center;
      z-index: 9999;
    }
    #circlehq-popup-iframe {
      width: 400px;
      height: 550px;
      border: none;
      border-radius: 10px;
      background: white;
    }
    @media (max-width: 500px) {
      #circlehq-popup-iframe {
        width: 90vw;
        height: 90vh;
      }
    }
  `;
  document.head.appendChild(style);

  // Create wrapper
  const wrapper = document.createElement("div");
  wrapper.id = "circlehq-popup-wrapper";
  wrapper.innerHTML = `<iframe id="circlehq-popup-iframe" src="${FORM_URL}"></iframe>`;
  document.body.appendChild(wrapper);

  // Create button
  const button = document.createElement("button");
  button.id = "circlehq-popup-button";
  button.textContent = BUTTON_TEXT;
  button.style.background = BUTTON_COLOR;
  document.body.appendChild(button);

  // Button open logic
  button.addEventListener("click", () => {
    wrapper.style.display = "flex";
  });

  // Wrapper click to close
  wrapper.addEventListener("click", (e) => {
    if (e.target === wrapper) {
      wrapper.style.display = "none";
    }
  });

  // Listen to postMessage from iframe
  window.addEventListener("message", (event) => {
    const { type, payload } = event.data || {};
    if (type === "CIRCLEHQ_CLOSE_POPUP") {
      wrapper.style.display = "none";
    }
    if (type === "CIRCLEHQ_FORM_SUBMITTED") {
      console.log("✅ Form Submitted:", payload);
      wrapper.style.display = "none";
    }
  });

  // Optional delay auto open
  if (DELAY) {
    setTimeout(() => {
      wrapper.style.display = "flex";
    }, DELAY);
  }
})();
