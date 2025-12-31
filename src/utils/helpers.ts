import { format, parseISO } from 'date-fns';
import type { Player, TeamColor } from '../types';

export function formatDate(dateString: string, formatString: string = 'MMM d, yyyy'): string {
  try {
    return format(parseISO(dateString), formatString);
  } catch {
    return dateString;
  }
}

export function formatDateTime(dateString: string): string {
  try {
    return format(parseISO(dateString), 'MMM d, yyyy h:mm a');
  } catch {
    return dateString;
  }
}

export function getPlayerName(playerId: string, players: Player[]): string {
  const player = players.find(p => p.id === playerId);
  return player?.name || 'Unknown Player';
}

export function getTeamColor(team: TeamColor): string {
  return team === 'yellow' ? '#FFD700' : '#DC143C';
}

export function getTeamDisplayName(team: TeamColor): string {
  return team === 'yellow' ? 'Yellow Team' : 'Red Team';
}

export function downloadJSON(data: string, filename: string): void {
  const blob = new Blob([data], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function readJSONFile(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result;
      if (typeof result === 'string') {
        resolve(result);
      } else {
        reject(new Error('Failed to read file'));
      }
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsText(file);
  });
}
