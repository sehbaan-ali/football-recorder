import type { MatchEvent, CleanSheetEvent } from '../types';

/**
 * Calculate scores from match events
 * Goals increase team score, own goals increase opponent score
 */
export function calculateScoresFromEvents(
  events: MatchEvent[]
): { yellowScore: number; redScore: number } {
  let yellowScore = 0;
  let redScore = 0;

  events.forEach(event => {
    if (event.type === 'goal') {
      if (event.team === 'yellow') {
        yellowScore++;
      } else {
        redScore++;
      }
    } else if (event.type === 'own-goal') {
      // Own goal increases opponent's score
      if (event.team === 'yellow') {
        redScore++;
      } else {
        yellowScore++;
      }
    }
  });

  return { yellowScore, redScore };
}

/**
 * Generate clean sheet events for teams that didn't concede any goals
 */
export function generateCleanSheetEvents(
  yellowPlayers: string[],
  redPlayers: string[],
  yellowScore: number,
  redScore: number
): CleanSheetEvent[] {
  const cleanSheets: CleanSheetEvent[] = [];

  // Yellow team gets clean sheet if red didn't score
  if (redScore === 0) {
    yellowPlayers.forEach(playerId => {
      cleanSheets.push({
        type: 'clean-sheet',
        playerId,
        team: 'yellow'
      });
    });
  }

  // Red team gets clean sheet if yellow didn't score
  if (yellowScore === 0) {
    redPlayers.forEach(playerId => {
      cleanSheets.push({
        type: 'clean-sheet',
        playerId,
        team: 'red'
      });
    });
  }

  return cleanSheets;
}
