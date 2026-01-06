import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
  makeStyles,
  tokens,
  Text,
  Tab,
  TabList,
  Button,
  Avatar,
  Menu,
  MenuTrigger,
  MenuPopover,
  MenuList,
  MenuItem,
} from '@fluentui/react-components';
import {
  Home24Regular,
  People24Regular,
  Trophy24Regular,
  AddCircle24Regular,
  PersonRegular,
  SignOutRegular,
} from '@fluentui/react-icons';
import { useAuth } from '../../contexts/AuthContext';

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
  authSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  userInfo: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
  },
  userEmail: {
    fontSize: tokens.fontSizeBase200,
  },
  userRole: {
    fontSize: tokens.fontSizeBase100,
    opacity: 0.8,
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
  const { user, profile, signOut, isAdmin, isSuperAdmin } = useAuth();

  const getSelectedTab = () => {
    const path = location.pathname;
    if (path === '/') return 'dashboard';
    if (path.startsWith('/players')) return 'players';
    if (path.startsWith('/match')) return 'new-match';
    if (path.startsWith('/leaderboard')) return 'leaderboard';
    return 'dashboard';
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const getRoleDisplay = () => {
    if (isSuperAdmin) return 'Super Admin';
    if (isAdmin) return 'Admin';
    return 'Viewer';
  };

  return (
    <div className={styles.root}>
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <Text className={styles.title}>Football Recorder</Text>
          <div className={styles.authSection}>
            {user ? (
              <>
                <div className={styles.userInfo}>
                  <Text className={styles.userEmail}>{profile?.email}</Text>
                  <Text className={styles.userRole}>{getRoleDisplay()}</Text>
                </div>
                <Menu>
                  <MenuTrigger disableButtonEnhancement>
                    <Avatar
                      name={profile?.full_name || profile?.email || ''}
                      color="colorful"
                      style={{ cursor: 'pointer' }}
                    />
                  </MenuTrigger>
                  <MenuPopover>
                    <MenuList>
                      <MenuItem icon={<SignOutRegular />} onClick={handleSignOut}>
                        Sign Out
                      </MenuItem>
                    </MenuList>
                  </MenuPopover>
                </Menu>
              </>
            ) : (
              <Button
                appearance="primary"
                icon={<PersonRegular />}
                onClick={() => navigate('/login')}
              >
                Login
              </Button>
            )}
          </div>
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
