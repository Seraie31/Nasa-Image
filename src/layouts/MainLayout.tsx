import React from 'react';
import { Box, Container, AppBar, Toolbar, Typography, IconButton, Button } from '@mui/material';
import { Outlet, useNavigate } from 'react-router-dom';
import HomeIcon from '@mui/icons-material/Home';
import ExploreIcon from '@mui/icons-material/Explore';

const MainLayout: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
            onClick={() => navigate('/')}
          >
            <HomeIcon />
          </IconButton>
          <Typography 
            variant="h6" 
            component="div" 
            sx={{ flexGrow: 1, cursor: 'pointer' }}
            onClick={() => navigate('/')}
          >
            NASA Image Explorer
          </Typography>
          <Button 
            color="inherit" 
            startIcon={<ExploreIcon />}
            onClick={() => navigate('/explore')}
          >
            Explorer
          </Button>
        </Toolbar>
      </AppBar>
      
      <Container component="main" sx={{ flex: 1, py: 4 }}>
        <Outlet />
      </Container>

      <Box component="footer" sx={{ py: 3, px: 2, mt: 'auto', backgroundColor: 'background.paper' }}>
        <Container maxWidth="sm">
          <Typography variant="body2" color="text.secondary" align="center">
            {new Date().getFullYear()} NASA Image Explorer. créee par seraie1974@gmail.com
          </Typography>
        </Container>
      </Box>
    </Box>
  );
};

export default MainLayout;
