const COPY_ICON_SVG = `<svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" role="img" class="webui-icons" width="1em" height="1em" viewBox="0 0 24 24"><path fill="currentColor" d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/></svg>`;

const FORMAT_LABELS = { markdown: 'Markdown', csv: 'CSV', plain: 'Plain text' };

// The CSS max-height:none !important approach fails because the parent .el-scrollbar
// has overflow:hidden in the page stylesheet, clipping the expanded content.
// Setting all three levels via style.setProperty with 'important' beats both the
// page stylesheet and Vue's reactive inline-style updates.
function fixScrollHeight(card) {
  const sp = (el, prop, val) => el && el.style.setProperty(prop, val, 'important');

  const scrollbar = card.querySelector('.su-table__body .el-scrollbar');
  sp(scrollbar, 'overflow', 'visible');
  sp(scrollbar, 'height', 'auto');

  const wrap = card.querySelector('.su-table__body .el-scrollbar__wrap');
  sp(wrap, 'max-height', 'none');
  sp(wrap, 'overflow', 'visible');
  sp(wrap, 'height', 'auto');

  const view = card.querySelector('.su-table__body .el-scrollbar__view');
  sp(view, 'display', 'block');
  sp(view, 'height', 'auto');
  sp(view, 'vertical-align', 'top');
}

// navigator.clipboard is undefined on plain HTTP (router admin pages are not HTTPS).
function copyText(text) {
  if (navigator.clipboard && navigator.clipboard.writeText) {
    return navigator.clipboard.writeText(text);
  }
  return new Promise((resolve, reject) => {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.cssText = 'position:fixed;top:-9999px;left:-9999px;opacity:0;';
    document.body.appendChild(ta);
    ta.focus();
    ta.select();
    try {
      const ok = document.execCommand('copy');
      document.body.removeChild(ta);
      ok ? resolve() : reject(new Error('execCommand copy returned false'));
    } catch (e) {
      document.body.removeChild(ta);
      reject(e);
    }
  });
}

function injectCopyButton(card) {
  const toolbar = card.querySelector('.flex.justify-end');
  if (!toolbar || toolbar.querySelector('.tplink-copy-btn')) return;

  const addBtn = toolbar.querySelector('[data-cy="addDeviceBtn"]');

  const wrapper = document.createElement('div');
  wrapper.className = 'tplink-copy-wrapper';

  const btn = document.createElement('div');
  btn.setAttribute('role', 'button');
  btn.setAttribute('tabindex', '0');
  btn.className = 'su-button--flat is-nowrap tplink-copy-btn';
  btn.innerHTML =
    `<span class="mr-[4px]"><span class="icon">${COPY_ICON_SVG}</span></span>` +
    `<span class="text"> Copy as</span>`;

  const select = document.createElement('select');
  select.className = 'tplink-copy-select';
  [['markdown', 'Markdown'], ['csv', 'CSV'], ['plain', 'Plain text']].forEach(([value, label]) => {
    const opt = document.createElement('option');
    opt.value = value;
    opt.textContent = label;
    select.appendChild(opt);
  });

  let feedbackTimeout = null;

  function showFeedback(label) {
    // Lock the wrapper width before hiding children so the layout doesn't shift.
    wrapper.style.minWidth = wrapper.offsetWidth + 'px';
    btn.style.display = 'none';
    select.style.display = 'none';

    const fb = document.createElement('span');
    fb.className = 'tplink-copy-feedback';
    fb.textContent = `✓ ${label} copied`;
    wrapper.appendChild(fb);

    clearTimeout(feedbackTimeout);
    feedbackTimeout = setTimeout(() => {
      if (fb.parentNode === wrapper) wrapper.removeChild(fb);
      btn.style.display = '';
      select.style.display = '';
      wrapper.style.minWidth = '';
    }, 2000);
  }

  function doCopy() {
    if (btn.style.display === 'none') return; // already showing feedback
    const tableEl = card.querySelector('.su-table__body table');
    if (!tableEl) return;
    const rows = TplinkEnhancer.extractReservations(tableEl);
    const text = TplinkEnhancer.format(rows, select.value);
    const label = FORMAT_LABELS[select.value] || select.value;
    copyText(text)
      .then(() => showFeedback(label))
      .catch(err => console.error('[TP-Link Enhancer] Copy failed:', err));
  }

  btn.addEventListener('click', doCopy);
  btn.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') doCopy();
  });

  wrapper.appendChild(btn);
  wrapper.appendChild(select);

  if (addBtn) {
    toolbar.insertBefore(wrapper, addBtn);
  } else {
    toolbar.appendChild(wrapper);
  }
}

function enhance(card) {
  if (card.dataset.tplinkEnhanced) return;
  card.dataset.tplinkEnhanced = '1';
  card.classList.add('tplink-ar-enhanced');
  fixScrollHeight(card);
  injectCopyButton(card);
}

const observer = new MutationObserver(() => {
  const card = TplinkEnhancer.findAddressReservationCard();
  if (card) enhance(card);
});

observer.observe(document.body, { childList: true, subtree: true });

const existingCard = TplinkEnhancer.findAddressReservationCard();
if (existingCard) enhance(existingCard);
