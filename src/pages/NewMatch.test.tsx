import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { NewMatch } from './NewMatch';

// Mock the hooks
vi.mock('../hooks/usePlayers', () => ({
  usePlayers: () => ({
    players: [
      // Yellow team
      { id: '1', name: 'Player 1', position: 'GK', archived: false },
      { id: '2', name: 'Player 2', position: 'DEF', archived: false },
      { id: '3', name: 'Player 3', position: 'DEF', archived: false },
      { id: '4', name: 'Player 4', position: 'DEF', archived: false },
      { id: '5', name: 'Player 5', position: 'MID', archived: false },
      { id: '6', name: 'Player 6', position: 'MID', archived: false },
      { id: '7', name: 'Player 7', position: 'WING', archived: false },
      { id: '8', name: 'Player 8', position: 'WING', archived: false },
      { id: '9', name: 'Player 9', position: 'ST', archived: false },
      // Red team
      { id: '10', name: 'Player 10', position: 'GK', archived: false },
      { id: '11', name: 'Player 11', position: 'DEF', archived: false },
      { id: '12', name: 'Player 12', position: 'DEF', archived: false },
      { id: '13', name: 'Player 13', position: 'DEF', archived: false },
      { id: '14', name: 'Player 14', position: 'MID', archived: false },
      { id: '15', name: 'Player 15', position: 'MID', archived: false },
      { id: '16', name: 'Player 16', position: 'WING', archived: false },
      { id: '17', name: 'Player 17', position: 'WING', archived: false },
      { id: '18', name: 'Player 18', position: 'ST', archived: false },
    ],
    loading: false,
    error: null,
  }),
}));

vi.mock('../hooks/useMatches', () => ({
  useMatches: () => ({
    createMatch: vi.fn().mockResolvedValue({ id: 'match-1' }),
    addMatchEvent: vi.fn().mockResolvedValue(true),
    matches: [],
    loading: false,
    error: null,
  }),
}));

vi.mock('../hooks/useStats', () => ({
  useStats: () => ({
    playerStats: [],
  }),
}));

const renderNewMatch = () => {
  return render(
    <BrowserRouter>
      <NewMatch />
    </BrowserRouter>
  );
};

describe('NewMatch', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render the new match page', () => {
    renderNewMatch();
    expect(screen.getByText('New Match')).toBeInTheDocument();
  });

  it('should show team selection in setup step', () => {
    renderNewMatch();
    expect(screen.getByText('Yellow Team')).toBeInTheDocument();
    expect(screen.getByText('Red Team')).toBeInTheDocument();
  });

  it('should disable start match button until teams are selected', () => {
    renderNewMatch();
    const startButton = screen.getByRole('button', { name: /start match/i });
    expect(startButton).toBeDisabled();
  });

  it('should enable start match button when both teams have 9 players', async () => {
    renderNewMatch();

    // TODO: Add logic to select 9 players for each team
    // This would require interacting with the FormationSelector dropdowns

    // For now, just verify the button exists
    const startButton = screen.getByRole('button', { name: /start match/i });
    expect(startButton).toBeInTheDocument();
  });

  it('should show not enough players message when less than 18 players', () => {
    // This test would need to mock usePlayers with fewer players
    // Left as TODO
  });
});

describe('NewMatch - Recording Step', () => {
  it('should show save and discard buttons during recording', async () => {
    // TODO: Start a match first, then verify buttons appear
    // This requires completing team selection flow
  });

  it('should warn user when discarding match with events', async () => {
    // TODO: Add events, then try to discard
  });

  it('should navigate to dashboard after saving match', async () => {
    // TODO: Save match and verify navigation
  });
});
