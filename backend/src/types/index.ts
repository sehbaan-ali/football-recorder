export type PlayerPosition = 'GK' | 'DEF' | 'MID' | 'WING' | 'ST';

export interface Player {
  id: string;
  name: string;
  position: PlayerPosition;
  createdAt: string;
  archived?: boolean;
}

export type TeamColor = 'yellow' | 'red';

export interface Team {
  playerIds: string[];
  score: number;
}

export type MatchEvent =
  | GoalEvent
  | OwnGoalEvent
  | CleanSheetEvent;

export interface GoalEvent {
  type: 'goal';
  playerId: string;
  assistPlayerId?: string;
  team: TeamColor;
  timestamp: string;
}

export interface OwnGoalEvent {
  type: 'own-goal';
  playerId: string;
  assistPlayerId?: string;
  team: TeamColor;
  timestamp: string;
}

export interface CleanSheetEvent {
  type: 'clean-sheet';
  playerId: string;
  team: TeamColor;
  timestamp: string;
}

export interface Match {
  id: string;
  date: string;
  yellowTeam: Team;
  redTeam: Team;
  events: MatchEvent[];
  createdAt: string;
}

export interface PlayerStats {
  playerId: string;
  playerName: string;
  matchesPlayed: number;
  wins: number;
  losses: number;
  draws: number;
  goals: number;
  assists: number;
  cleanSheets: number;
  winRate: number;
}

export type SortBy = 'wins' | 'goals' | 'assists' | 'cleanSheets' | 'winRate';
