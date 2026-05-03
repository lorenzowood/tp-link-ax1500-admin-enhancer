// Tests for TplinkEnhancer.extractReservations and TplinkEnhancer.extractClients.

(() => {
  const { describe, it, assert, assertEqual } = TestRunner;

  function makeTable(html) {
    const div = document.createElement('div');
    div.innerHTML = html;
    return div.querySelector('table');
  }

  describe('extractReservations', () => {
    it('returns the correct headers', () => {
      const table = makeTable(FIXTURE_TABLE_HTML);
      const { headers } = TplinkEnhancer.extractReservations(table);
      assertEqual(headers.join('|'), 'Device Name|MAC Address|Reserved IP Address');
    });

    it('returns one row per table row', () => {
      const table = makeTable(FIXTURE_TABLE_HTML);
      const { rows } = TplinkEnhancer.extractReservations(table);
      assertEqual(rows.length, 3, 'Expected 3 rows');
    });

    it('extracts device name from first row', () => {
      const { rows } = TplinkEnhancer.extractReservations(makeTable(FIXTURE_TABLE_HTML));
      assertEqual(rows[0][0], 'browser-vm');
    });

    it('extracts MAC address from first row', () => {
      const { rows } = TplinkEnhancer.extractReservations(makeTable(FIXTURE_TABLE_HTML));
      assertEqual(rows[0][1], 'F2-51-98-86-B2-51');
    });

    it('extracts IP address from first row', () => {
      const { rows } = TplinkEnhancer.extractReservations(makeTable(FIXTURE_TABLE_HTML));
      assertEqual(rows[0][2], '192.168.0.234');
    });

    it('returns empty string for device name when the span is empty', () => {
      const { rows } = TplinkEnhancer.extractReservations(makeTable(FIXTURE_TABLE_HTML));
      assertEqual(rows[1][0], '', 'Empty device name should be empty string, not undefined or null');
    });

    it('still extracts MAC and IP when device name is empty', () => {
      const { rows } = TplinkEnhancer.extractReservations(makeTable(FIXTURE_TABLE_HTML));
      assertEqual(rows[1][1], '70-CD-60-A8-76-2E');
      assertEqual(rows[1][2], '192.168.0.118');
    });

    it('extracts device name containing a comma without modification', () => {
      const { rows } = TplinkEnhancer.extractReservations(makeTable(FIXTURE_TABLE_HTML));
      assertEqual(rows[2][0], 'Server, Primary');
    });

    it('returns an empty rows array for a table with no rows', () => {
      const { rows } = TplinkEnhancer.extractReservations(makeTable('<table><tbody></tbody></table>'));
      assertEqual(rows.length, 0);
    });
  });

  describe('extractClients', () => {
    it('returns the correct headers', () => {
      const { headers } = TplinkEnhancer.extractClients(makeTable(FIXTURE_CLIENT_TABLE_HTML));
      assertEqual(headers.join('|'), 'Device Name|MAC Address|Assigned IP Address|Lease Time');
    });

    it('returns one row per table row', () => {
      const { rows } = TplinkEnhancer.extractClients(makeTable(FIXTURE_CLIENT_TABLE_HTML));
      assertEqual(rows.length, 2, 'Expected 2 rows');
    });

    it('extracts all four fields from first row', () => {
      const { rows } = TplinkEnhancer.extractClients(makeTable(FIXTURE_CLIENT_TABLE_HTML));
      assertEqual(rows[0][0], 'my-phone');
      assertEqual(rows[0][1], 'A1-B2-C3-D4-E5-F6');
      assertEqual(rows[0][2], '192.168.0.10');
      assertEqual(rows[0][3], '01:23:45');
    });

    it('returns empty string for device name when the span is empty', () => {
      const { rows } = TplinkEnhancer.extractClients(makeTable(FIXTURE_CLIENT_TABLE_HTML));
      assertEqual(rows[1][0], '', 'Empty device name should be empty string');
    });

    it('still extracts MAC, IP and lease time when device name is empty', () => {
      const { rows } = TplinkEnhancer.extractClients(makeTable(FIXTURE_CLIENT_TABLE_HTML));
      assertEqual(rows[1][1], '11-22-33-44-55-66');
      assertEqual(rows[1][2], '192.168.0.20');
      assertEqual(rows[1][3], '00:59:00');
    });

    it('returns an empty rows array for a table with no rows', () => {
      const { rows } = TplinkEnhancer.extractClients(makeTable('<table><tbody></tbody></table>'));
      assertEqual(rows.length, 0);
    });
  });
})();
