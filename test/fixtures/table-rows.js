// Minimal HTML for a 3-row Address Reservation table, mirroring the real DOM structure.
// Row 2 has an empty device name; row 3 has a comma in the device name (CSV edge case).
window.FIXTURE_TABLE_HTML = `
<table role="rowgroup" class="su-table__body-table">
  <tbody role="none">
    <tr class="su-table__row">
      <td class="su-table__column"><div class="su-table__column-spacing"><div class="su-table__column-content direction-left"><span class="show-space">browser-vm</span></div></div></td>
      <td class="su-table__column"><div class="su-table__column-spacing"><div class="su-table__column-content direction-left"><span dir="ltr">F2-51-98-86-B2-51</span></div></div></td>
      <td class="su-table__column"><div class="su-table__column-spacing"><div class="su-table__column-content direction-left">192.168.0.234</div></div></td>
      <td class="su-table__column"><div>status</div></td>
      <td class="su-table__column"><div>modify</div></td>
    </tr>
    <tr class="su-table__row">
      <td class="su-table__column"><div class="su-table__column-spacing"><div class="su-table__column-content direction-left"><span class="show-space"></span></div></div></td>
      <td class="su-table__column"><div class="su-table__column-spacing"><div class="su-table__column-content direction-left"><span dir="ltr">70-CD-60-A8-76-2E</span></div></div></td>
      <td class="su-table__column"><div class="su-table__column-spacing"><div class="su-table__column-content direction-left">192.168.0.118</div></div></td>
      <td class="su-table__column"><div>status</div></td>
      <td class="su-table__column"><div>modify</div></td>
    </tr>
    <tr class="su-table__row">
      <td class="su-table__column"><div class="su-table__column-spacing"><div class="su-table__column-content direction-left"><span class="show-space">Server, Primary</span></div></div></td>
      <td class="su-table__column"><div class="su-table__column-spacing"><div class="su-table__column-content direction-left"><span dir="ltr">BC-24-11-72-78-FB</span></div></div></td>
      <td class="su-table__column"><div class="su-table__column-spacing"><div class="su-table__column-content direction-left">192.168.0.106</div></div></td>
      <td class="su-table__column"><div>status</div></td>
      <td class="su-table__column"><div>modify</div></td>
    </tr>
  </tbody>
</table>
`;

// Minimal HTML wrapping for the "Address Reservation" su-card — used for detection tests.
window.FIXTURE_AR_CARD_HTML = `
<div class="su-card">
  <div class="su-card__head">
    <div class="su-card__title-wrapper">
      <div class="su-card__title">Address Reservation</div>
    </div>
  </div>
  <div class="su-card__content">
    <div class="flex justify-end items-center my-[8px]">
      <div role="button" class="su-button--flat is-nowrap" data-cy="addDeviceBtn">
        <span class="text"> Add</span>
      </div>
    </div>
  </div>
</div>
`;

// A page fragment that has a different card title — should NOT be detected.
window.FIXTURE_OTHER_CARD_HTML = `
<div class="su-card">
  <div class="su-card__head">
    <div class="su-card__title-wrapper">
      <div class="su-card__title">DHCP Server</div>
    </div>
  </div>
</div>
`;

// A page fragment with DHCP Client List — should NOT be confused with Address Reservation.
window.FIXTURE_CLIENT_LIST_HTML = `
<div>
  <div class="su-card">
    <div class="su-card__head"><div class="su-card__title-wrapper"><div class="su-card__title">DHCP Client List</div></div></div>
  </div>
</div>
`;

// A page fragment with both cards (mirrors the real page).
window.FIXTURE_BOTH_CARDS_HTML = `
<div>
  <div class="su-card">
    <div class="su-card__head"><div class="su-card__title-wrapper"><div class="su-card__title">DHCP Server</div></div></div>
  </div>
  <div class="su-card" id="ar-card">
    <div class="su-card__head"><div class="su-card__title-wrapper"><div class="su-card__title">Address Reservation</div></div></div>
  </div>
  <div class="su-card">
    <div class="su-card__head"><div class="su-card__title-wrapper"><div class="su-card__title">DHCP Client List</div></div></div>
  </div>
</div>
`;
