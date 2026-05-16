# Workday Autofill — Chrome Extension

Inputting the same info for every workday application? Yeah same here. What if you didn't though? This chrome extension takes information you were going to put into the application anyway and does it for you by detecting input fields and filling it with the designated information. 
May be updated with more inputs to make workday applications easier since they tend to ask the same handful of questions. Some are unique unfortunately and cannot be predicted. Although I will try my best.

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

- Information is stored locally on your machine via `chrome.storage.local`
- Works on `*.myworkday.com` and `*.myworkdayjobs.com`
- If fields don't fill, open DevTools → Console and check for `[Autofill]` logs
