import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import ExploreIcon from '@mui/icons-material/Explore';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import PublicIcon from '@mui/icons-material/Public';
import WatchLaterIcon from '@mui/icons-material/WatchLater';
import { colors } from '../theme/colors';

const Navbar = () => {
  return (
    <AppBar position="sticky" elevation={0}>
      <Toolbar>
        <Typography
          variant="h6"
          component={RouterLink}
          to="/"
          sx={{
            textDecoration: 'none',
            color: colors.text.primary,
            fontWeight: 700,
            background: colors.gradients.primary,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            mr: 4,
          }}
        >
          NASA EXPLORER
        </Typography>

        <Box sx={{ flexGrow: 1, display: 'flex', gap: 2 }}>
          <Button
            component={RouterLink}
            to="/"
            startIcon={<ExploreIcon />}
            sx={{
              color: colors.text.primary,
              '&:hover': {
                background: `${colors.primary.main}1A`,
              },
            }}
          >
            Accueil
          </Button>
          
          <Button
            component={RouterLink}
            to="/explore"
            startIcon={<RocketLaunchIcon />}
            sx={{
              color: colors.text.primary,
              '&:hover': {
                background: `${colors.primary.main}1A`,
              },
            }}
          >
            Explorer
          </Button>

          <Button
            component={RouterLink}
            to="/earth-view"
            startIcon={<PublicIcon />}
            sx={{
              color: colors.text.primary,
              '&:hover': {
                background: `${colors.primary.main}1A`,
              },
            }}
          >
            Vue de la Terre
          </Button>

          <Button
            component={RouterLink}
            to="/space-watch"
            startIcon={<WatchLaterIcon />}
            sx={{
              color: colors.text.primary,
              '&:hover': {
                background: `${colors.primary.main}1A`,
              },
            }}
          >
            Space Watch
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
