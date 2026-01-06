import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { SortBy } from '../../types';

interface StatFiltersProps {
  selectedSort: SortBy;
  onSortChange: (sort: SortBy) => void;
}

export function StatFilters({ selectedSort, onSortChange }: StatFiltersProps) {
  return (
    <Tabs value={selectedSort} onValueChange={(value) => onSortChange(value as SortBy)}>
      <TabsList>
        <TabsTrigger value="wins">Wins</TabsTrigger>
        <TabsTrigger value="goals">Goals</TabsTrigger>
        <TabsTrigger value="assists">Assists</TabsTrigger>
        <TabsTrigger value="cleanSheets">Clean Sheets</TabsTrigger>
      </TabsList>
    </Tabs>
  );
}
