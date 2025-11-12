import { fireEvent, screen, waitFor } from '@testing-library/react';
import { Routes, Route } from 'react-router-dom';

import AllPerks from '../src/pages/AllPerks.jsx';
import { renderWithRouter } from './utils/renderWithRouter.js';

describe('AllPerks page (Directory)', () => {
  test('lists public perks and responds to name filtering', async () => {
    // ✅ Correct global key
    const seededPerk = global.__TEST_CONTEXT__?.seededPerk;
    if (!seededPerk) {
      throw new Error(
        'Missing __TEST_CONTEXT__. Run tests via the repo runner (e.g. `npx node@18.20.3 tests/runWithServer.mjs`)'
      );
    }

    renderWithRouter(
      <Routes>
        <Route path="/explore" element={<AllPerks />} />
      </Routes>,
      { initialEntries: ['/explore'] }
    );

    // Wait for loading to finish
    await waitFor(
      () => expect(screen.queryByText('Loading perks...')).not.toBeInTheDocument(),
      { timeout: 10000 }
    );

    // Wait for perks to appear
    await waitFor(
      () => expect(screen.getByText(seededPerk.title)).toBeInTheDocument(),
      { timeout: 10000 }
    );

    // Apply name filter
    const nameFilter = screen.getByPlaceholderText('Enter perk name...');
    fireEvent.change(nameFilter, { target: { value: seededPerk.title } });

    await waitFor(
      () => expect(screen.queryByText('Searching...')).not.toBeInTheDocument(),
      { timeout: 10000 }
    );

    await waitFor(
      () => expect(screen.getByText(seededPerk.title)).toBeInTheDocument(),
      { timeout: 10000 }
    );

    expect(screen.getByText(/showing/i)).toHaveTextContent('Showing');
  });

  test('lists public perks and responds to merchant filtering', async () => {
    // ✅ Correct global key
    const seededPerk = global.__TEST_CONTEXT__?.seededPerk;
    if (!seededPerk) {
      throw new Error(
        'Missing __TEST_CONTEXT__. Run tests via the repo runner (e.g. `npx node@18.20.3 tests/runWithServer.mjs`)'
      );
    }

    renderWithRouter(
      <Routes>
        <Route path="/explore" element={<AllPerks />} />
      </Routes>,
      { initialEntries: ['/explore'] }
    );

    await waitFor(
      () => expect(screen.queryByText('Loading perks...')).not.toBeInTheDocument(),
      { timeout: 10000 }
    );

    await waitFor(
      () => expect(screen.getByText(seededPerk.title)).toBeInTheDocument(),
      { timeout: 10000 }
    );

    // Get merchant name safely
    const merchantLabel =
      seededPerk?.merchant?.name ??
      seededPerk?.merchantName ??
      seededPerk?.merchantTitle ??
      seededPerk?.merchant;

    const merchantSelect = screen.getByRole('combobox');

    // Change value in dropdown (native <select> expected)
    const options = merchantSelect.querySelectorAll('option');
    const match = Array.from(options).find(
      (opt) => opt.textContent.trim() === String(merchantLabel).trim()
    );
    const valueToSet = match ? match.value : String(merchantLabel);
    fireEvent.change(merchantSelect, { target: { value: valueToSet } });

    await waitFor(
      () => expect(screen.queryByText('Searching...')).not.toBeInTheDocument(),
      { timeout: 10000 }
    );

    await waitFor(
      () => expect(screen.getByText(seededPerk.title)).toBeInTheDocument(),
      { timeout: 10000 }
    );

    expect(screen.getByText(/showing/i)).toHaveTextContent('Showing');
  });
});
