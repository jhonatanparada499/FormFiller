# FormFiller - Chrome Extension

**FormFiller** is a lightweight, open-source Chrome extension designed to speed up the process of filling out web forms. Unlike traditional autofill tools, FormFiller works even on websites that disable autocomplete functionality, which makes it a powerful tool for automating repetitive form submissions.

With predefined user data, FormFiller locates and fills text-based input fields across a variety of form types, even those built with dynamic frameworks like Google Forms or Microsoft Forms.

## Features

- Fills out any text-based input field using predefined data.
- Works on websites that block the `autocomplete` attribute.
- Supports dynamically loaded forms (Google Forms, Microsoft Forms).
- Custom labeling system using nearby `<span>` or `<label>` text.
- Built to integrate with third-party extensions like "AutoFill Forms".

## Screenshots
![Image](https://github.com/user-attachments/assets/52ecbfc9-ccd6-4081-98e6-da4b630e1b57)

## How It Works

FormFiller injects a content script into the current tab. It scans the DOM for input fields, reads nearby text nodes (like `<span>` or `<label>`) to determine the field's purpose, then applies predefined data accordingly. It also simulates user interaction to bypass restrictions on form fields.

## Installation

1. Clone or download this repository.
2. Open `chrome://extensions/` in Chrome.
3. Enable **Developer mode**.
4. Click **Load unpacked** and select the root folder of this project.

## Development Notes

The script handles dynamically rendered elements by triggering input tagging and form-filling scripts on button press, ensuring compatibility even with late-loaded elements.
