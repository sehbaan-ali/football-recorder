import { useState, useMemo } from 'react';
import {
  Dropdown,
  Option,
  Label,
  makeStyles,
  tokens,
  Text,
  Badge,
} from '@fluentui/react-components';
import type { Player, TeamColor, PlayerPosition } from '../../types';

// Position sort order
const POSITION_ORDER: Record<PlayerPosition, number> = {
  'GK': 1,
  'DEF': 2,
  'MID': 3,
  'WING': 4,
  'ST': 5,
};

// Required positions for a team
const POSITION_REQUIREMENTS: Record<PlayerPosition, number> = {
  'GK': 1,
  'DEF': 3,
  'MID': 2,
  'WING': 2,
  'ST': 1,
};

const useStyles = makeStyles({
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  teamBadge: {
    fontSize: tokens.fontSizeBase300,
  },
  positionCounter: {
    display: 'flex',
    gap: '12px',
    flexWrap: 'wrap',
    marginTop: '8px',
    marginBottom: '8px',
  },
  positionBadge: {
    fontSize: '11px',
    fontWeight: tokens.fontWeightSemibold,
  },
  selectedPlayers: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px',
    marginTop: '8px',
  },
  playerBadge: {
    fontSize: tokens.fontSizeBase200,
  },
  dropdown: {
    maxHeight: '300px',
  },
});

const getPositionColor = (position: PlayerPosition): 'success' | 'informative' | 'warning' | 'severe' | 'important' => {
  switch (position) {
    case 'GK':
      return 'success';
    case 'DEF':
      return 'informative';
    case 'MID':
      return 'warning';
    case 'WING':
      return 'severe';
    case 'ST':
      return 'important';
    default:
      return 'informative';
  }
};

interface TeamSelectorProps {
  team: TeamColor;
  players: Player[];
  selectedPlayerIds: string[];
  excludePlayerIds: string[];
  onSelectionChange: (playerIds: string[]) => void;
  requiredCount?: number;
}

export function TeamSelector({
  team,
  players,
  selectedPlayerIds,
  excludePlayerIds,
  onSelectionChange,
  requiredCount = 9,
}: TeamSelectorProps) {
  const styles = useStyles();
  const [value, setValue] = useState('');

  const teamColor = team === 'yellow' ? '#FFD700' : '#DC143C';
  const teamName = team === 'yellow' ? 'Yellow Team' : 'Red Team';

  // Get selected players and calculate position counts
  const selectedPlayers = useMemo(() =>
    selectedPlayerIds
      .map(id => players.find(p => p.id === id))
      .filter((p): p is Player => p !== undefined),
    [selectedPlayerIds, players]
  );

  const positionCounts = useMemo(() => {
    const counts: Record<PlayerPosition, number> = {
      'GK': 0,
      'DEF': 0,
      'MID': 0,
      'WING': 0,
      'ST': 0,
    };
    selectedPlayers.forEach(player => {
      counts[player.position]++;
    });
    return counts;
  }, [selectedPlayers]);

  // Sort available players by position
  const availablePlayers = useMemo(() =>
    players
      .filter(p => !excludePlayerIds.includes(p.id) && !selectedPlayerIds.includes(p.id))
      .sort((a, b) => {
        const positionDiff = POSITION_ORDER[a.position] - POSITION_ORDER[b.position];
        if (positionDiff !== 0) return positionDiff;
        return a.name.localeCompare(b.name);
      }),
    [players, excludePlayerIds, selectedPlayerIds]
  );

  const handleSelect = (playerId: string) => {
    if (selectedPlayerIds.length < requiredCount) {
      onSelectionChange([...selectedPlayerIds, playerId]);
      setValue('');
    }
  };

  const handleRemove = (playerId: string) => {
    onSelectionChange(selectedPlayerIds.filter(id => id !== playerId));
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Badge
          appearance="filled"
          style={{ backgroundColor: teamColor }}
          className={styles.teamBadge}
        >
          {teamName}
        </Badge>
        <Text size={200}>
          {selectedPlayerIds.length} / {requiredCount} players
        </Text>
      </div>

      {/* Position Counter */}
      <div className={styles.positionCounter}>
        {(Object.keys(POSITION_REQUIREMENTS) as PlayerPosition[]).map(position => {
          const current = positionCounts[position];
          const required = POSITION_REQUIREMENTS[position];
          const isComplete = current === required;

          return (
            <Text key={position} size={200}>
              <Badge
                appearance="filled"
                color={getPositionColor(position)}
                className={styles.positionBadge}
              >
                {position}
              </Badge>
              {' '}
              <Text weight={isComplete ? 'semibold' : 'regular'}>
                {current}/{required}
              </Text>
            </Text>
          );
        })}
      </div>

      <div>
        <Label htmlFor={`team-${team}`}>
          Select players for {teamName}
        </Label>
        <Dropdown
          id={`team-${team}`}
          placeholder="Choose a player"
          value={value}
          onOptionSelect={(_, data) => {
            if (data.optionValue) {
              handleSelect(data.optionValue);
            }
          }}
          disabled={selectedPlayerIds.length >= requiredCount}
          positioning={{
            position: 'below',
            align: 'start',
            autoSize: false,
            flip: false,
            overflowBoundary: undefined,
          }}
          listbox={{ style: { maxHeight: '300px', overflowY: 'auto' } }}
        >
          {availablePlayers.map(player => (
            <Option key={player.id} value={player.id}>
              {player.name}{' '}
              <Badge
                appearance="filled"
                color={getPositionColor(player.position)}
                size="small"
              >
                {player.position}
              </Badge>
            </Option>
          ))}
        </Dropdown>
      </div>

      {selectedPlayers.length > 0 && (
        <div className={styles.selectedPlayers}>
          {selectedPlayers.map(player => (
            <Badge
              key={player.id}
              appearance="outline"
              className={styles.playerBadge}
              onClick={() => handleRemove(player.id)}
              style={{ cursor: 'pointer' }}
            >
              {player.name} ✕
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
}
