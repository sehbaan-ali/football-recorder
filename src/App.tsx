import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { FluentProvider, webLightTheme, webDarkTheme } from '@fluentui/react-components';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider, useTheme } from './contexts/ThemeContext';
import { AppLayout } from './components/layout/AppLayout';
import { Dashboard } from './pages/Dashboard';
import { Players } from './pages/Players';
import { NewMatch } from './pages/NewMatch';
import { Leaderboard } from './pages/Leaderboard';
import { Settings } from './pages/Settings';
import { Help } from './pages/Help';
import { Login } from './pages/Login';

function AppContent() {
  const { theme } = useTheme();

  return (
    <FluentProvider theme={theme === 'dark' ? webDarkTheme : webLightTheme}>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<AppLayout />}>
              <Route index element={<Dashboard />} />
              <Route path="players" element={<Players />} />
              <Route path="match/new" element={<NewMatch />} />
              <Route path="leaderboard" element={<Leaderboard />} />
              <Route path="settings" element={<Settings />} />
              <Route path="help" element={<Help />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </FluentProvider>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

export default App;
