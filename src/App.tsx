import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { FluentProvider, webLightTheme } from '@fluentui/react-components';
import { AppLayout } from './components/layout/AppLayout';
import { Dashboard } from './pages/Dashboard';
import { Players } from './pages/Players';
import { NewMatch } from './pages/NewMatch';
import { Leaderboard } from './pages/Leaderboard';

function App() {
  return (
    <FluentProvider theme={webLightTheme}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<AppLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="players" element={<Players />} />
            <Route path="match/new" element={<NewMatch />} />
            <Route path="leaderboard" element={<Leaderboard />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </FluentProvider>
  );
}

export default App;
