import React from 'react';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import theme from './theme/theme';
import MainLayout from './layouts/MainLayout';
import ErrorBoundary from './components/ErrorBoundary';

// Lazy load pages
const Home = React.lazy(() => import('./pages/Home'));
const ImageDetail = React.lazy(() => import('./pages/ImageDetail'));
const Explore = React.lazy(() => import('./pages/Explore'));
const Missions = React.lazy(() => import('./pages/Missions'));

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <ErrorBoundary>
          <React.Suspense fallback={<div>Loading...</div>}>
            <Routes>
              <Route path="/" element={<MainLayout />}>
                <Route index element={<Home />} />
                <Route path="explore" element={<Explore />} />
                <Route path="missions" element={<Missions />} />
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
