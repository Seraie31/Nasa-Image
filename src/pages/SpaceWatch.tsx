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
  Divider,
  CardMedia,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from '@mui/material';
import {
  getNeoFeed,
  NearEarthObject,
  calculateDangerLevel,
  formatVelocity,
  formatDistance,
  getAsteroidImage
} from '../services/neoApi';
import { formatDateForApod } from '../utils/dateUtils';
import WarningIcon from '@mui/icons-material/Warning';
import SpeedIcon from '@mui/icons-material/Speed';
import ExploreIcon from '@mui/icons-material/Explore';
import DateRangeIcon from '@mui/icons-material/DateRange';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import StraightenIcon from '@mui/icons-material/Straighten';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';

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

interface TimelineItemProps {
  neo: NearEarthObject;
  onClick: () => void;
  isLeft: boolean;
  imageUrl?: string;
}

const TimelineItem: React.FC<TimelineItemProps> = ({ neo, onClick, isLeft, imageUrl }) => {
  const [loading, setLoading] = useState(true);
  const dangerLevel = calculateDangerLevel(neo);
  const approach = neo.close_approach_data[0];
  const avgDiameter = (
    neo.estimated_diameter.kilometers.estimated_diameter_min +
    neo.estimated_diameter.kilometers.estimated_diameter_max
  ) / 2;

  return (
    <Box sx={{ display: 'flex', mb: 4, justifyContent: isLeft ? 'flex-start' : 'flex-end' }}>
      <Card
        sx={{
          width: '45%',
          cursor: 'pointer',
          position: 'relative',
          borderLeft: neo.is_potentially_hazardous_asteroid ? '4px solid #f44336' : 'none',
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
        <Box sx={{ position: 'relative', height: 200 }}>
          {loading && (
            <Box sx={{ 
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              bgcolor: 'rgba(0, 0, 0, 0.1)'
            }}>
              <CircularProgress />
            </Box>
          )}
          {imageUrl && (
            <CardMedia
              component="img"
              height="200"
              image={imageUrl}
              alt={neo.name}
              sx={{
                objectFit: 'cover',
                opacity: loading ? 0 : 0.8,
                transition: 'opacity 0.3s',
                '&:hover': {
                  opacity: 1
                }
              }}
              onLoad={() => setLoading(false)}
            />
          )}
        </Box>
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
            {neo.is_potentially_hazardous_asteroid && (
              <Chip
                label="Dangereux"
                color="error"
                size="small"
                sx={{ ml: 1 }}
              />
            )}
          </Box>

          <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <DateRangeIcon sx={{ mr: 1, fontSize: 20 }} />
            {new Date(approach.close_approach_date).toLocaleDateString()}
          </Typography>

          <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <ExploreIcon sx={{ mr: 1, fontSize: 20 }} />
            {formatDistance(approach.miss_distance.lunar, 'lunar')} distances lunaires
          </Typography>

          <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <SpeedIcon sx={{ mr: 1, fontSize: 20 }} />
            {formatVelocity(approach.relative_velocity.kilometers_per_hour)} km/h
          </Typography>

          <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center' }}>
            <Box component="span" sx={{
              display: 'inline-flex',
              alignItems: 'center',
              mr: 1,
              width: 20,
              height: 20,
              borderRadius: '50%',
              bgcolor: 'background.paper',
              border: '2px solid',
              borderColor: 'text.secondary'
            }} />
            {formatDistance(String(avgDiameter), 'km')} km de diamètre
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
  const [neoImages, setNeoImages] = useState<Record<string, string>>({});
  const [view, setView] = useState('timeline');

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

        // Fetch images for each NEO
        const images: Record<string, string> = {};
        for (const neo of allNeos) {
          try {
            const imageUrl = await getAsteroidImage(neo.name);
            images[neo.id] = imageUrl;
          } catch (err) {
            console.error(`Error fetching image for ${neo.name}:`, err);
          }
        }
        setNeoImages(images);
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
      <Box sx={{ p: 3 }}>
        <Typography 
          variant="h1" 
          component="h1" 
          gutterBottom 
          align="center"
          sx={{
            fontSize: { xs: '2rem', md: '3rem' },
            mb: 4,
            background: theme.palette.gradients.primary,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          Space Watch
        </Typography>
        <Typography 
          variant="subtitle1" 
          gutterBottom 
          align="center" 
          color="text.secondary"
          sx={{ mb: 6 }}
        >
          Surveillance des objets géocroiseurs (NEO) pour les 7 prochains jours
        </Typography>

        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
          <Tabs
            value={view}
            onChange={(_, newValue) => setView(newValue)}
            sx={{
              '& .MuiTabs-indicator': {
                background: theme.palette.gradients.primary,
              },
            }}
          >
            <Tab 
              label="Timeline" 
              value="timeline"
              sx={{
                color: theme.palette.text.secondary,
                '&.Mui-selected': {
                  color: theme.palette.primary.main,
                },
              }}
            />
            <Tab 
              label="Liste" 
              value="list"
              sx={{
                color: theme.palette.text.secondary,
                '&.Mui-selected': {
                  color: theme.palette.primary.main,
                },
              }}
            />
          </Tabs>
        </Box>

        {view === 'timeline' ? (
          <Grid container spacing={3}>
            {neoData.map((neo) => (
              <Grid item xs={12} sm={6} md={4} key={neo.id}>
                <Card 
                  className="slide-up card-hover"
                  sx={{
                    height: '100%',
                    background: theme.palette.background.paper,
                    backdropFilter: 'blur(10px)',
                  }}
                >
                  <CardContent>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="h6" gutterBottom>
                        {neo.name}
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 0.5, mb: 1 }}>
                        {[...Array(5)].map((_, index) => (
                          <Box
                            key={index}
                            sx={{
                              width: 20,
                              height: 20,
                              borderRadius: '4px',
                              backgroundColor: index < calculateDangerLevel(neo) 
                                ? theme.palette.status.error
                                : theme.palette.background.paper,
                              border: `1px solid ${theme.palette.border.light}`,
                            }}
                          />
                        ))}
                      </Box>
                    </Box>

                    <Stack spacing={2}>
                      <Box sx={{ 
                        display: 'flex', 
                        alignItems: 'center',
                        p: 1,
                        borderRadius: '8px',
                        background: `${theme.palette.primary.main}0A`,
                      }}>
                        <CalendarTodayIcon sx={{ mr: 1, color: theme.palette.primary.main }} />
                        <Typography>{new Date(neo.close_approach_data[0].close_approach_date).toLocaleDateString()}</Typography>
                      </Box>

                      <Box sx={{ 
                        display: 'flex', 
                        alignItems: 'center',
                        p: 1,
                        borderRadius: '8px',
                        background: `${theme.palette.primary.main}0A`,
                      }}>
                        <SpeedIcon sx={{ mr: 1, color: theme.palette.primary.main }} />
                        <Typography>{formatVelocity(neo.close_approach_data[0].relative_velocity.kilometers_per_hour)} km/h</Typography>
                      </Box>

                      <Box sx={{ 
                        display: 'flex', 
                        alignItems: 'center',
                        p: 1,
                        borderRadius: '8px',
                        background: `${theme.palette.primary.main}0A`,
                      }}>
                        <StraightenIcon sx={{ mr: 1, color: theme.palette.primary.main }} />
                        <Typography>{formatDistance(neo.close_approach_data[0].miss_distance.lunar, 'lunar')} distances lunaires</Typography>
                      </Box>

                      <Box sx={{ 
                        display: 'flex', 
                        alignItems: 'center',
                        p: 1,
                        borderRadius: '8px',
                        background: `${theme.palette.primary.main}0A`,
                      }}>
                        <RadioButtonUncheckedIcon sx={{ mr: 1, color: theme.palette.primary.main }} />
                        <Typography>{formatDistance(String((neo.estimated_diameter.kilometers.estimated_diameter_min + neo.estimated_diameter.kilometers.estimated_diameter_max) / 2), 'km')} km de diamètre</Typography>
                      </Box>
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        ) : (
          <TableContainer 
            component={Paper}
            sx={{
              background: theme.palette.background.paper,
              backdropFilter: 'blur(10px)',
            }}
          >
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ color: theme.palette.primary.main, fontWeight: 600 }}>Nom</TableCell>
                  <TableCell sx={{ color: theme.palette.primary.main, fontWeight: 600 }}>Date</TableCell>
                  <TableCell sx={{ color: theme.palette.primary.main, fontWeight: 600 }}>Vitesse</TableCell>
                  <TableCell sx={{ color: theme.palette.primary.main, fontWeight: 600 }}>Distance</TableCell>
                  <TableCell sx={{ color: theme.palette.primary.main, fontWeight: 600 }}>Risque</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {neoData.map((neo) => (
                  <TableRow 
                    key={neo.id}
                    sx={{
                      '&:hover': {
                        background: `${theme.palette.primary.main}0A`,
                      },
                    }}
                  >
                    <TableCell>{neo.name}</TableCell>
                    <TableCell>{new Date(neo.close_approach_data[0].close_approach_date).toLocaleDateString()}</TableCell>
                    <TableCell>{formatVelocity(neo.close_approach_data[0].relative_velocity.kilometers_per_hour)} km/h</TableCell>
                    <TableCell>{formatDistance(neo.close_approach_data[0].miss_distance.lunar, 'lunar')} DL</TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', gap: 0.5 }}>
                        {[...Array(5)].map((_, index) => (
                          <Box
                            key={index}
                            sx={{
                              width: 16,
                              height: 16,
                              borderRadius: '4px',
                              backgroundColor: index < calculateDangerLevel(neo) 
                                ? theme.palette.status.error
                                : theme.palette.background.paper,
                              border: `1px solid ${theme.palette.border.light}`,
                            }}
                          />
                        ))}
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Box>
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
