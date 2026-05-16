const KEYS = [
  'wdEmail', 'wdPassword',
  'wdFirstName', 'wdLastName', 'wdAddressLine1', 'wdCity', 'wdPostalCode',
  'wdProvince', 'wdCountry', 'wdPhoneNumber', 'wdMobileDevice',
  'wdJobTitle', 'wdCompanyName', 'wdWorkLocation', 'wdCurrentlyWorkHere',
  'wdWorkStartMonth', 'wdWorkStartYear', 'wdWorkEndMonth', 'wdWorkEndYear',
  'wdRoleDescription',
  'wdSchoolName', 'wdDegree', 'wdFieldOfStudy', 'wdGradeAverage',
  'wdEduStartYear', 'wdEduEndYear',
  'wdSkills', 'wdLinkedIn'
];

const ID_MAP = {
  wdEmail:             'email',
  wdPassword:          'password',
  wdFirstName:         'firstName',
  wdLastName:          'lastName',
  wdAddressLine1:      'addressLine1',
  wdCity:              'city',
  wdPostalCode:        'postalCode',
  wdProvince:          'province',
  wdCountry:           'country',
  wdPhoneNumber:       'phoneNumber',
  wdMobileDevice:      'mobileDevice',
  wdJobTitle:          'jobTitle',
  wdCompanyName:       'companyName',
  wdWorkLocation:      'workLocation',
  wdCurrentlyWorkHere: 'currentlyWorkHere',
  wdWorkStartMonth:    'workStartMonth',
  wdWorkStartYear:     'workStartYear',
  wdWorkEndMonth:      'workEndMonth',
  wdWorkEndYear:       'workEndYear',
  wdRoleDescription:   'roleDescription',
  wdSchoolName:        'schoolName',
  wdDegree:            'degree',
  wdFieldOfStudy:      'fieldOfStudy',
  wdGradeAverage:      'gradeAverage',
  wdEduStartYear:      'eduStartYear',
  wdEduEndYear:        'eduEndYear',
  wdSkills:            'skills',
  wdLinkedIn:          'linkedin',
};

// Load saved values into fields
chrome.storage.local.get(KEYS, (data) => {
  for (const [key, elId] of Object.entries(ID_MAP)) {
    const el = document.getElementById(elId);
    if (el && data[key]) el.value = data[key];
  }
});

// Save all fields
document.getElementById('save').addEventListener('click', () => {
  const payload = {};
  for (const [key, elId] of Object.entries(ID_MAP)) {
    const el = document.getElementById(elId);
    if (el) payload[key] = el.value;
  }
  chrome.storage.local.set(payload, () => {
    const status = document.getElementById('status');
    status.textContent = '✓ Saved!';
    setTimeout(() => status.textContent = '', 2000);
  });
});

// Accordion toggle
document.querySelectorAll('.section-toggle').forEach(btn => {
  btn.addEventListener('click', () => {
    const targetId = btn.getAttribute('data-target');
    const body = document.getElementById(targetId);
    const isOpen = body.classList.contains('open');

    // Close all
    document.querySelectorAll('.section-body').forEach(b => b.classList.remove('open'));
    document.querySelectorAll('.section-toggle').forEach(b => b.classList.remove('open'));

    // Open clicked (unless it was already open)
    if (!isOpen) {
      body.classList.add('open');
      btn.classList.add('open');
    }
  });
});