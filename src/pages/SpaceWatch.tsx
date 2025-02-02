import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  Grid,
  Card,
  CardContent,
  Button,
  Chip,
  CircularProgress,
  Alert,
  Rating,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  useTheme,
  Tabs,
  Tab,
  Stack,
  Divider
} from '@mui/material';
import { getNeoFeed, NearEarthObject, calculateDangerLevel, formatVelocity, formatDistance } from '../services/neoApi';
import { formatDateForApod } from '../utils/dateUtils';
import WarningIcon from '@mui/icons-material/Warning';
import SpeedIcon from '@mui/icons-material/Speed';
import ExploreIcon from '@mui/icons-material/Explore';
import DateRangeIcon from '@mui/icons-material/DateRange';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`neo-tabpanel-${index}`}
      aria-labelledby={`neo-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

const TimelineItem: React.FC<{ neo: NearEarthObject; onClick: () => void; isLeft: boolean }> = ({ neo, onClick, isLeft }) => {
  const dangerLevel = calculateDangerLevel(neo);
  const approach = neo.close_approach_data[0];

  return (
    <Box sx={{ display: 'flex', mb: 4, justifyContent: isLeft ? 'flex-start' : 'flex-end' }}>
      <Card 
        sx={{ 
          width: '45%',
          cursor: 'pointer',
          position: 'relative',
          '&:hover': {
            transform: 'translateY(-4px)',
            transition: 'transform 0.2s'
          },
          '&::after': {
            content: '""',
            position: 'absolute',
            top: '50%',
            [isLeft ? 'right' : 'left']: -20,
            width: 20,
            height: 2,
            bgcolor: dangerLevel >= 3 ? 'error.main' : 'primary.main'
          }
        }}
        onClick={onClick}
      >
        <CardContent>
          <Typography variant="h6" component="div">
            {neo.name.replace('(', '').replace(')', '')}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <Rating 
              value={dangerLevel} 
              readOnly 
              max={5}
              icon={<WarningIcon color="error" />}
              emptyIcon={<WarningIcon color="disabled" />}
            />
          </Box>
          <Typography variant="body2" color="text.secondary">
            Date d'approche: {new Date(approach.close_approach_date).toLocaleDateString()}
          </Typography>
          <Typography variant="body2">
            Distance: {formatDistance(approach.miss_distance.lunar, 'lunar')} distances lunaires
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
};

const SpaceWatch: React.FC = () => {
  const theme = useTheme();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [neoData, setNeoData] = useState<NearEarthObject[]>([]);
  const [selectedNeo, setSelectedNeo] = useState<NearEarthObject | null>(null);
  const [tabValue, setTabValue] = useState(0);

  useEffect(() => {
    const fetchNeoData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const today = new Date();
        const endDate = new Date();
        endDate.setDate(today.getDate() + 7);

        const feed = await getNeoFeed(
          formatDateForApod(today),
          formatDateForApod(endDate)
        );

        const allNeos = Object.values(feed.near_earth_objects).flat();
        setNeoData(allNeos);
      } catch (err) {
        console.error('Error fetching NEO data:', err);
        setError(
          err instanceof Error 
            ? err.message 
            : 'Erreur lors du chargement des données'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchNeoData();
  }, []);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleNeoClick = (neo: NearEarthObject) => {
    setSelectedNeo(neo);
  };

  const handleCloseDialog = () => {
    setSelectedNeo(null);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h3" component="h1" gutterBottom align="center">
        Space Watch
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" align="center" paragraph>
        Surveillance des objets géocroiseurs (NEO) pour les 7 prochains jours
      </Typography>

      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={tabValue} onChange={handleTabChange} centered>
          <Tab label="Timeline" />
          <Tab label="Liste" />
        </Tabs>
      </Box>

      <TabPanel value={tabValue} index={0}>
        <Box sx={{ position: 'relative' }}>
          <Box sx={{
            position: 'absolute',
            left: '50%',
            top: 0,
            bottom: 0,
            width: 2,
            bgcolor: 'divider',
            transform: 'translateX(-50%)'
          }} />
          <Stack spacing={2}>
            {neoData.map((neo, index) => (
              <TimelineItem 
                key={neo.id}
                neo={neo}
                onClick={() => handleNeoClick(neo)}
                isLeft={index % 2 === 0}
              />
            ))}
          </Stack>
        </Box>
      </TabPanel>

      <TabPanel value={tabValue} index={1}>
        <Grid container spacing={3}>
          {neoData.map((neo) => {
            const dangerLevel = calculateDangerLevel(neo);
            const approach = neo.close_approach_data[0];
            return (
              <Grid item xs={12} sm={6} md={4} key={neo.id}>
                <Card 
                  sx={{ 
                    height: '100%',
                    cursor: 'pointer',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      transition: 'transform 0.2s'
                    }
                  }}
                  onClick={() => handleNeoClick(neo)}
                >
                  <CardContent>
                    <Typography variant="h6" component="div" gutterBottom>
                      {neo.name.replace('(', '').replace(')', '')}
                    </Typography>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Rating 
                        value={dangerLevel} 
                        readOnly 
                        max={5}
                        icon={<WarningIcon color="error" />}
                        emptyIcon={<WarningIcon color="disabled" />}
                      />
                    </Box>

                    <Typography variant="body2" color="text.secondary" paragraph>
                      <DateRangeIcon sx={{ verticalAlign: 'middle', mr: 1 }} />
                      {new Date(approach.close_approach_date).toLocaleDateString()}
                    </Typography>

                    <Typography variant="body2" paragraph>
                      <SpeedIcon sx={{ verticalAlign: 'middle', mr: 1 }} />
                      {formatVelocity(approach.relative_velocity.kilometers_per_hour)} km/h
                    </Typography>

                    <Box sx={{ mt: 2 }}>
                      {neo.is_potentially_hazardous_asteroid && (
                        <Chip 
                          label="Potentiellement dangereux" 
                          color="error" 
                          size="small" 
                          sx={{ mr: 1 }}
                        />
                      )}
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      </TabPanel>

      <Dialog
        open={!!selectedNeo}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
      >
        {selectedNeo && (
          <>
            <DialogTitle>
              <Typography variant="h5">
                {selectedNeo.name.replace('(', '').replace(')', '')}
              </Typography>
              <Rating 
                value={calculateDangerLevel(selectedNeo)} 
                readOnly 
                max={5}
                icon={<WarningIcon color="error" />}
                emptyIcon={<WarningIcon color="disabled" />}
              />
            </DialogTitle>
            <DialogContent>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Paper sx={{ p: 2 }}>
                    <Typography variant="h6" gutterBottom>
                      Caractéristiques
                    </Typography>
                    <Typography variant="body2" paragraph>
                      Diamètre estimé: {' '}
                      {formatDistance(String(selectedNeo.estimated_diameter.kilometers.estimated_diameter_min), 'km')} - {' '}
                      {formatDistance(String(selectedNeo.estimated_diameter.kilometers.estimated_diameter_max), 'km')} km
                    </Typography>
                    <Typography variant="body2" paragraph>
                      Magnitude absolue: {selectedNeo.absolute_magnitude_h}
                    </Typography>
                    {selectedNeo.is_potentially_hazardous_asteroid && (
                      <Alert severity="warning" sx={{ mt: 2 }}>
                        Cet astéroïde est classé comme potentiellement dangereux
                      </Alert>
                    )}
                  </Paper>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Paper sx={{ p: 2 }}>
                    <Typography variant="h6" gutterBottom>
                      Approche la plus proche
                    </Typography>
                    {selectedNeo.close_approach_data.map((approach, index) => (
                      <Box key={index} sx={{ mb: 2 }}>
                        <Typography variant="body2" paragraph>
                          Date: {new Date(approach.close_approach_date).toLocaleDateString()}
                        </Typography>
                        <Typography variant="body2" paragraph>
                          Distance: {formatDistance(approach.miss_distance.lunar, 'lunar')} distances lunaires
                          ({formatDistance(approach.miss_distance.kilometers, 'km')} km)
                        </Typography>
                        <Typography variant="body2">
                          Vitesse relative: {formatVelocity(approach.relative_velocity.kilometers_per_hour)} km/h
                        </Typography>
                      </Box>
                    ))}
                  </Paper>
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDialog}>Fermer</Button>
              <Button 
                href={selectedNeo.nasa_jpl_url} 
                target="_blank" 
                rel="noopener noreferrer"
                variant="contained"
              >
                Plus d'informations
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Container>
  );
};

export default SpaceWatch;
