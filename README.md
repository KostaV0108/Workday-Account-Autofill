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
- Some things are not fully implemented yet such as skills and education. 

- If you think a field is fillable then paste this command into the console to see what the fields are. If `data-automation-id:` has something then it may be automated. If not then tough luck.

```// All inputs
document.querySelectorAll('input, select, textarea').forEach((el, i) => {
  console.log(`Field ${i}:`, {
    tag: el.tagName,
    type: el.type,
    id: el.id,
    'data-automation-id': el.getAttribute('data-automation-id'),
    placeholder: el.placeholder,
    label: document.querySelector(`label[for="${el.id}"]`)?.textContent.trim()
  });
});

// All buttons
document.querySelectorAll('button').forEach((el, i) => {
  console.log(`Button ${i}:`, {
    text: el.textContent.trim(),
    'data-automation-id': el.getAttribute('data-automation-id'),
    class: el.className
  });
});

// All headings
document.querySelectorAll('h1, h2, h3, h4, h5').forEach((el, i) => {
  console.log(`Heading ${i}:`, el.tagName, '→', el.textContent.trim());
});```
