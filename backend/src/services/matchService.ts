import { getDb, saveDatabase } from '../database/connection';
import type { Match } from '../types';

export class MatchService {
  static getAllMatches(): Match[] {
    const db = getDb();
    const result = db.exec('SELECT * FROM matches ORDER BY date DESC, created_at DESC');

    if (result.length === 0 || !result[0].values.length) {
      return [];
    }

    return result[0].values.map(row => this.rowToMatch(row));
  }

  static getMatchById(id: string): Match | undefined {
    const db = getDb();
    const result = db.exec('SELECT * FROM matches WHERE id = ?', [id]);

    if (result.length === 0 || !result[0].values.length) {
      return undefined;
    }

    return this.rowToMatch(result[0].values[0]);
  }

  static createMatch(match: Match): Match {
    const db = getDb();

    db.run(
      `INSERT INTO matches (
        id, date, yellow_team_player_ids, yellow_team_score,
        red_team_player_ids, red_team_score, events, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        match.id,
        match.date,
        JSON.stringify(match.yellowTeam.playerIds),
        match.yellowTeam.score,
        JSON.stringify(match.redTeam.playerIds),
        match.redTeam.score,
        JSON.stringify(match.events),
        match.createdAt
      ]
    );

    saveDatabase();
    return match;
  }

  static updateMatch(id: string, updates: Partial<Match>): Match | null {
    const existing = this.getMatchById(id);
    if (!existing) return null;

    const updatedMatch = { ...existing, ...updates };
    const db = getDb();

    db.run(
      `UPDATE matches
       SET date = ?,
           yellow_team_player_ids = ?,
           yellow_team_score = ?,
           red_team_player_ids = ?,
           red_team_score = ?,
           events = ?
       WHERE id = ?`,
      [
        updatedMatch.date,
        JSON.stringify(updatedMatch.yellowTeam.playerIds),
        updatedMatch.yellowTeam.score,
        JSON.stringify(updatedMatch.redTeam.playerIds),
        updatedMatch.redTeam.score,
        JSON.stringify(updatedMatch.events),
        id
      ]
    );

    saveDatabase();
    return updatedMatch;
  }

  static deleteMatch(id: string): boolean {
    const db = getDb();
    const existing = this.getMatchById(id);
    if (!existing) return false;

    db.run('DELETE FROM matches WHERE id = ?', [id]);
    saveDatabase();
    return true;
  }

  private static rowToMatch(row: any[]): Match {
    return {
      id: row[0] as string,
      date: row[1] as string,
      yellowTeam: {
        playerIds: JSON.parse(row[2] as string),
        score: row[3] as number,
      },
      redTeam: {
        playerIds: JSON.parse(row[4] as string),
        score: row[5] as number,
      },
      events: JSON.parse(row[6] as string),
      createdAt: row[7] as string,
    };
  }
}
