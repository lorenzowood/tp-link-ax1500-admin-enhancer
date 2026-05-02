const COPY_ICON_SVG = `<svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" role="img" class="webui-icons" width="1em" height="1em" viewBox="0 0 24 24"><path fill="currentColor" d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/></svg>`;

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

  function doCopy() {
    const tableEl = card.querySelector('.su-table__body table');
    if (!tableEl) return;
    const rows = TplinkEnhancer.extractReservations(tableEl);
    const text = TplinkEnhancer.format(rows, select.value);
    navigator.clipboard.writeText(text).then(() => {
      const label = btn.querySelector('.text');
      label.textContent = ' Copied!';
      setTimeout(() => { label.textContent = ' Copy as'; }, 1500);
    });
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
  injectCopyButton(card);
}

const observer = new MutationObserver(() => {
  const card = TplinkEnhancer.findAddressReservationCard();
  if (card) enhance(card);
});

observer.observe(document.body, { childList: true, subtree: true });

// Handle the case where content is already in the DOM on script load.
const existingCard = TplinkEnhancer.findAddressReservationCard();
if (existingCard) enhance(existingCard);
