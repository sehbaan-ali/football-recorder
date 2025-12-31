import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
  makeStyles,
  tokens,
  Text,
  Tab,
  TabList,
} from '@fluentui/react-components';
import {
  Home24Regular,
  People24Regular,
  Trophy24Regular,
  AddCircle24Regular,
} from '@fluentui/react-icons';

const useStyles = makeStyles({
  root: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
    backgroundColor: tokens.colorNeutralBackground1,
  },
  header: {
    backgroundColor: tokens.colorBrandBackground,
    color: tokens.colorNeutralForegroundOnBrand,
    padding: '16px 24px',
    boxShadow: tokens.shadow8,
  },
  headerContent: {
    maxWidth: '1200px',
    margin: '0 auto',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: tokens.fontSizeHero700,
    fontWeight: tokens.fontWeightBold,
    margin: 0,
  },
  nav: {
    backgroundColor: tokens.colorNeutralBackground1,
    borderBottom: `1px solid ${tokens.colorNeutralStroke1}`,
    padding: '0 24px',
  },
  navContent: {
    maxWidth: '1200px',
    margin: '0 auto',
  },
  main: {
    flex: 1,
    padding: '24px',
    maxWidth: '1200px',
    width: '100%',
    margin: '0 auto',
  },
});

export function AppLayout() {
  const styles = useStyles();
  const location = useLocation();
  const navigate = useNavigate();

  const getSelectedTab = () => {
    const path = location.pathname;
    if (path === '/') return 'dashboard';
    if (path.startsWith('/players')) return 'players';
    if (path.startsWith('/match')) return 'new-match';
    if (path.startsWith('/leaderboard')) return 'leaderboard';
    return 'dashboard';
  };

  return (
    <div className={styles.root}>
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <Text className={styles.title}>Football Recorder</Text>
        </div>
      </header>

      <nav className={styles.nav}>
        <div className={styles.navContent}>
          <TabList
            selectedValue={getSelectedTab()}
            onTabSelect={(_, data) => {
              const routes: Record<string, string> = {
                dashboard: '/',
                players: '/players',
                'new-match': '/match/new',
                leaderboard: '/leaderboard',
              };
              if (data.value && routes[data.value as string]) {
                navigate(routes[data.value as string]);
              }
            }}
          >
            <Tab
              value="dashboard"
              icon={<Home24Regular />}
            >
              Dashboard
            </Tab>
            <Tab
              value="players"
              icon={<People24Regular />}
            >
              Players
            </Tab>
            <Tab
              value="new-match"
              icon={<AddCircle24Regular />}
            >
              New Match
            </Tab>
            <Tab
              value="leaderboard"
              icon={<Trophy24Regular />}
            >
              Leaderboard
            </Tab>
          </TabList>
        </div>
      </nav>

      <main className={styles.main}>
        <Outlet />
      </main>
    </div>
  );
}
