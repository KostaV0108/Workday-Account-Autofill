function fillField(el, value) {
  if (!el) return false;
  const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
    window.HTMLInputElement.prototype, 'value'
  ).set;
  nativeInputValueSetter.call(el, value);
  el.dispatchEvent(new Event('input', { bubbles: true }));
  el.dispatchEvent(new Event('change', { bubbles: true }));
  el.dispatchEvent(new Event('blur', { bubbles: true }));
  return true;
}

function findInputByLabel(labelText) {

  const labels = document.querySelectorAll('label');
  for (const label of labels) {
    if (label.textContent.trim().startsWith(labelText)) {
   
      if (label.htmlFor) {
        const el = document.getElementById(label.htmlFor);
        if (el) return el;
      }
   
      const el = label.querySelector('input') || label.nextElementSibling?.querySelector('input');
      if (el) return el;
    }
  }
  return null;
}

function fillField(el, value) {
  if (!el) return false;
  el.focus();
  const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
    window.HTMLInputElement.prototype, 'value'
  ).set;
  nativeInputValueSetter.call(el, value);
  ['input', 'change', 'blur', 'keyup'].forEach(evt =>
    el.dispatchEvent(new Event(evt, { bubbles: true }))
  );
  return true;
}

function tryAutofill() {
  const emailEl    = document.getElementById('input-4');
  const passwordEl = document.getElementById('input-5');
  const verifyEl   = document.getElementById('input-6');

  if (!emailEl || !passwordEl || !verifyEl) {
    setTimeout(tryAutofill, 500);
    return;
  }

  chrome.storage.local.get(['wdEmail', 'wdPassword'], (data) => {
    if (!data.wdEmail || !data.wdPassword) {
      console.warn('[Autofill] No credentials saved — open the extension popup and save them first.');
      return;
    }

    fillField(emailEl, data.wdEmail);
    fillField(passwordEl, data.wdPassword);
    fillField(verifyEl, data.wdPassword);
    console.log('[Autofill] Done ✓');
  });
}


tryAutofill();


const observer = new MutationObserver(() => {
  if (document.getElementById('input-4')) tryAutofill();
});
observer.observe(document.body, { childList: true, subtree: true });