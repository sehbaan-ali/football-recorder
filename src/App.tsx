import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { FluentProvider, webLightTheme } from '@fluentui/react-components';
import { AuthProvider } from './contexts/AuthContext';
import { AppLayout } from './components/layout/AppLayout';
import { Dashboard } from './pages/Dashboard';
import { Players } from './pages/Players';
import { NewMatch } from './pages/NewMatch';
import { Leaderboard } from './pages/Leaderboard';
import { Login } from './pages/Login';

function App() {
  return (
    <FluentProvider theme={webLightTheme}>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<AppLayout />}>
              <Route index element={<Dashboard />} />
              <Route path="players" element={<Players />} />
              <Route path="match/new" element={<NewMatch />} />
              <Route path="leaderboard" element={<Leaderboard />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </FluentProvider>
  );
}

export default App;
