import React, { useEffect, useState } from 'react';
import {
  Container,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  Chip,
  LinearProgress,
  Alert,
  CardActions,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import { getMissions, Mission } from '../services/missionsApi';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import SatelliteAltIcon from '@mui/icons-material/SatelliteAlt';
import TravelExploreIcon from '@mui/icons-material/TravelExplore';
import ExploreIcon from '@mui/icons-material/Explore';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import BuildIcon from '@mui/icons-material/Build';

const Missions: React.FC = () => {
  const [missions, setMissions] = useState<Mission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedMission, setSelectedMission] = useState<Mission | null>(null);

  useEffect(() => {
    const fetchMissions = async () => {
      try {
        const data = await getMissions();
        setMissions(data);
      } catch (err) {
        setError('Erreur lors du chargement des missions');
      } finally {
        setLoading(false);
      }
    };

    fetchMissions();
  }, []);

  const getStatusColor = (status: Mission['status']) => {
    switch (status) {
      case 'active':
        return 'success';
      case 'completed':
        return 'info';
      case 'planned':
        return 'warning';
      default:
        return 'default';
    }
  };

  const getStatusLabel = (status: Mission['status']) => {
    switch (status) {
      case 'active':
        return 'Active';
      case 'completed':
        return 'Terminée';
      case 'planned':
        return 'Planifiée';
      default:
        return status;
    }
  };

  const getMissionIcon = (type: Mission['type']) => {
    switch (type) {
      case 'rover':
        return <ExploreIcon />;
      case 'satellite':
        return <SatelliteAltIcon />;
      case 'probe':
        return <RocketLaunchIcon />;
      case 'telescope':
        return <TravelExploreIcon />;
      default:
        return <RocketLaunchIcon />;
    }
  };

  if (loading) {
    return (
      <Container>
        <Box sx={{ width: '100%', mt: 4 }}>
          <LinearProgress />
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <Alert severity="error" sx={{ mt: 4 }}>
          {error}
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Typography variant="h2" component="h1" gutterBottom align="center">
          Missions Spatiales
        </Typography>

        <Grid container spacing={4}>
          {missions.map((mission) => (
            <Grid item xs={12} md={6} lg={4} key={mission.id}>
              <Card 
                sx={{ 
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'transform 0.2s',
                  '&:hover': { transform: 'scale(1.02)' }
                }}
              >
                <CardMedia
                  component="img"
                  height="200"
                  image={mission.imageUrl}
                  alt={mission.name}
                />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    {getMissionIcon(mission.type)}
                    <Typography variant="h5" component="div" sx={{ ml: 1 }}>
                      {mission.name}
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    {mission.description}
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    <Chip
                      label={getStatusLabel(mission.status)}
                      color={getStatusColor(mission.status)}
                      size="small"
                    />
                    {mission.launchDate && (
                      <Chip
                        label={`Lancée le ${new Date(mission.launchDate).toLocaleDateString()}`}
                        variant="outlined"
                        size="small"
                      />
                    )}
                  </Box>
                </CardContent>
                <CardActions>
                  <Button 
                    size="small" 
                    color="primary"
                    onClick={() => setSelectedMission(mission)}
                  >
                    En savoir plus
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      <Dialog
        open={!!selectedMission}
        onClose={() => setSelectedMission(null)}
        maxWidth="md"
        fullWidth
      >
        {selectedMission && (
          <>
            <DialogTitle>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                {getMissionIcon(selectedMission.type)}
                <Typography variant="h6" sx={{ ml: 1 }}>
                  {selectedMission.name}
                </Typography>
              </Box>
            </DialogTitle>
            <DialogContent dividers>
              <Box sx={{ mb: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Objectifs de la mission
                </Typography>
                <List>
                  {selectedMission.details.objectives.map((objective, index) => (
                    <ListItem key={index}>
                      <ListItemIcon>
                        <RadioButtonUncheckedIcon color="primary" />
                      </ListItemIcon>
                      <ListItemText primary={objective} />
                    </ListItem>
                  ))}
                </List>
              </Box>

              {selectedMission.details.technology && (
                <Box sx={{ mb: 3 }}>
                  <Typography variant="h6" gutterBottom>
                    Technologies utilisées
                  </Typography>
                  <List>
                    {selectedMission.details.technology.map((tech, index) => (
                      <ListItem key={index}>
                        <ListItemIcon>
                          <BuildIcon color="primary" />
                        </ListItemIcon>
                        <ListItemText primary={tech} />
                      </ListItem>
                    ))}
                  </List>
                </Box>
              )}

              {selectedMission.details.achievements && (
                <Box>
                  <Typography variant="h6" gutterBottom>
                    Réalisations
                  </Typography>
                  <List>
                    {selectedMission.details.achievements.map((achievement, index) => (
                      <ListItem key={index}>
                        <ListItemIcon>
                          <CheckCircleIcon color="success" />
                        </ListItemIcon>
                        <ListItemText primary={achievement} />
                      </ListItem>
                    ))}
                  </List>
                </Box>
              )}
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setSelectedMission(null)}>Fermer</Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Container>
  );
};

export default Missions;
