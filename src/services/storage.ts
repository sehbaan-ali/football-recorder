import type { Player, Match } from '../types';

const STORAGE_KEYS = {
  PLAYERS: 'football-recorder:players',
  MATCHES: 'football-recorder:matches',
  VERSION: 'football-recorder:version',
} as const;

const CURRENT_VERSION = '1.0.0';

class StorageService {
  private getItem<T>(key: string, defaultValue: T): T {
    try {
      const item = localStorage.getItem(key);
      if (item === null) {
        return defaultValue;
      }
      return JSON.parse(item) as T;
    } catch (error) {
      console.error(`Error reading from localStorage (${key}):`, error);
      return defaultValue;
    }
  }

  private setItem<T>(key: string, value: T): boolean {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      if (error instanceof Error && error.name === 'QuotaExceededError') {
        console.error('LocalStorage quota exceeded');
      } else {
        console.error(`Error writing to localStorage (${key}):`, error);
      }
      return false;
    }
  }

  // Version management
  getVersion(): string {
    return this.getItem(STORAGE_KEYS.VERSION, CURRENT_VERSION);
  }

  initializeVersion(): void {
    const version = this.getVersion();
    if (version !== CURRENT_VERSION) {
      this.setItem(STORAGE_KEYS.VERSION, CURRENT_VERSION);
    }
  }

  // Players
  getPlayers(): Player[] {
    return this.getItem<Player[]>(STORAGE_KEYS.PLAYERS, []);
  }

  savePlayers(players: Player[]): boolean {
    return this.setItem(STORAGE_KEYS.PLAYERS, players);
  }

  addPlayer(player: Player): boolean {
    const players = this.getPlayers();
    players.push(player);
    return this.savePlayers(players);
  }

  updatePlayer(playerId: string, updates: Partial<Player>): boolean {
    const players = this.getPlayers();
    const index = players.findIndex(p => p.id === playerId);
    if (index === -1) return false;

    players[index] = { ...players[index], ...updates };
    return this.savePlayers(players);
  }

  deletePlayer(playerId: string): boolean {
    const players = this.getPlayers();
    const filtered = players.filter(p => p.id !== playerId);
    return this.savePlayers(filtered);
  }

  // Matches
  getMatches(): Match[] {
    return this.getItem<Match[]>(STORAGE_KEYS.MATCHES, []);
  }

  saveMatches(matches: Match[]): boolean {
    return this.setItem(STORAGE_KEYS.MATCHES, matches);
  }

  addMatch(match: Match): boolean {
    const matches = this.getMatches();
    matches.push(match);
    return this.saveMatches(matches);
  }

  updateMatch(matchId: string, updates: Partial<Match>): boolean {
    const matches = this.getMatches();
    const index = matches.findIndex(m => m.id === matchId);
    if (index === -1) return false;

    matches[index] = { ...matches[index], ...updates };
    return this.saveMatches(matches);
  }

  deleteMatch(matchId: string): boolean {
    const matches = this.getMatches();
    const filtered = matches.filter(m => m.id !== matchId);
    return this.saveMatches(filtered);
  }

  // Data export/import
  exportData(): string {
    const data = {
      version: CURRENT_VERSION,
      players: this.getPlayers(),
      matches: this.getMatches(),
      exportedAt: new Date().toISOString(),
    };
    return JSON.stringify(data, null, 2);
  }

  importData(jsonString: string): boolean {
    try {
      const data = JSON.parse(jsonString);

      if (data.players && Array.isArray(data.players)) {
        this.savePlayers(data.players);
      }

      if (data.matches && Array.isArray(data.matches)) {
        this.saveMatches(data.matches);
      }

      return true;
    } catch (error) {
      console.error('Error importing data:', error);
      return false;
    }
  }

  clearAllData(): void {
    localStorage.removeItem(STORAGE_KEYS.PLAYERS);
    localStorage.removeItem(STORAGE_KEYS.MATCHES);
    localStorage.removeItem(STORAGE_KEYS.VERSION);
  }
}

export const storage = new StorageService();
