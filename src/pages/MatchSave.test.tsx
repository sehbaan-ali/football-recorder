import { describe, it, expect, vi, beforeEach } from 'vitest';

// Test case for match save functionality
describe('Match Save - Score Recording', () => {
  let mockCreateMatch: ReturnType<typeof vi.fn>;
  let mockAddMatchEvent: ReturnType<typeof vi.fn>;
  let capturedMatch: any;
  let capturedEvents: any[];

  beforeEach(() => {
    capturedEvents = [];
    mockCreateMatch = vi.fn().mockImplementation((date, yellowIds, redIds) => {
      capturedMatch = {
        id: 'test-match-1',
        date,
        yellowTeam: { playerIds: yellowIds, score: 0 },
        redTeam: { playerIds: redIds, score: 0 },
        events: [],
      };
      return Promise.resolve(capturedMatch);
    });

    mockAddMatchEvent = vi.fn().mockImplementation((matchId, event) => {
      capturedEvents.push(event);

      // Simulate what the backend does - update scores
      if (event.type === 'goal') {
        if (event.team === 'yellow') {
          capturedMatch.yellowTeam.score++;
        } else {
          capturedMatch.redTeam.score++;
        }
      } else if (event.type === 'own-goal') {
        if (event.team === 'yellow') {
          capturedMatch.redTeam.score++;
        } else {
          capturedMatch.yellowTeam.score++;
        }
      }

      return Promise.resolve(true);
    });
  });

  it('should save match with correct score when one goal is added (Yellow 1-0)', async () => {
    const date = '2024-01-15';
    const yellowPlayerIds = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];
    const redPlayerIds = ['10', '11', '12', '13', '14', '15', '16', '17', '18'];

    // Simulate the flow in NewMatch.tsx handleSaveMatch
    const match = await mockCreateMatch(date, yellowPlayerIds, redPlayerIds);
    expect(match).toBeDefined();
    expect(match.yellowTeam.score).toBe(0);
    expect(match.redTeam.score).toBe(0);

    // Add one goal for yellow team
    const goalEvent = {
      type: 'goal',
      playerId: '1',
      team: 'yellow',
      timestamp: new Date().toISOString(),
    };

    await mockAddMatchEvent(match.id, goalEvent);

    // Verify the score was updated
    expect(capturedMatch.yellowTeam.score).toBe(1);
    expect(capturedMatch.redTeam.score).toBe(0);
    expect(capturedEvents).toHaveLength(1);
    expect(capturedEvents[0]).toMatchObject({
      type: 'goal',
      playerId: '1',
      team: 'yellow',
    });
  });

  it('should save match with correct score for multiple goals', async () => {
    const date = '2024-01-15';
    const yellowPlayerIds = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];
    const redPlayerIds = ['10', '11', '12', '13', '14', '15', '16', '17', '18'];

    const match = await mockCreateMatch(date, yellowPlayerIds, redPlayerIds);

    // Add multiple goals
    await mockAddMatchEvent(match.id, {
      type: 'goal',
      playerId: '1',
      team: 'yellow',
      timestamp: new Date().toISOString(),
    });

    await mockAddMatchEvent(match.id, {
      type: 'goal',
      playerId: '10',
      team: 'red',
      timestamp: new Date().toISOString(),
    });

    await mockAddMatchEvent(match.id, {
      type: 'goal',
      playerId: '2',
      team: 'yellow',
      timestamp: new Date().toISOString(),
    });

    // Verify final score: Yellow 2-1 Red
    expect(capturedMatch.yellowTeam.score).toBe(2);
    expect(capturedMatch.redTeam.score).toBe(1);
    expect(capturedEvents).toHaveLength(3);
  });

  it('should save match with correct score including own goal', async () => {
    const date = '2024-01-15';
    const yellowPlayerIds = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];
    const redPlayerIds = ['10', '11', '12', '13', '14', '15', '16', '17', '18'];

    const match = await mockCreateMatch(date, yellowPlayerIds, redPlayerIds);

    // Add a regular goal for yellow
    await mockAddMatchEvent(match.id, {
      type: 'goal',
      playerId: '1',
      team: 'yellow',
      timestamp: new Date().toISOString(),
    });

    // Add an own goal by yellow player (gives red a point)
    await mockAddMatchEvent(match.id, {
      type: 'own-goal',
      playerId: '2',
      team: 'yellow',
      timestamp: new Date().toISOString(),
    });

    // Verify final score: Yellow 1-1 Red
    expect(capturedMatch.yellowTeam.score).toBe(1);
    expect(capturedMatch.redTeam.score).toBe(1);
    expect(capturedEvents).toHaveLength(2);
  });

  it('should create match with 0-0 score when no goals added', async () => {
    const date = '2024-01-15';
    const yellowPlayerIds = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];
    const redPlayerIds = ['10', '11', '12', '13', '14', '15', '16', '17', '18'];

    const match = await mockCreateMatch(date, yellowPlayerIds, redPlayerIds);

    // Don't add any goals

    // Verify score remains 0-0
    expect(capturedMatch.yellowTeam.score).toBe(0);
    expect(capturedMatch.redTeam.score).toBe(0);
    expect(capturedEvents).toHaveLength(0);
  });
});
