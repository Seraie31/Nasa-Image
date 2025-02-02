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
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stack,
  Paper,
  IconButton,
  Tooltip,
} from '@mui/material';
import { getMissions } from '../services/missionsApi';
import type { Mission, MissionType, MissionStatus } from '../services/missionsApi';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import SatelliteAltIcon from '@mui/icons-material/SatelliteAlt';
import TravelExploreIcon from '@mui/icons-material/TravelExplore';
import ExploreIcon from '@mui/icons-material/Explore';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import BuildIcon from '@mui/icons-material/Build';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';

const Missions = () => {
  const [missions, setMissions] = useState<Mission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedMission, setSelectedMission] = useState<Mission | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<MissionStatus | 'all'>('all');
  const [typeFilter, setTypeFilter] = useState<MissionType | 'all'>('all');

  useEffect(() => {
    loadMissions();
  }, []);

  const loadMissions = async () => {
    try {
      const data = await getMissions();
      setMissions(data);
      setError(null);
    } catch (err) {
      setError("Erreur lors du chargement des missions");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setSelectedMission(null);
  };

  const filteredMissions = missions.filter(mission => {
    const matchesSearch = mission.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         mission.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || mission.status === statusFilter;
    const matchesType = typeFilter === 'all' || mission.type === typeFilter;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  const getMissionIcon = (type: MissionType) => {
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

  const getStatusColor = (status: MissionStatus) => {
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

  const getStatusLabel = (status: MissionStatus) => {
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

  const getTypeLabel = (type: MissionType) => {
    switch (type) {
      case 'rover':
        return 'Rover';
      case 'satellite':
        return 'Satellite';
      case 'probe':
        return 'Sonde';
      case 'telescope':
        return 'Télescope';
      default:
        return type;
    }
  };

  if (loading) {
    return (
      <Container>
        <LinearProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container sx={{ py: 4 }}>
      <Typography variant="h3" component="h1" gutterBottom align="center">
        Missions Spatiales
      </Typography>

      {/* Filtres */}
      <Paper sx={{ p: 2, mb: 4 }}>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
          <TextField
            label="Rechercher une mission"
            variant="outlined"
            fullWidth
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: <SearchIcon sx={{ color: 'action.active', mr: 1 }} />,
              endAdornment: searchQuery && (
                <IconButton size="small" onClick={() => setSearchQuery('')}>
                  <ClearIcon />
                </IconButton>
              ),
            }}
          />
          
          <FormControl fullWidth>
            <InputLabel>Statut</InputLabel>
            <Select
              value={statusFilter}
              label="Statut"
              onChange={(e) => setStatusFilter(e.target.value as MissionStatus | 'all')}
            >
              <MenuItem value="all">Tous les statuts</MenuItem>
              <MenuItem value="active">Active</MenuItem>
              <MenuItem value="completed">Terminée</MenuItem>
              <MenuItem value="planned">Planifiée</MenuItem>
            </Select>
          </FormControl>

          <FormControl fullWidth>
            <InputLabel>Type</InputLabel>
            <Select
              value={typeFilter}
              label="Type"
              onChange={(e) => setTypeFilter(e.target.value as MissionType | 'all')}
            >
              <MenuItem value="all">Tous les types</MenuItem>
              <MenuItem value="rover">Rover</MenuItem>
              <MenuItem value="satellite">Satellite</MenuItem>
              <MenuItem value="probe">Sonde</MenuItem>
              <MenuItem value="telescope">Télescope</MenuItem>
            </Select>
          </FormControl>
        </Stack>
      </Paper>

      {/* Résultats */}
      {filteredMissions.length === 0 ? (
        <Alert severity="info">
          Aucune mission ne correspond à vos critères de recherche.
        </Alert>
      ) : (
        <Grid container spacing={4}>
          {filteredMissions.map((mission) => (
            <Grid item key={mission.id} xs={12} sm={6} md={4}>
              <Card 
                sx={{ 
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'transform 0.2s',
                  '&:hover': {
                    transform: 'scale(1.02)',
                  },
                }}
              >
                <CardMedia
                  component="img"
                  height="200"
                  image={mission.imageUrl}
                  alt={mission.name}
                  sx={{ 
                    objectFit: 'cover',
                    bgcolor: 'black'
                  }}
                  onError={(e: any) => {
                    e.target.src = 'https://www.nasa.gov/wp-content/uploads/2023/03/nasa-logo-web-rgb.png';
                  }}
                />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Tooltip title={getTypeLabel(mission.type)}>
                      <Box sx={{ mr: 2 }}>{getMissionIcon(mission.type)}</Box>
                    </Tooltip>
                    <Typography gutterBottom variant="h5" component="div">
                      {mission.name}
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    {mission.description}
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 'auto' }}>
                    <Chip
                      label={getStatusLabel(mission.status)}
                      color={getStatusColor(mission.status)}
                      size="small"
                    />
                    {mission.launchDate && (
                      <Chip
                        label={`Lancée le ${new Date(mission.launchDate).toLocaleDateString()}`}
                        size="small"
                        variant="outlined"
                      />
                    )}
                  </Box>
                </CardContent>
                <CardActions>
                  <Button
                    size="small"
                    color="primary"
                    onClick={() => setSelectedMission(mission)}
                    startIcon={<ExploreIcon />}
                    fullWidth
                  >
                    En savoir plus
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Dialog des détails */}
      <Dialog
        open={!!selectedMission}
        onClose={handleClose}
        maxWidth="md"
        fullWidth
      >
        {selectedMission && (
          <>
            <DialogTitle>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                {getMissionIcon(selectedMission.type)}
                {selectedMission.name}
              </Box>
            </DialogTitle>
            <DialogContent dividers>
              <Typography variant="h6" gutterBottom>
                Objectifs
              </Typography>
              <List>
                {selectedMission.details.objectives.map((objective, index) => (
                  <ListItem key={index}>
                    <ListItemIcon>
                      <CheckCircleIcon color="success" />
                    </ListItemIcon>
                    <ListItemText primary={objective} />
                  </ListItem>
                ))}
              </List>

              {selectedMission.details.technology && (
                <>
                  <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                    Technologies
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
                </>
              )}

              {selectedMission.details.location && (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="h6" gutterBottom>
                    Localisation
                  </Typography>
                  <Typography>
                    {selectedMission.details.location}
                  </Typography>
                </Box>
              )}
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose} color="primary">
                Fermer
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Container>
  );
};

export default Missions;
