import React from 'react';
import { Link as RouterLink, Outlet, useLocation } from 'react-router-dom';
import {
  AppBar,
  Box,
  Container,
  Link,
  Toolbar,
  Typography,
  Button,
  useTheme
} from '@mui/material';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import ExploreIcon from '@mui/icons-material/Explore';
import RadarIcon from '@mui/icons-material/Radar';
import HomeIcon from '@mui/icons-material/Home';
import PublicIcon from '@mui/icons-material/Public';

const MainLayout: React.FC = () => {
  const theme = useTheme();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  const menuItems = [
    { path: '/', label: 'Accueil', icon: <HomeIcon /> },
    { path: '/explore', label: 'Explorer', icon: <ExploreIcon /> },
    { path: '/missions', label: 'Missions', icon: <RocketLaunchIcon /> },
    { path: '/space-watch', label: 'Space Watch', icon: <RadarIcon /> },
    { path: '/earth-view', label: 'Vue de la Terre', icon: <PublicIcon /> }
  ];

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AppBar position="static" color="default" elevation={0}>
        <Container maxWidth="lg">
          <Toolbar>
            <Typography
              variant="h6"
              noWrap
              component={RouterLink}
              to="/"
              sx={{
                mr: 2,
                fontFamily: 'monospace',
                fontWeight: 700,
                letterSpacing: '.3rem',
                color: 'inherit',
                textDecoration: 'none',
                flexGrow: { xs: 1, md: 0 }
              }}
            >
              NASA EXPLORER
            </Typography>

            <Box sx={{ 
              display: 'flex', 
              gap: 2,
              ml: { xs: 0, md: 4 },
              flexGrow: 1,
              justifyContent: 'center'
            }}>
              {menuItems.map((item) => (
                <Button
                  key={item.path}
                  component={RouterLink}
                  to={item.path}
                  startIcon={item.icon}
                  sx={{
                    color: isActive(item.path) ? 'primary.main' : 'text.primary',
                    borderBottom: isActive(item.path) ? 2 : 0,
                    borderColor: 'primary.main',
                    borderRadius: 0,
                    px: 2,
                    '&:hover': {
                      backgroundColor: 'transparent',
                      color: 'primary.main'
                    }
                  }}
                >
                  {item.label}
                </Button>
              ))}
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      <Box component="main" sx={{ flexGrow: 1 }}>
        <Outlet />
      </Box>

      <Box
        component="footer"
        sx={{
          py: 3,
          px: 2,
          mt: 'auto',
          backgroundColor: (theme) =>
            theme.palette.mode === 'light'
              ? theme.palette.grey[200]
              : theme.palette.grey[800],
        }}
      >
        <Container maxWidth="lg">
          <Typography variant="body2" color="text.secondary" align="center">
            {'Données fournies par '}
            <Link
              color="inherit"
              href="https://api.nasa.gov/"
              target="_blank"
              rel="noopener noreferrer"
            >
              NASA Open APIs
            </Link>
          </Typography>
        </Container>
      </Box>
    </Box>
  );
};

export default MainLayout;
