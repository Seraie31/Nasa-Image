import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { theme } from './theme';
import MainLayout from './components/MainLayout';
import ErrorBoundary from './components/ErrorBoundary';

// Lazy load pages
const Home = React.lazy(() => import('./pages/Home'));
const Explore = React.lazy(() => import('./pages/Explore'));
const Missions = React.lazy(() => import('./pages/Missions'));
const ImageDetail = React.lazy(() => import('./pages/ImageDetail'));
const SpaceWatch = React.lazy(() => import('./pages/SpaceWatch'));

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <ErrorBoundary>
          <React.Suspense fallback={
            <div style={{ 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center', 
              height: '100vh' 
            }}>
              Chargement...
            </div>
          }>
            <Routes>
              <Route path="/" element={<MainLayout />}>
                <Route index element={<Home />} />
                <Route path="explore" element={<Explore />} />
                <Route path="missions" element={<Missions />} />
                <Route path="space-watch" element={<SpaceWatch />} />
                <Route path="image/:id" element={<ImageDetail />} />
              </Route>
            </Routes>
          </React.Suspense>
        </ErrorBoundary>
      </Router>
    </ThemeProvider>
  );
}

export default App;
