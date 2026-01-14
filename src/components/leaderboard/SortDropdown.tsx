import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { SortBy } from '../../types';

interface SortDropdownProps {
  value: SortBy;
  onChange: (value: SortBy) => void;
}

const SORT_OPTIONS: { value: SortBy; label: string }[] = [
  { value: 'matchesPlayed', label: 'Matches Played' },
  { value: 'wins', label: 'Wins' },
  { value: 'draws', label: 'Draws' },
  { value: 'losses', label: 'Losses' },
  { value: 'goals', label: 'Goals' },
  { value: 'assists', label: 'Assists' },
  { value: 'cleanSheets', label: 'Clean Sheets' },
  { value: 'manOfTheMatchAwards', label: 'Man of the Match' },
];

export function SortDropdown({ value, onChange }: SortDropdownProps) {
  return (
    <div className="flex items-center gap-3">
      <label htmlFor="sort-by" className="text-sm font-medium text-muted-foreground">
        Sort by:
      </label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger id="sort-by" className="w-[200px]">
          <SelectValue placeholder="Select metric" />
        </SelectTrigger>
        <SelectContent>
          {SORT_OPTIONS.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
