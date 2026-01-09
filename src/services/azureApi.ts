import type { Player, Match } from '../types';

/**
 * Azure Functions API Service
 *
 * This replaces the Supabase API with calls to our Azure Functions backend.
 * For local development, calls localhost:7071
 * For production, will call the deployed Azure Functions URL
 */

// API Base URL - different for dev vs production
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:7071/api';

/**
 * Helper function to make API calls with error handling
 */
async function apiCall<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;

    try {
        const response = await fetch(url, {
            ...options,
            headers: {
                'Content-Type': 'application/json',
                ...options?.headers,
            },
        });

        if (!response.ok) {
            const error = await response.json().catch(() => ({ message: response.statusText }));
            throw new Error(error.message || `HTTP ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error(`API call failed: ${endpoint}`, error);
        throw error;
    }
}

// =====================================================
// PLAYER API
// =====================================================

export const playerApi = {
    async getAll(): Promise<Player[]> {
        return apiCall<Player[]>('/players');
    },

    async getById(id: string): Promise<Player> {
        return apiCall<Player>(`/players/${id}`);
    },

    async create(name: string, position: string): Promise<Player> {
        return apiCall<Player>('/players', {
            method: 'POST',
            body: JSON.stringify({ name, position }),
        });
    },

    async update(id: string, updates: Partial<Player>): Promise<Player> {
        return apiCall<Player>(`/players/${id}`, {
            method: 'PUT',
            body: JSON.stringify(updates),
        });
    },

    async delete(id: string): Promise<void> {
        await apiCall<{ success: boolean }>(`/players/${id}`, {
            method: 'DELETE',
        });
    },

    async archive(id: string): Promise<Player> {
        return apiCall<Player>(`/players/${id}/archive`, {
            method: 'PATCH',
            body: JSON.stringify({ archived: true }),
        });
    },

    async unarchive(id: string): Promise<Player> {
        return apiCall<Player>(`/players/${id}/archive`, {
            method: 'PATCH',
            body: JSON.stringify({ archived: false }),
        });
    },
};

// =====================================================
// MATCH API
// =====================================================

export const matchApi = {
    async getAll(): Promise<Match[]> {
        return apiCall<Match[]>('/matches');
    },

    async getById(id: string): Promise<Match> {
        return apiCall<Match>(`/matches/${id}`);
    },

    async create(match: Omit<Match, 'id' | 'createdAt'>): Promise<Match> {
        return apiCall<Match>('/matches', {
            method: 'POST',
            body: JSON.stringify(match),
        });
    },

    async update(id: string, updates: Partial<Match>): Promise<Match> {
        return apiCall<Match>(`/matches/${id}`, {
            method: 'PUT',
            body: JSON.stringify(updates),
        });
    },

    async delete(id: string): Promise<void> {
        await apiCall<{ success: boolean }>(`/matches/${id}`, {
            method: 'DELETE',
        });
    },
};

// =====================================================
// STATS API (Client-side calculation for now)
// =====================================================

export const statsApi = {
    async getAll(): Promise<any[]> {
        // Stats will be calculated client-side in useStats hook
        return [];
    },

    async getById(_id: string): Promise<any> {
        throw new Error('Not implemented - use useStats hook');
    },

    async getTopPlayers(_sortBy: string = 'wins', _limit: number = 10): Promise<any[]> {
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
