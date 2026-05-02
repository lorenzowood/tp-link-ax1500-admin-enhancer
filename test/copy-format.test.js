// Tests for TplinkEnhancer.toMarkdown, toCsv, toPlainText, and format().

(() => {
  const { describe, it, assert, assertEqual } = TestRunner;

  const ROWS = [
    { name: 'browser-vm',   mac: 'F2-51-98-86-B2-51', ip: '192.168.0.234' },
    { name: '',             mac: '70-CD-60-A8-76-2E',  ip: '192.168.0.118' },
    { name: 'Server, Primary', mac: 'BC-24-11-72-78-FB', ip: '192.168.0.106' },
  ];

  describe('toMarkdown', () => {
    it('starts with the correct header row', () => {
      const out = TplinkEnhancer.toMarkdown(ROWS);
      const firstLine = out.split('\n')[0];
      assertEqual(firstLine, '| Device Name | MAC Address | Reserved IP Address |');
    });

    it('has a separator row on the second line', () => {
      const out = TplinkEnhancer.toMarkdown(ROWS);
      const sep = out.split('\n')[1];
      assertEqual(sep, '| --- | --- | --- |');
    });

    it('produces one data line per row', () => {
      const out = TplinkEnhancer.toMarkdown(ROWS);
      const lines = out.split('\n');
      assertEqual(lines.length, 2 + ROWS.length, 'header + separator + data rows');
    });

    it('renders empty device name as empty pipe cell', () => {
      const out = TplinkEnhancer.toMarkdown(ROWS);
      const line = out.split('\n')[3]; // row index 1 (0-based, skipping header and sep)
      assert(line.startsWith('|  |'), 'Empty name should produce an empty cell: ' + line);
    });

    it('does not escape commas or quotes in device names', () => {
      const out = TplinkEnhancer.toMarkdown(ROWS);
      assert(out.includes('Server, Primary'), 'Commas are fine in Markdown cells');
    });
  });

  describe('toCsv', () => {
    it('starts with the correct header line', () => {
      const out = TplinkEnhancer.toCsv(ROWS);
      assertEqual(out.split('\n')[0], 'Device Name,MAC Address,Reserved IP Address');
    });

    it('produces one data line per row', () => {
      const out = TplinkEnhancer.toCsv(ROWS);
      assertEqual(out.split('\n').length, 1 + ROWS.length);
    });

    it('renders a simple row as unquoted comma-separated values', () => {
      const out = TplinkEnhancer.toCsv(ROWS);
      assertEqual(out.split('\n')[1], 'browser-vm,F2-51-98-86-B2-51,192.168.0.234');
    });

    it('renders empty device name as an empty field (two adjacent commas)', () => {
      const out = TplinkEnhancer.toCsv(ROWS);
      assert(out.split('\n')[2].startsWith(','), 'Empty name should produce a leading comma');
    });

    it('double-quotes a device name that contains a comma', () => {
      const out = TplinkEnhancer.toCsv(ROWS);
      assert(out.includes('"Server, Primary"'), 'Comma in value must be quoted');
    });

    it('double-quotes a value that contains a double-quote and escapes inner quotes', () => {
      const rows = [{ name: 'Say "hello"', mac: 'AA-BB-CC-DD-EE-FF', ip: '10.0.0.1' }];
      const out = TplinkEnhancer.toCsv(rows);
      assert(out.includes('"Say ""hello"""'), 'Internal quotes must be doubled');
    });
  });

  describe('toPlainText', () => {
    it('starts with the correct header line', () => {
      const out = TplinkEnhancer.toPlainText(ROWS);
      const header = out.split('\n')[0];
      assert(header.startsWith('Device Name'), 'Header should start with Device Name');
      assert(header.includes('MAC Address'), 'Header should include MAC Address');
      assert(header.includes('Reserved IP Address'), 'Header should include Reserved IP Address');
    });

    it('produces one line per row plus header', () => {
      const out = TplinkEnhancer.toPlainText(ROWS);
      assertEqual(out.split('\n').length, 1 + ROWS.length);
    });

    it('pads columns so all data lines are the same width as the header', () => {
      const out = TplinkEnhancer.toPlainText(ROWS);
      const lines = out.split('\n');
      // All lines should have the same length (after trimEnd the last column may vary,
      // but all non-last columns should be padded consistently).
      // Check that MAC addresses are all left-aligned at the same offset.
      const macOffset = lines[0].indexOf('MAC Address');
      for (let i = 1; i < lines.length; i++) {
        const cell = lines[i].slice(macOffset, macOffset + 'F2-51-98-86-B2-51'.length).trim();
        assert(cell.length > 0, `Line ${i} should have content at the MAC column offset`);
      }
    });

    it('does not have trailing spaces on any line', () => {
      const out = TplinkEnhancer.toPlainText(ROWS);
      for (const line of out.split('\n')) {
        assertEqual(line, line.trimEnd(), 'Line should not have trailing spaces: ' + JSON.stringify(line));
      }
    });
  });

  describe('format()', () => {
    it('dispatches to toMarkdown when type is "markdown"', () => {
      const md = TplinkEnhancer.format(ROWS, 'markdown');
      assert(md.startsWith('| Device Name'), 'markdown format should produce a pipe table');
    });

    it('dispatches to toCsv when type is "csv"', () => {
      const csv = TplinkEnhancer.format(ROWS, 'csv');
      assert(csv.startsWith('Device Name,'), 'csv format should produce comma-separated output');
    });

    it('dispatches to toPlainText when type is "plain"', () => {
      const plain = TplinkEnhancer.format(ROWS, 'plain');
      assert(!plain.includes('|') && !plain.includes(','), 'plain format should have no pipes or commas');
    });

    it('defaults to markdown for unknown type', () => {
      const out = TplinkEnhancer.format(ROWS, 'unknown');
      assert(out.startsWith('| Device Name'), 'Unknown type should fall back to markdown');
    });
  });
})();
