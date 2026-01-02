import type { Player, Match, PlayerStats } from '../types';

const API_BASE_URL = 'http://localhost:3000/api';

// Helper function to handle fetch responses
async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(error.error || `HTTP ${response.status}: ${response.statusText}`);
  }

  // Handle 204 No Content (for DELETE)
  if (response.status === 204) {
    return null as T;
  }

  return response.json();
}

// Player API
export const playerApi = {
  async getAll(): Promise<Player[]> {
    const response = await fetch(`${API_BASE_URL}/players`);
    return handleResponse<Player[]>(response);
  },

  async getById(id: string): Promise<Player> {
    const response = await fetch(`${API_BASE_URL}/players/${id}`);
    return handleResponse<Player>(response);
  },

  async create(name: string, position: string): Promise<Player> {
    const response = await fetch(`${API_BASE_URL}/players`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, position }),
    });
    return handleResponse<Player>(response);
  },

  async update(id: string, updates: Partial<Player>): Promise<Player> {
    const response = await fetch(`${API_BASE_URL}/players/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
    return handleResponse<Player>(response);
  },

  async delete(id: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/players/${id}`, {
      method: 'DELETE',
    });
    return handleResponse<void>(response);
  },

  async archive(id: string): Promise<Player> {
    const response = await fetch(`${API_BASE_URL}/players/${id}/archive`, {
      method: 'PATCH',
    });
    return handleResponse<Player>(response);
  },

  async unarchive(id: string): Promise<Player> {
    const response = await fetch(`${API_BASE_URL}/players/${id}/unarchive`, {
      method: 'PATCH',
    });
    return handleResponse<Player>(response);
  },
};

// Match API
export const matchApi = {
  async getAll(): Promise<Match[]> {
    const response = await fetch(`${API_BASE_URL}/matches`);
    return handleResponse<Match[]>(response);
  },

  async getById(id: string): Promise<Match> {
    const response = await fetch(`${API_BASE_URL}/matches/${id}`);
    return handleResponse<Match>(response);
  },

  async create(match: Omit<Match, 'id' | 'createdAt'>): Promise<Match> {
    const response = await fetch(`${API_BASE_URL}/matches`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(match),
    });
    return handleResponse<Match>(response);
  },

  async update(id: string, updates: Partial<Match>): Promise<Match> {
    const response = await fetch(`${API_BASE_URL}/matches/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
    return handleResponse<Match>(response);
  },

  async delete(id: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/matches/${id}`, {
      method: 'DELETE',
    });
    return handleResponse<void>(response);
  },
};

// Stats API
export const statsApi = {
  async getAll(): Promise<PlayerStats[]> {
    const response = await fetch(`${API_BASE_URL}/stats`);
    return handleResponse<PlayerStats[]>(response);
  },

  async getById(id: string): Promise<PlayerStats> {
    const response = await fetch(`${API_BASE_URL}/stats/${id}`);
    return handleResponse<PlayerStats>(response);
  },

  async getTopPlayers(sortBy: string = 'wins', limit: number = 10): Promise<PlayerStats[]> {
    const response = await fetch(`${API_BASE_URL}/stats/top?sortBy=${sortBy}&limit=${limit}`);
    return handleResponse<PlayerStats[]>(response);
  },
};

// Export a combined API object
export const api = {
  players: playerApi,
  matches: matchApi,
  stats: statsApi,
};

export default api;
