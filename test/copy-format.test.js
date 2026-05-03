// Tests for TplinkEnhancer.toMarkdown, toCsv, toPlainText, and format().

(() => {
  const { describe, it, assert, assertEqual } = TestRunner;

  const HEADERS = ['Device Name', 'MAC Address', 'Reserved IP Address'];
  const ROWS = [
    ['browser-vm',     'F2-51-98-86-B2-51', '192.168.0.234'],
    ['',               '70-CD-60-A8-76-2E',  '192.168.0.118'],
    ['Server, Primary', 'BC-24-11-72-78-FB', '192.168.0.106'],
  ];

  describe('toMarkdown', () => {
    it('starts with the correct header row', () => {
      const out = TplinkEnhancer.toMarkdown(HEADERS, ROWS);
      assertEqual(out.split('\n')[0], '| Device Name | MAC Address | Reserved IP Address |');
    });

    it('has a separator row on the second line', () => {
      const out = TplinkEnhancer.toMarkdown(HEADERS, ROWS);
      assertEqual(out.split('\n')[1], '| --- | --- | --- |');
    });

    it('produces one data line per row', () => {
      const out = TplinkEnhancer.toMarkdown(HEADERS, ROWS);
      const lines = out.split('\n');
      assertEqual(lines.length, 2 + ROWS.length, 'header + separator + data rows');
    });

    it('renders empty device name as empty pipe cell', () => {
      const out = TplinkEnhancer.toMarkdown(HEADERS, ROWS);
      const line = out.split('\n')[3]; // row index 1 (0-based, skipping header and sep)
      assert(line.startsWith('|  |'), 'Empty name should produce an empty cell: ' + line);
    });

    it('does not escape commas or quotes in device names', () => {
      const out = TplinkEnhancer.toMarkdown(HEADERS, ROWS);
      assert(out.includes('Server, Primary'), 'Commas are fine in Markdown cells');
    });
  });

  describe('toCsv', () => {
    it('starts with the correct header line', () => {
      const out = TplinkEnhancer.toCsv(HEADERS, ROWS);
      assertEqual(out.split('\n')[0], 'Device Name,MAC Address,Reserved IP Address');
    });

    it('produces one data line per row', () => {
      const out = TplinkEnhancer.toCsv(HEADERS, ROWS);
      assertEqual(out.split('\n').length, 1 + ROWS.length);
    });

    it('renders a simple row as unquoted comma-separated values', () => {
      const out = TplinkEnhancer.toCsv(HEADERS, ROWS);
      assertEqual(out.split('\n')[1], 'browser-vm,F2-51-98-86-B2-51,192.168.0.234');
    });

    it('renders empty device name as an empty field (two adjacent commas)', () => {
      const out = TplinkEnhancer.toCsv(HEADERS, ROWS);
      assert(out.split('\n')[2].startsWith(','), 'Empty name should produce a leading comma');
    });

    it('double-quotes a device name that contains a comma', () => {
      const out = TplinkEnhancer.toCsv(HEADERS, ROWS);
      assert(out.includes('"Server, Primary"'), 'Comma in value must be quoted');
    });

    it('double-quotes a value that contains a double-quote and escapes inner quotes', () => {
      const out = TplinkEnhancer.toCsv(['Name', 'MAC', 'IP'], [['Say "hello"', 'AA-BB-CC-DD-EE-FF', '10.0.0.1']]);
      assert(out.includes('"Say ""hello"""'), 'Internal quotes must be doubled');
    });
  });

  describe('toPlainText', () => {
    it('starts with the correct header line', () => {
      const out = TplinkEnhancer.toPlainText(HEADERS, ROWS);
      const header = out.split('\n')[0];
      assert(header.startsWith('Device Name'), 'Header should start with Device Name');
      assert(header.includes('MAC Address'), 'Header should include MAC Address');
      assert(header.includes('Reserved IP Address'), 'Header should include Reserved IP Address');
    });

    it('produces one line per row plus header', () => {
      const out = TplinkEnhancer.toPlainText(HEADERS, ROWS);
      assertEqual(out.split('\n').length, 1 + ROWS.length);
    });

    it('pads columns so all data lines are the same width as the header', () => {
      const out = TplinkEnhancer.toPlainText(HEADERS, ROWS);
      const lines = out.split('\n');
      const macOffset = lines[0].indexOf('MAC Address');
      for (let i = 1; i < lines.length; i++) {
        const cell = lines[i].slice(macOffset, macOffset + 'F2-51-98-86-B2-51'.length).trim();
        assert(cell.length > 0, `Line ${i} should have content at the MAC column offset`);
      }
    });

    it('does not have trailing spaces on any line', () => {
      const out = TplinkEnhancer.toPlainText(HEADERS, ROWS);
      for (const line of out.split('\n')) {
        assertEqual(line, line.trimEnd(), 'Line should not have trailing spaces: ' + JSON.stringify(line));
      }
    });
  });

  describe('format()', () => {
    it('dispatches to toMarkdown when type is "markdown"', () => {
      const md = TplinkEnhancer.format(HEADERS, ROWS, 'markdown');
      assert(md.startsWith('| Device Name'), 'markdown format should produce a pipe table');
    });

    it('dispatches to toCsv when type is "csv"', () => {
      const csv = TplinkEnhancer.format(HEADERS, ROWS, 'csv');
      assert(csv.startsWith('Device Name,'), 'csv format should produce comma-separated output');
    });

    it('dispatches to toPlainText when type is "plain"', () => {
      const plain = TplinkEnhancer.format(HEADERS, ROWS, 'plain');
      assert(!plain.includes('|') && !plain.includes(','), 'plain format should have no pipes or commas');
    });

    it('defaults to markdown for unknown type', () => {
      const out = TplinkEnhancer.format(HEADERS, ROWS, 'unknown');
      assert(out.startsWith('| Device Name'), 'Unknown type should fall back to markdown');
    });
  });
})();
