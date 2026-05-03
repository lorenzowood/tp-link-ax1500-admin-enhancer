// Tests for TplinkEnhancer.findAddressReservationCard.
// These tests were written before the implementation and initially fail
// if lib.js is absent or findAddressReservationCard is not defined.

(() => {
  const { describe, it, assert, assertNull, assertNotNull } = TestRunner;

  function makeRoot(html) {
    const div = document.createElement('div');
    div.innerHTML = html;
    return div;
  }

  describe('findAddressReservationCard', () => {
    it('returns the card when an Address Reservation card is present', () => {
      const root = makeRoot(FIXTURE_AR_CARD_HTML);
      const card = TplinkEnhancer.findAddressReservationCard(root);
      assertNotNull(card, 'Expected a card element');
      assert(card.classList.contains('su-card'), 'Result should have class su-card');
    });

    it('returns null when no su-card exists in the root', () => {
      const root = makeRoot('<div><p>No cards here</p></div>');
      const card = TplinkEnhancer.findAddressReservationCard(root);
      assertNull(card, 'Expected null when no card present');
    });

    it('returns null when a card exists but has a different title', () => {
      const root = makeRoot(FIXTURE_OTHER_CARD_HTML);
      const card = TplinkEnhancer.findAddressReservationCard(root);
      assertNull(card, 'Should not match a card titled "DHCP Server"');
    });

    it('returns null when only a DHCP Client List card is present', () => {
      const root = makeRoot(FIXTURE_CLIENT_LIST_HTML);
      const card = TplinkEnhancer.findAddressReservationCard(root);
      assertNull(card, 'Should not match the DHCP Client List card');
    });

    it('returns the correct card when multiple su-cards are present', () => {
      const root = makeRoot(FIXTURE_BOTH_CARDS_HTML);
      const card = TplinkEnhancer.findAddressReservationCard(root);
      assertNotNull(card, 'Expected to find Address Reservation card');
      const title = card.querySelector('.su-card__title');
      assert(title && title.textContent.trim() === 'Address Reservation',
        'Returned card should have the Address Reservation title');
    });

    it('is not fooled by partial title matches like "Address Reservation Details"', () => {
      const root = makeRoot(`
        <div class="su-card">
          <div class="su-card__title">Address Reservation Details</div>
        </div>
      `);
      const card = TplinkEnhancer.findAddressReservationCard(root);
      assertNull(card, 'Should not match a title that merely contains the expected string');
    });
  });

  describe('findClientListCard', () => {
    it('returns the card when a DHCP Client List card is present', () => {
      const root = makeRoot(FIXTURE_CL_CARD_HTML);
      const card = TplinkEnhancer.findClientListCard(root);
      assertNotNull(card, 'Expected a card element');
      assert(card.classList.contains('su-card'), 'Result should have class su-card');
    });

    it('returns null when no su-card exists in the root', () => {
      const root = makeRoot('<div><p>No cards here</p></div>');
      assertNull(TplinkEnhancer.findClientListCard(root), 'Expected null when no card present');
    });

    it('returns null when only an Address Reservation card is present', () => {
      const root = makeRoot(FIXTURE_AR_CARD_HTML);
      assertNull(TplinkEnhancer.findClientListCard(root), 'Should not match the Address Reservation card');
    });

    it('returns the correct card when multiple su-cards are present', () => {
      const root = makeRoot(FIXTURE_BOTH_CARDS_HTML);
      const card = TplinkEnhancer.findClientListCard(root);
      assertNotNull(card, 'Expected to find DHCP Client List card');
      const title = card.querySelector('.su-card__title');
      assert(title && title.textContent.trim() === 'DHCP Client List',
        'Returned card should have the DHCP Client List title');
    });

    it('does not return the Address Reservation card when both cards are present', () => {
      const root = makeRoot(FIXTURE_BOTH_CARDS_HTML);
      const clCard = TplinkEnhancer.findClientListCard(root);
      const arCard = TplinkEnhancer.findAddressReservationCard(root);
      assert(clCard !== arCard, 'findClientListCard and findAddressReservationCard should return different elements');
    });
  });
})();
