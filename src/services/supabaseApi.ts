import { supabase } from '../lib/supabase';
import type { Player, Match, PlayerStats } from '../types';

// =====================================================
// PLAYER API
// =====================================================

export const playerApi = {
  async getAll(): Promise<Player[]> {
    const { data, error } = await supabase
      .from('players')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw new Error(error.message);

    return (data || []).map(row => ({
      id: row.id,
      name: row.name,
      position: row.position,
      createdAt: row.created_at,
      archived: row.archived || false,
    }));
  },

  async getById(id: string): Promise<Player> {
    const { data, error } = await supabase
      .from('players')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw new Error(error.message);

    return {
      id: data.id,
      name: data.name,
      position: data.position,
      createdAt: data.created_at,
      archived: data.archived || false,
    };
  },

  async create(name: string, position: string): Promise<Player> {
    const { data, error } = await supabase
      .from('players')
      .insert([
        {
          name,
          position,
          archived: false,
        },
      ])
      .select()
      .single();

    if (error) throw new Error(error.message);

    return {
      id: data.id,
      name: data.name,
      position: data.position,
      createdAt: data.created_at,
      archived: data.archived || false,
    };
  },

  async update(id: string, updates: Partial<Player>): Promise<Player> {
    const updateData: any = {};
    if (updates.name !== undefined) updateData.name = updates.name;
    if (updates.position !== undefined) updateData.position = updates.position;
    if (updates.archived !== undefined) updateData.archived = updates.archived;

    const { data, error } = await supabase
      .from('players')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw new Error(error.message);

    return {
      id: data.id,
      name: data.name,
      position: data.position,
      createdAt: data.created_at,
      archived: data.archived || false,
    };
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('players')
      .delete()
      .eq('id', id);

    if (error) throw new Error(error.message);
  },

  async archive(id: string): Promise<Player> {
    return this.update(id, { archived: true });
  },

  async unarchive(id: string): Promise<Player> {
    return this.update(id, { archived: false });
  },
};

// =====================================================
// MATCH API
// =====================================================

export const matchApi = {
  async getAll(): Promise<Match[]> {
    const { data, error } = await supabase
      .from('matches')
      .select('*')
      .order('date', { ascending: false });

    if (error) throw new Error(error.message);

    return (data || []).map(row => ({
      id: row.id,
      date: row.date,
      yellowTeam: {
        playerIds: row.yellow_team_player_ids || [],
        score: row.yellow_team_score || 0,
      },
      redTeam: {
        playerIds: row.red_team_player_ids || [],
        score: row.red_team_score || 0,
      },
      events: row.events || [],
      createdAt: row.created_at,
    }));
  },

  async getById(id: string): Promise<Match> {
    const { data, error } = await supabase
      .from('matches')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw new Error(error.message);

    return {
      id: data.id,
      date: data.date,
      yellowTeam: {
        playerIds: data.yellow_team_player_ids || [],
        score: data.yellow_team_score || 0,
      },
      redTeam: {
        playerIds: data.red_team_player_ids || [],
        score: data.red_team_score || 0,
      },
      events: data.events || [],
      createdAt: data.created_at,
    };
  },

  async create(match: Omit<Match, 'id' | 'createdAt'>): Promise<Match> {
    const { data, error } = await supabase
      .from('matches')
      .insert([
        {
          date: match.date,
          yellow_team_player_ids: match.yellowTeam.playerIds,
          yellow_team_score: match.yellowTeam.score,
          red_team_player_ids: match.redTeam.playerIds,
          red_team_score: match.redTeam.score,
          events: match.events,
        },
      ])
      .select()
      .single();

    if (error) throw new Error(error.message);

    return {
      id: data.id,
      date: data.date,
      yellowTeam: {
        playerIds: data.yellow_team_player_ids || [],
        score: data.yellow_team_score || 0,
      },
      redTeam: {
        playerIds: data.red_team_player_ids || [],
        score: data.red_team_score || 0,
      },
      events: data.events || [],
      createdAt: data.created_at,
    };
  },

  async update(id: string, updates: Partial<Match>): Promise<Match> {
    const updateData: any = {};

    if (updates.date !== undefined) updateData.date = updates.date;
    if (updates.yellowTeam !== undefined) {
      updateData.yellow_team_player_ids = updates.yellowTeam.playerIds;
      updateData.yellow_team_score = updates.yellowTeam.score;
    }
    if (updates.redTeam !== undefined) {
      updateData.red_team_player_ids = updates.redTeam.playerIds;
      updateData.red_team_score = updates.redTeam.score;
    }
    if (updates.events !== undefined) updateData.events = updates.events;

    const { data, error } = await supabase
      .from('matches')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw new Error(error.message);

    return {
      id: data.id,
      date: data.date,
      yellowTeam: {
        playerIds: data.yellow_team_player_ids || [],
        score: data.yellow_team_score || 0,
      },
      redTeam: {
        playerIds: data.red_team_player_ids || [],
        score: data.red_team_score || 0,
      },
      events: data.events || [],
      createdAt: data.created_at,
    };
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('matches')
      .delete()
      .eq('id', id);

    if (error) throw new Error(error.message);
  },
};

// =====================================================
// STATS API (Client-side calculation for now)
// =====================================================

export const statsApi = {
  async getAll(): Promise<PlayerStats[]> {
    // For now, return empty array
    // Stats will be calculated client-side in useStats hook
    return [];
  },

  async getById(id: string): Promise<PlayerStats> {
    throw new Error('Not implemented - use useStats hook');
  },

  async getTopPlayers(sortBy: string = 'wins', limit: number = 10): Promise<PlayerStats[]> {
    // For now, return empty array
    // Stats will be calculated client-side in useStats hook
    return [];
  },
};

// Export a combined API object
export const api = {
  players: playerApi,
  matches: matchApi,
  stats: statsApi,
};

export default api;
