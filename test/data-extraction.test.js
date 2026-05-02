// Tests for TplinkEnhancer.extractReservations.

(() => {
  const { describe, it, assert, assertEqual } = TestRunner;

  function makeTable(html) {
    const div = document.createElement('div');
    div.innerHTML = html;
    return div.querySelector('table');
  }

  describe('extractReservations', () => {
    it('returns one object per row', () => {
      const table = makeTable(FIXTURE_TABLE_HTML);
      const rows = TplinkEnhancer.extractReservations(table);
      assertEqual(rows.length, 3, 'Expected 3 rows');
    });

    it('extracts device name from first row', () => {
      const table = makeTable(FIXTURE_TABLE_HTML);
      const rows = TplinkEnhancer.extractReservations(table);
      assertEqual(rows[0].name, 'browser-vm');
    });

    it('extracts MAC address from first row', () => {
      const table = makeTable(FIXTURE_TABLE_HTML);
      const rows = TplinkEnhancer.extractReservations(table);
      assertEqual(rows[0].mac, 'F2-51-98-86-B2-51');
    });

    it('extracts IP address from first row', () => {
      const table = makeTable(FIXTURE_TABLE_HTML);
      const rows = TplinkEnhancer.extractReservations(table);
      assertEqual(rows[0].ip, '192.168.0.234');
    });

    it('returns empty string for device name when the span is empty', () => {
      const table = makeTable(FIXTURE_TABLE_HTML);
      const rows = TplinkEnhancer.extractReservations(table);
      assertEqual(rows[1].name, '', 'Empty device name should be empty string, not undefined or null');
    });

    it('still extracts MAC and IP when device name is empty', () => {
      const table = makeTable(FIXTURE_TABLE_HTML);
      const rows = TplinkEnhancer.extractReservations(table);
      assertEqual(rows[1].mac, '70-CD-60-A8-76-2E');
      assertEqual(rows[1].ip, '192.168.0.118');
    });

    it('extracts device name containing a comma without modification', () => {
      const table = makeTable(FIXTURE_TABLE_HTML);
      const rows = TplinkEnhancer.extractReservations(table);
      assertEqual(rows[2].name, 'Server, Primary');
    });

    it('returns an empty array for a table with no rows', () => {
      const empty = makeTable('<table><tbody></tbody></table>');
      const rows = TplinkEnhancer.extractReservations(empty);
      assertEqual(rows.length, 0);
    });
  });
})();
