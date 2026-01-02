import { getDb, saveDatabase } from '../database/connection';
import type { Player } from '../types';

export class PlayerService {
  static getAllPlayers(): Player[] {
    const db = getDb();
    const result = db.exec('SELECT * FROM players ORDER BY created_at DESC');

    if (result.length === 0 || !result[0].values.length) {
      return [];
    }

    return result[0].values.map(row => this.rowToPlayer(row));
  }

  static getPlayerById(id: string): Player | undefined {
    const db = getDb();
    const result = db.exec('SELECT * FROM players WHERE id = ?', [id]);

    if (result.length === 0 || !result[0].values.length) {
      return undefined;
    }

    return this.rowToPlayer(result[0].values[0]);
  }

  static createPlayer(player: Player): Player {
    const db = getDb();

    db.run(
      'INSERT INTO players (id, name, position, created_at, archived) VALUES (?, ?, ?, ?, ?)',
      [player.id, player.name, player.position, player.createdAt, player.archived ? 1 : 0]
    );

    saveDatabase();
    return player;
  }

  static updatePlayer(id: string, updates: Partial<Player>): Player | null {
    const existing = this.getPlayerById(id);
    if (!existing) return null;

    const updatedPlayer = { ...existing, ...updates };
    const db = getDb();

    db.run(
      'UPDATE players SET name = ?, position = ?, archived = ? WHERE id = ?',
      [updatedPlayer.name, updatedPlayer.position, updatedPlayer.archived ? 1 : 0, id]
    );

    saveDatabase();
    return updatedPlayer;
  }

  static deletePlayer(id: string): boolean {
    const db = getDb();
    const existing = this.getPlayerById(id);
    if (!existing) return false;

    db.run('DELETE FROM players WHERE id = ?', [id]);
    saveDatabase();
    return true;
  }

  static archivePlayer(id: string): boolean {
    const db = getDb();
    const existing = this.getPlayerById(id);
    if (!existing) return false;

    db.run('UPDATE players SET archived = 1 WHERE id = ?', [id]);
    saveDatabase();
    return true;
  }

  static unarchivePlayer(id: string): boolean {
    const db = getDb();
    const existing = this.getPlayerById(id);
    if (!existing) return false;

    db.run('UPDATE players SET archived = 0 WHERE id = ?', [id]);
    saveDatabase();
    return true;
  }

  private static rowToPlayer(row: any[]): Player {
    return {
      id: row[0] as string,
      name: row[1] as string,
      position: row[2] as any,
      createdAt: row[3] as string,
      archived: row[4] === 1,
    };
  }
}
