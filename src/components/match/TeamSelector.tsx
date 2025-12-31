import { useState } from 'react';
import {
  Dropdown,
  Option,
  Label,
  makeStyles,
  tokens,
  Text,
  Badge,
} from '@fluentui/react-components';
import type { Player, TeamColor } from '../../types';

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
  selectedPlayers: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px',
    marginTop: '8px',
  },
  playerBadge: {
    fontSize: tokens.fontSizeBase200,
  },
});

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

  const availablePlayers = players.filter(
    p => !excludePlayerIds.includes(p.id) && !selectedPlayerIds.includes(p.id)
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

  const selectedPlayers = selectedPlayerIds
    .map(id => players.find(p => p.id === id))
    .filter((p): p is Player => p !== undefined);

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
        >
          {availablePlayers.map(player => (
            <Option key={player.id} value={player.id}>
              {player.name}
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
