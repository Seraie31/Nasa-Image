import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardMedia,
  CardContent,
  Grid,
  Container,
  Button,
  Paper,
  Chip,
  IconButton,
  Tooltip,
  Divider,
  LinearProgress,
  Alert,
  CardActions,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Link as RouterLink } from 'react-router-dom';
import { getImageOfTheDay } from '../services/nasaApi';
import { NasaImage } from '../models/types';
import ExploreIcon from '@mui/icons-material/Explore';
import ViewInArIcon from '@mui/icons-material/ViewInAr';
import NewReleasesIcon from '@mui/icons-material/NewReleases';
import ShareIcon from '@mui/icons-material/Share';
import FavoriteIcon from '@mui/icons-material/Favorite';
import InfoIcon from '@mui/icons-material/Info';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import SatelliteAltIcon from '@mui/icons-material/SatelliteAlt';
import PublicIcon from '@mui/icons-material/Public';

const funFacts = [
  "La Station Spatiale Internationale fait le tour de la Terre toutes les 90 minutes.",
  "Un jour sur Vénus est plus long qu'une année sur Vénus.",
  "La lumière du Soleil met environ 8 minutes pour atteindre la Terre.",
  "Il y a plus d'arbres sur Terre que d'étoiles dans la Voie Lactée.",
  "La plus grande tempête connue dans le système solaire est la Grande Tache Rouge de Jupiter.",
];

const Home: React.FC = () => {
  const [imageOfDay, setImageOfDay] = useState<NasaImage | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentFact, setCurrentFact] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchImageOfDay = async () => {
      try {
        const image = await getImageOfTheDay();
        setImageOfDay(image);
      } catch (error) {
        console.error('Error fetching image of the day:', error);
        setError('Erreur lors du chargement de l\'image du jour');
      } finally {
        setLoading(false);
      }
    };

    fetchImageOfDay();

    // Rotation automatique des faits
    const interval = setInterval(() => {
      setCurrentFact((prev) => (prev + 1) % funFacts.length);
    }, 8000);

    return () => clearInterval(interval);
  }, []);

  const handleShare = () => {
    if (imageOfDay) {
      navigator.clipboard.writeText(
        `Découvrez l'image NASA du jour : ${imageOfDay.title} - ${window.location.href}`
      );
      alert('Lien copié dans le presse-papiers !');
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
          Explorez l'Univers avec NASA Image
        </Typography>

        {/* Fait aléatoire */}
        <Paper 
          elevation={3} 
          sx={{ 
            p: 2, 
            mb: 4, 
            bgcolor: 'primary.dark',
            color: 'white',
            display: 'flex',
            alignItems: 'center'
          }}
        >
          <RocketLaunchIcon sx={{ mr: 2, fontSize: 40 }} />
          <Typography variant="h6">
            Le saviez-vous ? {funFacts[currentFact]}
          </Typography>
        </Paper>
        
        {imageOfDay && (
          <Card sx={{ maxWidth: '100%', mt: 4, mb: 4 }}>
            <Box sx={{ position: 'relative' }}>
              <CardMedia
                component="img"
                height="600"
                image={imageOfDay.url}
                alt={imageOfDay.title}
                sx={{ objectFit: 'cover' }}
              />
              <Box
                sx={{
                  position: 'absolute',
                  top: 16,
                  right: 16,
                  display: 'flex',
                  gap: 1,
                }}
              >
                <Tooltip title="Partager">
                  <IconButton
                    onClick={handleShare}
                    sx={{ bgcolor: 'rgba(0, 0, 0, 0.5)', color: 'white' }}
                  >
                    <ShareIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Ajouter aux favoris">
                  <IconButton
                    sx={{ bgcolor: 'rgba(0, 0, 0, 0.5)', color: 'white' }}
                  >
                    <FavoriteIcon />
                  </IconButton>
                </Tooltip>
              </Box>
            </Box>
            <CardContent>
              <Typography gutterBottom variant="h5" component="div">
                Image du Jour : {imageOfDay.title}
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                {imageOfDay.description}
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                <Chip 
                  label={new Date(imageOfDay.date).toLocaleDateString()} 
                  variant="outlined" 
                  size="small"
                />
                {imageOfDay.hdurl && (
                  <Chip 
                    label="HD disponible" 
                    color="primary" 
                    variant="outlined" 
                    size="small"
                  />
                )}
              </Box>
              <Button 
                variant="contained" 
                color="primary"
                onClick={() => navigate(`/image/${imageOfDay.id}`)}
                startIcon={<InfoIcon />}
              >
                Voir les détails
              </Button>
            </CardContent>
          </Card>
        )}

        <Divider sx={{ my: 4 }}>
          <Chip label="Explorez Plus" color="primary" />
        </Divider>

        <Grid container spacing={4}>
          <Grid item xs={12}>
            <Card 
              className="glow"
              sx={{ 
                position: 'relative',
                overflow: 'hidden',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: 'linear-gradient(45deg, rgba(96, 165, 250, 0.1), rgba(167, 139, 250, 0.1))',
                  zIndex: 0,
                }
              }}
            >
              <CardContent sx={{ position: 'relative', zIndex: 1 }}>
                <Box sx={{ 
                  display: 'flex', 
                  flexDirection: { xs: 'column', md: 'row' },
                  alignItems: 'center',
                  gap: 4
                }}>
                  <Box sx={{ flex: 1, textAlign: { xs: 'center', md: 'left' } }}>
                    <Typography 
                      variant="h1" 
                      gutterBottom
                      sx={{
                        fontSize: { xs: '2rem', md: '3rem' },
                        fontWeight: 700,
                        background: 'linear-gradient(45deg, #60A5FA, #A78BFA)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                      }}
                    >
                      Explorez l'Univers
                    </Typography>
                    <Typography 
                      variant="h5" 
                      color="text.secondary"
                      sx={{ mb: 3 }}
                    >
                      Découvrez les merveilles de l'espace à travers les yeux de la NASA
                    </Typography>
                  </Box>
                  {imageOfDay && (
                    <Box 
                      className="float"
                      sx={{ 
                        flex: 1,
                        maxWidth: '500px',
                        width: '100%',
                        position: 'relative'
                      }}
                    >
                      <Card
                        sx={{
                          background: 'transparent',
                          boxShadow: 'none',
                          '&:hover': {
                            transform: 'none',
                          }
                        }}
                      >
                        <CardMedia
                          component="img"
                          image={imageOfDay.url}
                          alt={imageOfDay.title}
                          sx={{
                            borderRadius: '16px',
                            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
                            transition: 'transform 0.3s ease-in-out',
                            '&:hover': {
                              transform: 'scale(1.02)',
                            }
                          }}
                        />
                      </Card>
                    </Box>
                  )}
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card className="slide-up card-hover">
              <CardContent sx={{ position: 'relative', overflow: 'hidden' }}>
                <Box sx={{ 
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: 'linear-gradient(45deg, rgba(96, 165, 250, 0.05), rgba(167, 139, 250, 0.05))',
                  zIndex: 0
                }} />
                <Box sx={{ position: 'relative', zIndex: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <ExploreIcon sx={{ fontSize: 40, mr: 2, color: 'primary.main' }} />
                    <Typography variant="h5" component="div">
                      Galerie d'Images
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    Explorez notre vaste collection d'images spatiales capturées par la NASA.
                    Des nébuleuses aux galaxies lointaines, découvrez les merveilles de l'univers.
                  </Typography>
                  <Button 
                    component={RouterLink}
                    to="/explore"
                    variant="contained"
                    fullWidth
                    startIcon={<ExploreIcon />}
                    sx={{
                      mt: 2,
                      background: 'linear-gradient(45deg, #60A5FA, #A78BFA)',
                      '&:hover': {
                        background: 'linear-gradient(45deg, #3B82F6, #8B5CF6)',
                      }
                    }}
                  >
                    Explorer
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Card 
              sx={{ 
                height: '100%',
                cursor: 'pointer',
                transition: 'transform 0.2s',
                '&:hover': { transform: 'scale(1.02)' }
              }}
              onClick={() => navigate('/missions')}
            >
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <SatelliteAltIcon sx={{ fontSize: 40, mr: 2, color: 'primary.main' }} />
                  <Typography gutterBottom variant="h5" component="div">
                    Missions Spatiales
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary" paragraph>
                  Suivez en direct les dernières missions spatiales de la NASA.
                  Découvrez les rovers martiens, les sondes interplanétaires et plus encore.
                </Typography>
                <Button 
                  variant="contained" 
                  color="primary" 
                  fullWidth
                  startIcon={<RocketLaunchIcon />}
                >
                  Découvrir les missions
                </Button>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardContent sx={{ flexGrow: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <PublicIcon sx={{ mr: 1, color: 'primary.main' }} />
                  <Typography variant="h5" component="div">
                    Vue de la Terre
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  Observez notre planète depuis l'espace. Images satellites en temps réel, phénomènes
                  météorologiques et changements environnementaux.
                </Typography>
              </CardContent>
              <CardActions>
                <Button
                  component={RouterLink}
                  to="/earth-view"
                  startIcon={<ExploreIcon />}
                  variant="contained"
                  fullWidth
                >
                  Explorer
                </Button>
              </CardActions>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default Home;
