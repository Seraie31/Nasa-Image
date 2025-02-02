import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Card,
  CardContent,
  CardMedia,
  CardActions,
  Typography,
  Chip,
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Paper,
  Stack,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Tooltip,
  Tab,
  Tabs,
  Alert,
  LinearProgress,
  List,
  ListItem,
  ListItemIcon,
  ListItemText
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
import MissionTimeline from '../components/MissionTimeline';
import MissionGlobe from '../components/MissionGlobe';

import '../styles/animations.css';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel = (props: TabPanelProps) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`mission-tabpanel-${index}`}
      aria-labelledby={`mission-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
};

const Missions = () => {
  const [missions, setMissions] = useState<Mission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedMission, setSelectedMission] = useState<Mission | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<MissionStatus | 'all'>('all');
  const [typeFilter, setTypeFilter] = useState<MissionType | 'all'>('all');
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const loadMissions = async () => {
    try {
      setLoading(true);
      const data = await getMissions();
      setMissions(data);
      setError(null);
      setLastUpdate(new Date());
    } catch (err) {
      setError("Erreur lors du chargement des missions");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMissions();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      loadMissions();
    }, 5 * 60 * 1000); // 5 minutes

    return () => clearInterval(interval);
  }, []);

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
    <Container maxWidth="lg" sx={{ py: 4 }} className="fade-in">
      <Typography variant="h3" component="h1" gutterBottom align="center" className="slide-up">
        Missions Spatiales
      </Typography>

      <Typography 
        variant="body2" 
        color="text.secondary" 
        align="center" 
        sx={{ mb: 2 }}
        className="slide-up"
      >
        Dernière mise à jour : {lastUpdate.toLocaleString()}
      </Typography>

      {/* Filtres */}
      <Paper sx={{ p: 2, mb: 4 }} className="scale-in">
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

      {/* Onglets */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }} className="fade-in">
        <Tabs 
          value={tabValue} 
          onChange={handleTabChange} 
          aria-label="mission views"
          className="tab-transition"
        >
          <Tab label="Carte" />
          <Tab label="Timeline" />
          <Tab label="Grille" />
        </Tabs>
      </Box>

      {/* Vue Carte */}
      <TabPanel value={tabValue} index={0}>
        <div className={`globe-container ${tabValue === 0 ? 'fade-in' : ''}`}>
          <MissionGlobe missions={filteredMissions} />
        </div>
      </TabPanel>

      {/* Vue Timeline */}
      <TabPanel value={tabValue} index={1}>
        <div className={`timeline-progress ${tabValue === 1 ? 'fade-in' : ''}`}>
          <MissionTimeline missions={filteredMissions} />
        </div>
      </TabPanel>

      {/* Vue Grille */}
      <TabPanel value={tabValue} index={2}>
        <Grid container spacing={4}>
          {filteredMissions.map((mission, index) => (
            <Grid item key={mission.id} xs={12} sm={6} md={4}>
              <Card 
                className="mission-card scale-in"
                sx={{ 
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
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
      </TabPanel>

      {/* Dialog des détails */}
      <Dialog
        open={!!selectedMission}
        onClose={handleClose}
        maxWidth="md"
        fullWidth
        className="scale-in"
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
