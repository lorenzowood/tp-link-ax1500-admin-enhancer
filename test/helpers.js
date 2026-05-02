// Minimal test framework — no dependencies, runs in a plain browser tab.

window.TestRunner = (() => {
  const results = [];
  let currentSuite = '';

  function describe(name, fn) {
    currentSuite = name;
    fn();
    currentSuite = '';
  }

  function it(name, fn) {
    const fullName = currentSuite ? `${currentSuite} > ${name}` : name;
    try {
      fn();
      results.push({ name: fullName, pass: true });
    } catch (e) {
      results.push({ name: fullName, pass: false, error: e.message });
    }
  }

  function assert(condition, message) {
    if (!condition) throw new Error(message || 'Assertion failed');
  }

  function assertEqual(a, b, message) {
    if (a !== b) {
      throw new Error(message || `Expected ${JSON.stringify(a)} to equal ${JSON.stringify(b)}`);
    }
  }

  function assertNull(v, message) {
    if (v !== null) throw new Error(message || `Expected null, got ${JSON.stringify(v)}`);
  }

  function assertNotNull(v, message) {
    if (v === null || v === undefined) throw new Error(message || 'Expected non-null value');
  }

  // Call after all test files have loaded to render output into #results.
  function render() {
    const container = document.getElementById('results');
    if (!container) return;

    const passed = results.filter(r => r.pass).length;
    const failed = results.filter(r => !r.pass).length;

    const summary = document.createElement('p');
    summary.className = failed === 0 ? 'summary pass' : 'summary fail';
    summary.textContent = `${passed} passed, ${failed} failed`;
    container.appendChild(summary);

    for (const r of results) {
      const el = document.createElement('div');
      el.className = 'test ' + (r.pass ? 'pass' : 'fail');
      el.textContent = (r.pass ? '✓ ' : '✗ ') + r.name + (r.error ? ': ' + r.error : '');
      container.appendChild(el);
    }
  }

  return { describe, it, assert, assertEqual, assertNull, assertNotNull, render };
})();
