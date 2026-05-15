const KEYS = ['wdEmail','wdPassword','wdFirstName','wdLastName','wdCountry',
               'wdAddressLine1','wdCity','wdProvince','wdPostalCode',
               'wdPhoneNumber','wdMobileDevice'];

const ID_MAP = {
  wdEmail: 'email', wdPassword: 'password', wdFirstName: 'firstName',
  wdLastName: 'lastName', wdCountry: 'country', wdAddressLine1: 'addressLine1',
  wdCity: 'city', wdProvince: 'province', wdPostalCode: 'postalCode',
  wdPhoneNumber: 'phoneNumber', wdMobileDevice: 'mobileDevice'
};

chrome.storage.local.get(KEYS, (data) => {
  for (const [key, elId] of Object.entries(ID_MAP)) {
    if (data[key]) document.getElementById(elId).value = data[key];
  }
});

document.getElementById('save').addEventListener('click', () => {
  const payload = {};
  for (const [key, elId] of Object.entries(ID_MAP)) {
    payload[key] = document.getElementById(elId).value;
  }
  chrome.storage.local.set(payload, () => {
    document.getElementById('status').textContent = '✓ Saved!';
    setTimeout(() => document.getElementById('status').textContent = '', 2000);
  });
});