import { useMemo } from 'react';
import {
  Button,
  Dropdown,
  Option,
  Badge,
  makeStyles,
  tokens,
  Text,
} from '@fluentui/react-components';
import { Checkmark24Regular } from '@fluentui/react-icons';
import type { Player, TeamColor, PlayerPosition } from '../../types';

// Formation slot definitions
const FORMATION_SLOTS = [
  { id: 'GK', position: 'GK' as PlayerPosition, label: 'GK', row: 6 },
  { id: 'DEF_1', position: 'DEF' as PlayerPosition, label: 'DEF 1', row: 5 },
  { id: 'DEF_2', position: 'DEF' as PlayerPosition, label: 'DEF 2', row: 5 },
  { id: 'DEF_3', position: 'DEF' as PlayerPosition, label: 'DEF 3', row: 5 },
  { id: 'MID_1', position: 'MID' as PlayerPosition, label: 'MID 1', row: 4 },
  { id: 'MID_2', position: 'MID' as PlayerPosition, label: 'MID 2', row: 4 },
  { id: 'WING_1', position: 'WING' as PlayerPosition, label: 'WING 1', row: 3 },
  { id: 'WING_2', position: 'WING' as PlayerPosition, label: 'WING 2', row: 3 },
  { id: 'ST', position: 'ST' as PlayerPosition, label: 'ST', row: 2 },
] as const;

const POSITION_ORDER: Record<PlayerPosition, number> = {
  'GK': 1,
  'DEF': 2,
  'MID': 3,
  'WING': 4,
  'ST': 5,
};

const useStyles = makeStyles({
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '8px',
  },
  teamInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  teamBadge: {
    fontSize: tokens.fontSizeBase300,
  },
  formationGrid: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    padding: '16px',
    backgroundColor: tokens.colorNeutralBackground3,
    borderRadius: tokens.borderRadiusMedium,
    border: `2px solid ${tokens.colorNeutralStroke1}`,
    maxWidth: '100%',
    overflowX: 'auto',
  },
  formationRow: {
    display: 'flex',
    justifyContent: 'center',
    gap: '8px',
    flexWrap: 'wrap',
  },
  slotCard: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
    padding: '8px',
    width: '180px',
    backgroundColor: tokens.colorNeutralBackground1,
    borderRadius: tokens.borderRadiusSmall,
    border: `1px solid ${tokens.colorNeutralStroke1}`,
  },
  slotLabel: {
    fontSize: tokens.fontSizeBase200,
    fontWeight: tokens.fontWeightSemibold,
    color: tokens.colorNeutralForeground3,
    textAlign: 'center',
  },
  slotDropdown: {
    width: '100%',
    minWidth: 0,
  },
  warningBadge: {
    fontSize: '10px',
    marginTop: '4px',
  },
  autoAssignButton: {
    alignSelf: 'flex-start',
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

export type FormationAssignment = Record<string, string | null>;

interface FormationSelectorProps {
  team: TeamColor;
  players: Player[];
  formation: FormationAssignment;
  excludePlayerIds: string[];
  onFormationChange: (formation: FormationAssignment) => void;
}

export function FormationSelector({
  team,
  players,
  formation,
  excludePlayerIds,
  onFormationChange,
}: FormationSelectorProps) {
  const styles = useStyles();

  const teamColor = team === 'yellow' ? '#FFD700' : '#DC143C';
  const teamName = team === 'yellow' ? 'Yellow Team' : 'Red Team';

  // Get assigned player IDs to exclude them from other dropdowns
  const assignedPlayerIds = Object.values(formation).filter((id): id is string => id !== null);

  // Calculate completion
  const filledSlots = assignedPlayerIds.length;
  const totalSlots = FORMATION_SLOTS.length;

  // Group slots by row for visual layout
  const slotsByRow = useMemo(() => {
    const rows: Record<number, typeof FORMATION_SLOTS> = {};
    FORMATION_SLOTS.forEach(slot => {
      if (!rows[slot.row]) {
        rows[slot.row] = [];
      }
      rows[slot.row].push(slot);
    });
    return rows;
  }, []);

  // Get available players for a specific slot
  const getAvailablePlayers = (currentSlotId: string) => {
    const currentPlayerId = formation[currentSlotId];
    return players
      .filter(p =>
        !excludePlayerIds.includes(p.id) &&
        (!assignedPlayerIds.includes(p.id) || p.id === currentPlayerId)
      )
      .sort((a, b) => {
        const positionDiff = POSITION_ORDER[a.position] - POSITION_ORDER[b.position];
        if (positionDiff !== 0) return positionDiff;
        return a.name.localeCompare(b.name);
      });
  };

  const handleSlotChange = (slotId: string, playerId: string | null) => {
    onFormationChange({
      ...formation,
      [slotId]: playerId,
    });
  };

  const handleAutoAssign = () => {
    const newFormation: FormationAssignment = {};
    const availablePlayers = players.filter(p => !excludePlayerIds.includes(p.id));
    const unassignedPlayers = [...availablePlayers];

    // First pass: Assign players to their natural positions
    FORMATION_SLOTS.forEach(slot => {
      const matchingPlayer = unassignedPlayers.find(p => p.position === slot.position);
      if (matchingPlayer) {
        newFormation[slot.id] = matchingPlayer.id;
        unassignedPlayers.splice(unassignedPlayers.indexOf(matchingPlayer), 1);
      } else {
        newFormation[slot.id] = null;
      }
    });

    // Second pass: Fill remaining slots with any available players
    const emptySlots = FORMATION_SLOTS.filter(slot => !newFormation[slot.id]);
    emptySlots.forEach(slot => {
      if (unassignedPlayers.length > 0) {
        newFormation[slot.id] = unassignedPlayers[0].id;
        unassignedPlayers.shift();
      }
    });

    onFormationChange(newFormation);
  };

  const renderSlot = (slot: typeof FORMATION_SLOTS[number]) => {
    const playerId = formation[slot.id];
    const player = playerId ? players.find(p => p.id === playerId) : null;
    const isOutOfPosition = player && player.position !== slot.position;
    const availablePlayers = getAvailablePlayers(slot.id);

    return (
      <div key={slot.id} className={styles.slotCard}>
        <Text className={styles.slotLabel}>
          {slot.label}{' '}
          <Badge
            appearance="filled"
            color={getPositionColor(slot.position)}
            size="small"
          >
            {slot.position}
          </Badge>
        </Text>
        <Dropdown
          placeholder="Select player"
          value={player?.name || ''}
          onOptionSelect={(_, data) => {
            handleSlotChange(slot.id, data.optionValue === '' ? null : data.optionValue || null);
          }}
          size="small"
          className={styles.slotDropdown}
          positioning={{
            position: 'below',
            align: 'start',
            autoSize: false,
            flip: false,
          }}
          listbox={{ style: { maxHeight: '200px', overflowY: 'auto', width: '180px' } }}
        >
          <Option value="">Clear</Option>
          {availablePlayers.map(p => (
            <Option key={p.id} value={p.id}>
              {p.name}{' '}
              <Badge
                appearance="filled"
                color={getPositionColor(p.position)}
                size="small"
              >
                {p.position}
              </Badge>
            </Option>
          ))}
        </Dropdown>
        {isOutOfPosition && (
          <Badge
            appearance="filled"
            color="warning"
            className={styles.warningBadge}
          >
            Out of position
          </Badge>
        )}
      </div>
    );
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.teamInfo}>
          <Badge
            appearance="filled"
            style={{ backgroundColor: teamColor }}
            className={styles.teamBadge}
          >
            {teamName}
          </Badge>
          <Text size={200}>
            {filledSlots} / {totalSlots} players
          </Text>
        </div>
        <Button
          appearance="subtle"
          icon={<Checkmark24Regular />}
          onClick={handleAutoAssign}
          size="small"
          className={styles.autoAssignButton}
        >
          Auto-assign
        </Button>
      </div>

      <div className={styles.formationGrid}>
        {/* Render rows from top to bottom (GK to ST) */}
        {[6, 5, 4, 3, 2].map(rowNumber => (
          <div key={rowNumber} className={styles.formationRow}>
            {slotsByRow[rowNumber]?.map(slot => renderSlot(slot))}
          </div>
        ))}
      </div>
    </div>
  );
}
