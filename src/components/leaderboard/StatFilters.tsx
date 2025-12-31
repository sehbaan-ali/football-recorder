import { Tab, TabList, makeStyles } from '@fluentui/react-components';
import type { SortBy } from '../../types';

const useStyles = makeStyles({
  container: {
    marginBottom: '24px',
  },
});

interface StatFiltersProps {
  selectedSort: SortBy;
  onSortChange: (sort: SortBy) => void;
}

export function StatFilters({ selectedSort, onSortChange }: StatFiltersProps) {
  const styles = useStyles();

  return (
    <div className={styles.container}>
      <TabList
        selectedValue={selectedSort}
        onTabSelect={(_, data) => onSortChange(data.value as SortBy)}
      >
        <Tab value="wins">Wins</Tab>
        <Tab value="goals">Goals</Tab>
        <Tab value="assists">Assists</Tab>
        <Tab value="cleanSheets">Clean Sheets</Tab>
      </TabList>
    </div>
  );
}
