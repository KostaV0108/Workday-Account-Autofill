# Workday Autofill — Chrome Extension

Using the same email and password for every workday account you make? Yeah same here. What if you didn't though? This autofills your designated email and password everytime you go onto a workday page. Saving you three inputs of time. 
May be updated with more inputs to make workday applications easier since they tend to ask the same handful of questions. 

## Setup

1. Go to `chrome://extensions/` and enable **Developer mode**
2. Click **Load unpacked** and select the project folder
3. Click the extension icon, enter your credentials, and hit **Save**

## Files

| File | Purpose |
|---|---|
| `manifest.json` | Extension config |
| `popup.html` / `popup.js` | UI to save credentials |
| `content.js` | Auto-fills the form on Workday pages |

## Notes

- Credentials are stored locally on your machine via `chrome.storage.local`
- Works on `*.myworkday.com` and `*.myworkdayjobs.com`
- If fields don't fill, open DevTools → Console and check for `[Autofill]` logs
