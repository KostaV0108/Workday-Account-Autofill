const filled = {
  account: false,
  info: false,
  country: false,
  province: false,
  mobile: false,
};

function fillField(el, value) {
  if (!el || !value) return false;
  el.focus();
  const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
  setter.call(el, value);
  ['input', 'change', 'blur', 'keyup'].forEach(e =>
    el.dispatchEvent(new Event(e, { bubbles: true }))
  );
  return true;
}

function wd(automationId) {
  return document.querySelector(`[data-automation-id="${automationId}"]`);
}

function fillDropdown(automationId, labelFallback, value, doneKey) {
  if (filled[doneKey]) return;

  const trigger = wd(automationId) || Array.from(document.querySelectorAll('label'))
    .find(l => l.textContent.trim().startsWith(labelFallback))
    ?.closest('div')?.querySelector('button, [role="combobox"]');

  if (!trigger) return;

  // Already has the right value — skip
  if (trigger.textContent.trim().toLowerCase().includes(value.toLowerCase())) {
    filled[doneKey] = true;
    return;
  }

  filled[doneKey] = true; // guard before click to block re-entry
  trigger.click();

  setTimeout(() => {
    const options = document.querySelectorAll('[role="option"], [data-automation-id="promptOption"]');
    const match = Array.from(options).find(o =>
      o.textContent.trim().toLowerCase().includes(value.toLowerCase())
    );
    if (match) match.click();
    else {
      console.warn(`[Autofill] No match for "${value}"`);
      filled[doneKey] = false; // allow retry
    }
  }, 600);
}

function tryAutofill() {
  chrome.storage.local.get(
    ['wdEmail','wdPassword','wdFirstName','wdLastName','wdCountry',
     'wdAddressLine1','wdCity','wdProvince','wdPostalCode',
     'wdPhoneNumber','wdMobileDevice'],
    (data) => {

      // --- Account creation (stable automation IDs across all employers) ---
      if (!filled.account) {
        const e = fillField(wd('email'),          data.wdEmail);
        const p = fillField(wd('password'),       data.wdPassword);
        const v = fillField(wd('verifyPassword'), data.wdPassword);
        if (e && p && v) filled.account = true;
      }

      // --- My Information ---
      if (!filled.info) {
        const first  = fillField(document.getElementById('name--legalName--firstName'), data.wdFirstName);
        const last   = fillField(document.getElementById('name--legalName--lastName'),  data.wdLastName);
        const addr   = fillField(document.getElementById('address--addressLine1'),      data.wdAddressLine1);
        const city   = fillField(document.getElementById('address--city'),              data.wdCity);
        const postal = fillField(document.getElementById('address--postalCode'),        data.wdPostalCode);
        const phone  = fillField(document.getElementById('phoneNumber--phoneNumber'),   data.wdPhoneNumber);
        if (first && last && addr && city && postal && phone) filled.info = true;
      }

      // --- Dropdowns ---
      if (data.wdCountry)  fillDropdown('country',  'Country',  data.wdCountry,  'country');
      if (data.wdProvince) fillDropdown('province', 'Province', data.wdProvince, 'province');

      // --- Mobile checkbox ---
      if (!filled.mobile && data.wdMobileDevice) {
        const checkbox = wd('phone-sms-opt-in');
        if (checkbox) {
          const shouldCheck = data.wdMobileDevice.toLowerCase() === 'yes';
          if (checkbox.checked !== shouldCheck) checkbox.click();
          filled.mobile = true;
        }
      }
    }
  );
}

// Reset flags on SPA navigation
let lastUrl = location.href;
new MutationObserver(() => {
  if (location.href !== lastUrl) {
    lastUrl = location.href;
    Object.keys(filled).forEach(k => filled[k] = false);
    setTimeout(tryAutofill, 800);
  }
}).observe(document.body, { childList: true, subtree: true });

tryAutofill();
setTimeout(tryAutofill, 1500);
setTimeout(tryAutofill, 3000);

let debounce;
const observer = new MutationObserver(() => {
  clearTimeout(debounce);
  debounce = setTimeout(tryAutofill, 600);
});
observer.observe(document.body, { childList: true, subtree: true });