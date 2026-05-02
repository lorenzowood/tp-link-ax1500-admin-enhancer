# TP-Link AX1500 Admin Enhancer

A Chrome extension that enhances the admin interface of the TP-Link AX1500 router.

## Features

### Copy DHCP address reservations

On the DHCP Server page (`Advanced → Network → DHCP Server`), a **Copy as** button and format selector appear above the Address Reservation table.

- Click **Copy as** to copy the reservation list in the currently selected format.
- Changing the format dropdown also copies immediately — the chosen format is always already on the clipboard.
- Formats: **Markdown** (pipe table), **CSV**, **Plain text** (space-aligned, monospace-friendly).
- Brief confirmation ("✓ Copied Markdown" etc.) appears in place of the button for two seconds.

The extension works with any hostname pointing to the router (IP address, local DNS name, etc.).

## Installation

No build step is required — the extension is plain JavaScript.

1. Clone this repository
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable **Developer mode** (toggle in top right)
4. Click **Load unpacked** and select this directory

After any code change, click the refresh icon on the extension card in `chrome://extensions/`.

## Development

### Running the tests

Open `test/index.html` directly in Chrome (a `file://` URL is fine — no server needed). All tests run in the browser and results are displayed on the page.

### Project structure

```
manifest.json        Chrome extension manifest (MV3)
lib.js               Pure functions: card detection, data extraction, copy formatting
content.js           Browser integration: MutationObserver, DOM injection, clipboard
content.css          Styles for the Copy As UI
test/
  index.html         Test runner (open in browser)
  helpers.js         Minimal assert/describe/it framework
  detection.test.js
  data-extraction.test.js
  copy-format.test.js
  fixtures/
    table-rows.js    HTML fixtures for DOM-based tests
```

## License

MIT
