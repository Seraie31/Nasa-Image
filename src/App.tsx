import React from 'react';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import theme from './theme/theme';
import MainLayout from './layouts/MainLayout';

// Lazy load pages
const Home = React.lazy(() => import('./pages/Home'));
const ImageDetail = React.lazy(() => import('./pages/ImageDetail'));
const Explore = React.lazy(() => import('./pages/Explore'));

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <React.Suspense fallback={<div>Loading...</div>}>
          <Routes>
            <Route path="/" element={<MainLayout />}>
              <Route index element={<Home />} />
              <Route path="explore" element={<Explore />} />
              <Route path="image/:id" element={<ImageDetail />} />
            </Route>
          </Routes>
        </React.Suspense>
      </Router>
    </ThemeProvider>
  );
}

export default App;
