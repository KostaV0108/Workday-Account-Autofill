chrome.storage.local.get(['wdEmail', 'wdPassword'], (data) => {
  if (data.wdEmail) document.getElementById('email').value = data.wdEmail;
  if (data.wdPassword) document.getElementById('password').value = data.wdPassword;
});

document.getElementById('save').addEventListener('click', () => {
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  chrome.storage.local.set({ wdEmail: email, wdPassword: password }, () => {
    document.getElementById('status').textContent = '✓ Saved!';
    setTimeout(() => document.getElementById('status').textContent = '', 2000);
  });
});