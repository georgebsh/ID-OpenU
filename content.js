// Fills the saved ID on the Open University login page, and saves it the first time you type it.
// The ID is kept in chrome.storage.local: on this computer only, never sent anywhere.
(() => {
  const KEY = "openuId";
  const SELECTOR = "#p_mis_student, input[name='p_mis_student']";

  function setValue(input, value) {
    // Use the native setter so any page scripts notice the change.
    const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value").set;
    setter.call(input, value);
    input.dispatchEvent(new Event("input", { bubbles: true }));
    input.dispatchEvent(new Event("change", { bubbles: true }));
  }

  function save(input) {
    const id = input.value.replace(/\D/g, "");
    if (id.length >= 5) chrome.storage.local.set({ [KEY]: id });
  }

  function setup(input) {
    if (input.dataset.openuAutofill) return;
    input.dataset.openuAutofill = "1";

    chrome.storage.local.get(KEY, (data) => {
      if (data[KEY] && !input.value) setValue(input, data[KEY]);
    });

    input.addEventListener("change", () => save(input));
    if (input.form) input.form.addEventListener("submit", () => save(input), true);
  }

  const existing = document.querySelector(SELECTOR);
  if (existing) {
    setup(existing);
  } else {
    // In case the form is drawn after the page loads.
    const observer = new MutationObserver(() => {
      const input = document.querySelector(SELECTOR);
      if (input) { observer.disconnect(); setup(input); }
    });
    observer.observe(document.documentElement, { childList: true, subtree: true });
    setTimeout(() => observer.disconnect(), 15000);
  }
})();
