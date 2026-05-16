const filled = {
  account: false,
  info: false,
  country: false,
  province: false,
  mobile: false,
  work: false,
  education: false,
  skills: false,
  linkedin: false,
};

// ─── Helpers ────────────────────────────────────────────────

function fillField(el, value) {
  if (!el || !value) return false;
  el.focus();
  const proto = el.tagName === 'TEXTAREA'
    ? window.HTMLTextAreaElement.prototype
    : window.HTMLInputElement.prototype;
  const setter = Object.getOwnPropertyDescriptor(proto, 'value').set;
  setter.call(el, value);
  ['input', 'change', 'blur', 'keyup'].forEach(e =>
    el.dispatchEvent(new Event(e, { bubbles: true }))
  );
  return true;
}

// Match dynamic IDs like workExperience-6--jobTitle
function byIdPrefix(prefix, suffix) {
  return document.querySelector(`[id^="${prefix}-"][id$="--${suffix}"]`);
}

function wd(automationId) {
  return document.querySelector(`[data-automation-id="${automationId}"]`);
}

// Find Add button by its nearest H4 section heading
function getAddButtonForSection(headingText) {
  const headings = Array.from(document.querySelectorAll('h4'));
  const heading = headings.find(h =>
    h.textContent.trim().toLowerCase() === headingText.toLowerCase()
  );
  if (!heading) return null;

  // Walk up to section container, then find first add-button inside it
  let container = heading.parentElement;
  for (let i = 0; i < 5; i++) {
    const btn = container.querySelector('[data-automation-id="add-button"]');
    if (btn) return btn;
    container = container.parentElement;
    if (!container) break;
  }
  return null;
}

function fillDropdown(labelText, value, doneKey) {
  if (filled[doneKey]) return;

  const labels = Array.from(document.querySelectorAll('label'));
  const label = labels.find(l => l.textContent.trim().startsWith(labelText));
  if (!label) return;

  const container = label.closest('div[class]') || label.parentElement;
  const trigger = container?.querySelector('button, [role="combobox"]');
  if (!trigger) return;

  if (trigger.textContent.trim().toLowerCase().includes(value.toLowerCase())) {
    filled[doneKey] = true;
    return;
  }

  filled[doneKey] = true;
  trigger.click();

  setTimeout(() => {
    const options = document.querySelectorAll('[role="option"], [data-automation-id="promptOption"]');
    const match = Array.from(options).find(o =>
      o.textContent.trim().toLowerCase().includes(value.toLowerCase())
    );
    if (match) match.click();
    else {
      console.warn(`[Autofill] No dropdown match for "${value}"`);
      filled[doneKey] = false;
    }
  }, 700);
}

// ─── Section Fillers ────────────────────────────────────────

function fillAccount(data) {
  if (filled.account) return;
  const e = fillField(wd('email'),          data.wdEmail);
  const p = fillField(wd('password'),       data.wdPassword);
  const v = fillField(wd('verifyPassword'), data.wdPassword);
  if (e && p && v) filled.account = true;
}

function fillInfo(data) {
  if (filled.info) return;
  const first  = fillField(document.getElementById('name--legalName--firstName'), data.wdFirstName);
  const last   = fillField(document.getElementById('name--legalName--lastName'),  data.wdLastName);
  const addr   = fillField(document.getElementById('address--addressLine1'),      data.wdAddressLine1);
  const city   = fillField(document.getElementById('address--city'),              data.wdCity);
  const postal = fillField(document.getElementById('address--postalCode'),        data.wdPostalCode);
  const phone  = fillField(document.getElementById('phoneNumber--phoneNumber'),   data.wdPhoneNumber);
  if (first && last && addr && city && postal && phone) filled.info = true;

  if (data.wdCountry)  fillDropdown('Country',  data.wdCountry,  'country');
  if (data.wdProvince) fillDropdown('Province', data.wdProvince, 'province');

  if (!filled.mobile && data.wdMobileDevice) {
    const checkbox = wd('phone-sms-opt-in');
    if (checkbox) {
      const shouldCheck = data.wdMobileDevice.toLowerCase() === 'yes';
      if (checkbox.checked !== shouldCheck) checkbox.click();
      filled.mobile = true;
    }
  }
}

function fillWorkExperience(data) {
  if (filled.work) return;

  const doFill = () => {
    const jobTitle = byIdPrefix('workExperience', 'jobTitle');
    if (!jobTitle) {
      console.warn('[Autofill] Work experience fields not ready yet');
      return;
    }

    fillField(jobTitle,                                                          data.wdJobTitle);
    fillField(byIdPrefix('workExperience', 'companyName'),                       data.wdCompanyName);
    fillField(byIdPrefix('workExperience', 'location'),                          data.wdWorkLocation);
    fillField(byIdPrefix('workExperience', 'startDate-dateSectionMonth-input'),  data.wdWorkStartMonth);
    fillField(byIdPrefix('workExperience', 'startDate-dateSectionYear-input'),   data.wdWorkStartYear);
    fillField(byIdPrefix('workExperience', 'roleDescription'),                   data.wdRoleDescription);

    const currentlyHere = byIdPrefix('workExperience', 'currentlyWorkHere');
    if (currentlyHere) {
      const shouldCheck = data.wdCurrentlyWorkHere?.toLowerCase() === 'yes';
      if (currentlyHere.checked !== shouldCheck) currentlyHere.click();
    }

    if (data.wdCurrentlyWorkHere?.toLowerCase() !== 'yes') {
      fillField(byIdPrefix('workExperience', 'endDate-dateSectionMonth-input'), data.wdWorkEndMonth);
      fillField(byIdPrefix('workExperience', 'endDate-dateSectionYear-input'),  data.wdWorkEndYear);
    }

    filled.work = true;
    console.log('[Autofill] Work experience filled ✓');
  };

  // Fields already present — fill directly, otherwise click Add
  if (byIdPrefix('workExperience', 'jobTitle')) {
    doFill();
  } else {
    const btn = getAddButtonForSection('Work Experience');
    if (btn) {
      console.log('[Autofill] Clicking Add for Work Experience');
      btn.click();
      setTimeout(doFill, 900);
    } else {
      console.warn('[Autofill] Work Experience Add button not found');
    }
  }
}

function fillEducation(data) {
  if (filled.education) return;

  const doFill = () => {
    const schoolName = byIdPrefix('education', 'schoolName');
    if (!schoolName) {
      console.warn('[Autofill] Education fields not ready yet');
      return;
    }

    fillField(schoolName,                                                          data.wdSchoolName);
    //fillField(byIdPrefix('education', 'fieldOfStudy'),                             data.wdFieldOfStudy); //each application has a filter select menu for these two fields. Resulting in an inconsistent selection. 
    fillField(byIdPrefix('education', 'gradeAverage'),                             data.wdGradeAverage);
    fillField(byIdPrefix('education', 'firstYearAttended-dateSectionYear-input'),  data.wdEduStartYear);
    fillField(byIdPrefix('education', 'lastYearAttended-dateSectionYear-input'),   data.wdEduEndYear);

    if (data.wdDegree) fillDropdown('Degree', data.wdDegree, 'degree');

    filled.education = true;
    console.log('[Autofill] Education filled ✓');
  };

  if (byIdPrefix('education', 'schoolName')) {
    doFill();
  } else {
    const btn = getAddButtonForSection('Education');
    if (btn) {
      console.log('[Autofill] Clicking Add for Education');
      btn.click();
      setTimeout(doFill, 900);
    } else {
      console.warn('[Autofill] Education Add button not found');
    }
  }
}

function fillLinkedIn(data) {
  if (filled.linkedin || !data.wdLinkedIn) return;
  const el = document.querySelector('[id*="linkedIn"], [id*="linkedin"]');
  if (fillField(el, data.wdLinkedIn)) {
    filled.linkedin = true;
    console.log('[Autofill] LinkedIn filled ✓');
  }
}

// ─── Main ───────────────────────────────────────────────────

const ALL_KEYS = [
  'wdEmail','wdPassword',
  'wdFirstName','wdLastName','wdCountry','wdAddressLine1','wdCity',
  'wdProvince','wdPostalCode','wdPhoneNumber','wdMobileDevice',
  'wdJobTitle','wdCompanyName','wdWorkLocation','wdCurrentlyWorkHere',
  'wdWorkStartMonth','wdWorkStartYear','wdWorkEndMonth','wdWorkEndYear',
  'wdRoleDescription',
  'wdSchoolName','wdDegree','wdFieldOfStudy','wdGradeAverage',
  'wdEduStartYear','wdEduEndYear',
  'wdSkills','wdLinkedIn'
];

function tryAutofill() {
  chrome.storage.local.get(ALL_KEYS, (data) => {
    fillAccount(data);
    fillInfo(data);
    fillWorkExperience(data);
    fillEducation(data);
    fillLinkedIn(data);
  });
}

// Reset flags on SPA navigation
let lastUrl = location.href;
new MutationObserver(() => {
  if (location.href !== lastUrl) {
    lastUrl = location.href;
    Object.keys(filled).forEach(k => filled[k] = false);
    console.log('[Autofill] Page changed — resetting flags');
    setTimeout(tryAutofill, 800);
  }
}).observe(document.body, { childList: true, subtree: true });

// Initial runs
tryAutofill();
setTimeout(tryAutofill, 1500);
setTimeout(tryAutofill, 3000);

// Debounced DOM watcher
let debounce;
const observer = new MutationObserver(() => {
  clearTimeout(debounce);
  debounce = setTimeout(() => {
    if (!filled.work || !filled.education || !filled.account) {
      tryAutofill();
    }
  }, 700);
});
observer.observe(document.body, { childList: true, subtree: true });