window.TplinkEnhancer = (() => {

  // --- Card finders ---

  function findCardByTitle(title, root) {
    root = root || document;
    for (const el of root.querySelectorAll('.su-card__title')) {
      if (el.textContent.trim() === title) return el.closest('.su-card');
    }
    return null;
  }

  function findAddressReservationCard(root) {
    return findCardByTitle('Address Reservation', root);
  }

  function findClientListCard(root) {
    return findCardByTitle('DHCP Client List', root);
  }

  // --- Data extraction ---
  // Both extract functions return { headers: string[], rows: string[][] }.

  const AR_HEADERS = ['Device Name', 'MAC Address', 'Reserved IP Address'];

  function extractReservations(tableEl) {
    const rows = Array.from(tableEl.querySelectorAll('tbody tr.su-table__row')).map(row => {
      const cols = row.querySelectorAll('td.su-table__column');
      return [
        (cols[0] && cols[0].querySelector('.show-space'))
          ? cols[0].querySelector('.show-space').textContent.trim() : '',
        (cols[1] && cols[1].querySelector('span[dir="ltr"]'))
          ? cols[1].querySelector('span[dir="ltr"]').textContent.trim() : '',
        (cols[2] && cols[2].querySelector('.su-table__column-content'))
          ? cols[2].querySelector('.su-table__column-content').textContent.trim() : '',
      ];
    });
    return { headers: AR_HEADERS, rows };
  }

  const CL_HEADERS = ['Device Name', 'MAC Address', 'Assigned IP Address', 'Lease Time'];

  function extractClients(tableEl) {
    const rows = Array.from(tableEl.querySelectorAll('tbody tr.su-table__row')).map(row => {
      const cols = row.querySelectorAll('td.su-table__column');
      return [
        (cols[0] && cols[0].querySelector('.show-space'))
          ? cols[0].querySelector('.show-space').textContent.trim() : '',
        (cols[1] && cols[1].querySelector('span[dir="ltr"]'))
          ? cols[1].querySelector('span[dir="ltr"]').textContent.trim() : '',
        (cols[2] && cols[2].querySelector('.su-table__column-content'))
          ? cols[2].querySelector('.su-table__column-content').textContent.trim() : '',
        (cols[3] && cols[3].querySelector('.su-table__column-content'))
          ? cols[3].querySelector('.su-table__column-content').textContent.trim() : '',
      ];
    });
    return { headers: CL_HEADERS, rows };
  }

  // --- Format functions ---
  // All take (headers: string[], rows: string[][]).

  function toMarkdown(headers, rows) {
    const lines = [
      '| ' + headers.join(' | ') + ' |',
      '| ' + headers.map(() => '---').join(' | ') + ' |',
    ];
    for (const row of rows) {
      lines.push('| ' + row.join(' | ') + ' |');
    }
    return lines.join('\n');
  }

  function toCsv(headers, rows) {
    function esc(v) {
      return /[,"\n]/.test(v) ? '"' + v.replace(/"/g, '""') + '"' : v;
    }
    const lines = [headers.join(',')];
    for (const row of rows) lines.push(row.map(esc).join(','));
    return lines.join('\n');
  }

  function toPlainText(headers, rows) {
    const allRows = [headers, ...rows];
    const widths = headers.map((_, i) =>
      Math.max(...allRows.map(row => (row[i] || '').length))
    );
    return allRows
      .map(row => row.map((cell, i) => (cell || '').padEnd(widths[i])).join('  ').trimEnd())
      .join('\n');
  }

  function format(headers, rows, type) {
    if (type === 'csv') return toCsv(headers, rows);
    if (type === 'plain') return toPlainText(headers, rows);
    return toMarkdown(headers, rows);
  }

  return {
    findAddressReservationCard,
    findClientListCard,
    extractReservations,
    extractClients,
    toMarkdown,
    toCsv,
    toPlainText,
    format,
  };
})();
