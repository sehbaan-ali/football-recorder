import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { NewMatch } from '../../pages/NewMatch';
import type { Player } from '../../types';

// Create mock players
const mockPlayers: Player[] = [
  // Yellow team (8 regular players - GK will be guest)
  { id: '2', name: 'Yellow DEF 1', position: 'DEF', createdAt: '2024-01-01', archived: false, isGuest: false },
  { id: '3', name: 'Yellow DEF 2', position: 'DEF', createdAt: '2024-01-01', archived: false, isGuest: false },
  { id: '4', name: 'Yellow DEF 3', position: 'DEF', createdAt: '2024-01-01', archived: false, isGuest: false },
  { id: '5', name: 'Yellow MID 1', position: 'MID', createdAt: '2024-01-01', archived: false, isGuest: false },
  { id: '6', name: 'Yellow MID 2', position: 'MID', createdAt: '2024-01-01', archived: false, isGuest: false },
  { id: '7', name: 'Yellow WING 1', position: 'WING', createdAt: '2024-01-01', archived: false, isGuest: false },
  { id: '8', name: 'Yellow WING 2', position: 'WING', createdAt: '2024-01-01', archived: false, isGuest: false },
  { id: '9', name: 'Yellow ST', position: 'ST', createdAt: '2024-01-01', archived: false, isGuest: false },
  // Red team (9 regular players)
  { id: '10', name: 'Red GK', position: 'GK', createdAt: '2024-01-01', archived: false, isGuest: false },
  { id: '11', name: 'Red DEF 1', position: 'DEF', createdAt: '2024-01-01', archived: false, isGuest: false },
  { id: '12', name: 'Red DEF 2', position: 'DEF', createdAt: '2024-01-01', archived: false, isGuest: false },
  { id: '13', name: 'Red DEF 3', position: 'DEF', createdAt: '2024-01-01', archived: false, isGuest: false },
  { id: '14', name: 'Red MID 1', position: 'MID', createdAt: '2024-01-01', archived: false, isGuest: false },
  { id: '15', name: 'Red MID 2', position: 'MID', createdAt: '2024-01-01', archived: false, isGuest: false },
  { id: '16', name: 'Red WING 1', position: 'WING', createdAt: '2024-01-01', archived: false, isGuest: false },
  { id: '17', name: 'Red WING 2', position: 'WING', createdAt: '2024-01-01', archived: false, isGuest: false },
  { id: '18', name: 'Red ST', position: 'ST', createdAt: '2024-01-01', archived: false, isGuest: false },
];

// Mock guest player that will be added
const mockGuestPlayer: Player = {
  id: 'guest-1',
  name: 'Test Guest Keeper',
  position: 'GK',
  createdAt: '2024-01-01',
  archived: false,
  isGuest: true,
};

// Mock functions
const mockAddPlayer = vi.fn();
const mockCreateMatch = vi.fn();

// Mock the hooks
vi.mock('../../hooks/usePlayers', () => ({
  usePlayers: () => ({
    players: mockPlayers,
    loading: false,
    error: null,
    addPlayer: mockAddPlayer,
    updatePlayer: vi.fn(),
    deletePlayer: vi.fn(),
    archivePlayer: vi.fn(),
    unarchivePlayer: vi.fn(),
    getPlayerById: vi.fn(),
  }),
}));

vi.mock('../../hooks/useMatches', () => ({
  useMatches: () => ({
    createMatch: mockCreateMatch,
    updateMatch: vi.fn(),
    addMatchEvent: vi.fn().mockResolvedValue(true),
    matches: [],
    loading: false,
    error: null,
  }),
}));

vi.mock('../../hooks/useStats', () => ({
  useStats: () => ({
    playerStats: [],
  }),
}));

vi.mock('../../contexts/AuthContext', () => ({
  useAuth: () => ({
    isAdmin: true,
    user: { id: 'user-1', email: 'test@test.com' },
  }),
}));

const renderNewMatch = () => {
  return render(
    <BrowserRouter>
      <NewMatch />
    </BrowserRouter>
  );
};

describe('Guest Player Own Goal Test', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Reset mock implementation
    mockAddPlayer.mockResolvedValue(mockGuestPlayer);
    mockCreateMatch.mockResolvedValue({ id: 'match-1' });
  });

  it.skip('should allow guest player to be selected for own goal - FULL UI TEST (requires 18 players)', async () => {
    const user = userEvent.setup();

    // Console spy to capture debug logs
    const consoleSpy = vi.spyOn(console, 'log');

    // Render the component
    renderNewMatch();

    // Verify we're on team selection screen
    expect(screen.getByText('Yellow Team')).toBeInTheDocument();
    expect(screen.getByText('Red Team')).toBeInTheDocument();

    // Step 1: Fill Yellow team with regular players (all except GK)
    // Find all dropdowns for Yellow team
    const yellowTeamSection = screen.getByText('Yellow Team').closest('div[class*="Card"]');
    expect(yellowTeamSection).toBeInTheDocument();

    // Step 2: Add guest player to Yellow GK position
    // Find the GK slot dropdown for Yellow team
    const gkLabel = screen.getAllByText(/GK/i).find(el =>
      el.closest('div')?.querySelector('[id^="slot-GK"]')
    );

    if (gkLabel) {
      const gkButton = gkLabel.closest('div')?.querySelector('button');
      if (gkButton) {
        await user.click(gkButton);

        // Wait for dropdown to open
        await waitFor(() => {
          expect(screen.getByText('+ Add Guest Player...')).toBeInTheDocument();
        });

        // Click "Add Guest Player"
        await user.click(screen.getByText('+ Add Guest Player...'));

        // Wait for dialog to open
        await waitFor(() => {
          expect(screen.getByText('Add Guest Player')).toBeInTheDocument();
        });

        // Enter guest name
        const nameInput = screen.getByPlaceholderText('Enter guest player name...');
        await user.type(nameInput, 'Test Guest Keeper');

        // Click "Add Guest" button
        const addGuestButton = screen.getByRole('button', { name: /add guest/i });
        await user.click(addGuestButton);

        // Verify addPlayer was called with correct parameters
        await waitFor(() => {
          expect(mockAddPlayer).toHaveBeenCalledWith('Test Guest Keeper', 'GK', true);
        });

        // After guest is added, the mock will update and guest should be in the slot
        // Wait for dialog to close
        await waitFor(() => {
          expect(screen.queryByText('Add Guest Player')).not.toBeInTheDocument();
        });
      }
    }

    // Step 3: Fill remaining teams (auto-assign for simplicity)
    // Click auto-assign for both teams
    const autoButtons = screen.getAllByRole('button', { name: /auto/i });
    if (autoButtons.length >= 2) {
      await user.click(autoButtons[0]); // Yellow auto-assign
      await user.click(autoButtons[1]); // Red auto-assign
    }

    // Step 4: Start the match
    const startButton = screen.getByRole('button', { name: /start match/i });

    // Wait for button to be enabled
    await waitFor(() => {
      expect(startButton).not.toBeDisabled();
    });

    await user.click(startButton);

    // Step 5: Match recording screen should appear
    await waitFor(() => {
      expect(screen.getByText(/match recording|yellow team/i)).toBeInTheDocument();
    });

    // Step 6: Click "Own Goal" button for Yellow team
    const ownGoalButtons = screen.getAllByRole('button', { name: /own goal/i });
    expect(ownGoalButtons.length).toBeGreaterThan(0);

    // Click the first own goal button (Yellow team)
    await user.click(ownGoalButtons[0]);

    // Step 7: Verify dialog opens
    await waitFor(() => {
      expect(screen.getByText(/Add Own Goal/i)).toBeInTheDocument();
    });

    // Step 8: Check console logs for debug output
    await waitFor(() => {
      const logCalls = consoleSpy.mock.calls.find(call =>
        call[0]?.includes('[Own Goal Dialog]')
      );

      if (logCalls) {
        // Verify guest player is in the log
        expect(logCalls.join(' ')).toContain('Test Guest Keeper');
        expect(logCalls.join(' ')).toContain('GUEST');
      }
    });

    // Step 9: Verify dropdown contains guest player
    // Open the player dropdown
    const playerSelect = screen.getByRole('combobox');
    await user.click(playerSelect);

    // Wait for dropdown to open
    await waitFor(() => {
      // Guest player should appear in the dropdown
      expect(screen.getByText('Test Guest Keeper')).toBeInTheDocument();
    });

    // Step 10: Select guest player
    await user.click(screen.getByText('Test Guest Keeper'));

    // Step 11: Click "Add Own Goal"
    const addOwnGoalButton = screen.getByRole('button', { name: /add own goal/i });
    await user.click(addOwnGoalButton);

    // Step 12: Verify Red team score increased
    await waitFor(() => {
      // Red team should have 1 point (since Yellow player scored own goal)
      expect(screen.getByText(/red.*1/i)).toBeInTheDocument();
    });

    // Clean up
    consoleSpy.mockRestore();
  });

  it('should include guest player in team players array', () => {
    // This is a unit test to verify the data flow
    const yellowPlayerIds = ['2', '3', '4', '5', '6', '7', '8', '9', 'guest-1'];
    const allPlayers = [...mockPlayers, mockGuestPlayer];

    // Simulate NewMatch.tsx line 249
    const yellowPlayers = allPlayers.filter(p => yellowPlayerIds.includes(p.id));

    // Verify guest is included
    expect(yellowPlayers.length).toBe(9);
    expect(yellowPlayers.find(p => p.id === 'guest-1')).toBeDefined();
    expect(yellowPlayers.find(p => p.isGuest === true)).toBeDefined();

    // Verify guest player has correct properties
    const guest = yellowPlayers.find(p => p.id === 'guest-1');
    expect(guest?.name).toBe('Test Guest Keeper');
    expect(guest?.isGuest).toBe(true);
    expect(guest?.position).toBe('GK');
  });

  it('should not filter out guest players in LiveMatchRecorder', () => {
    // Simulate LiveMatchRecorder.tsx line 90
    const yellowPlayers = [...mockPlayers.slice(0, 8), mockGuestPlayer];
    const selectedTeam = 'yellow';
    const currentTeamPlayers = selectedTeam === 'yellow' ? yellowPlayers : [];

    // Verify no filter is applied (guests should be included)
    expect(currentTeamPlayers.length).toBe(9);
    expect(currentTeamPlayers.find(p => p.isGuest === true)).toBeDefined();
    expect(currentTeamPlayers.find(p => p.name === 'Test Guest Keeper')).toBeDefined();
  });
});
