window.TplinkEnhancer = (() => {
  // Finds the Address Reservation card by its title text.
  // Accepts an optional root element for testability (defaults to document).
  function findAddressReservationCard(root) {
    root = root || document;
    for (const el of root.querySelectorAll('.su-card__title')) {
      if (el.textContent.trim() === 'Address Reservation') {
        return el.closest('.su-card');
      }
    }
    return null;
  }

  // Extracts reservation rows from the Address Reservation <table> element.
  // Returns an array of { name, mac, ip }.
  function extractReservations(tableEl) {
    const rows = tableEl.querySelectorAll('tbody tr.su-table__row');
    return Array.from(rows).map(row => {
      const cols = row.querySelectorAll('td.su-table__column');
      const name = (cols[0] && cols[0].querySelector('.show-space'))
        ? cols[0].querySelector('.show-space').textContent.trim()
        : '';
      const mac = (cols[1] && cols[1].querySelector('span[dir="ltr"]'))
        ? cols[1].querySelector('span[dir="ltr"]').textContent.trim()
        : '';
      const ip = (cols[2] && cols[2].querySelector('.su-table__column-content'))
        ? cols[2].querySelector('.su-table__column-content').textContent.trim()
        : '';
      return { name, mac, ip };
    });
  }

  function toMarkdown(rows) {
    const headers = ['Device Name', 'MAC Address', 'Reserved IP Address'];
    const lines = [
      '| ' + headers.join(' | ') + ' |',
      '| ' + headers.map(() => '---').join(' | ') + ' |',
    ];
    for (const r of rows) {
      lines.push('| ' + [r.name, r.mac, r.ip].join(' | ') + ' |');
    }
    return lines.join('\n');
  }

  function toCsv(rows) {
    function esc(v) {
      return /[,"\n]/.test(v) ? '"' + v.replace(/"/g, '""') + '"' : v;
    }
    const header = 'Device Name,MAC Address,Reserved IP Address';
    const body = rows.map(r => [r.name, r.mac, r.ip].map(esc).join(','));
    return [header, ...body].join('\n');
  }

  function toPlainText(rows) {
    const headers = ['Device Name', 'MAC Address', 'Reserved IP Address'];
    const allRows = [headers, ...rows.map(r => [r.name, r.mac, r.ip])];
    const widths = headers.map((_, i) =>
      Math.max(...allRows.map(row => row[i].length))
    );
    return allRows
      .map(row => row.map((cell, i) => cell.padEnd(widths[i])).join('  ').trimEnd())
      .join('\n');
  }

  function format(rows, type) {
    if (type === 'csv') return toCsv(rows);
    if (type === 'plain') return toPlainText(rows);
    return toMarkdown(rows);
  }

  return { findAddressReservationCard, extractReservations, toMarkdown, toCsv, toPlainText, format };
})();
