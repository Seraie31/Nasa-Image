import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardMedia,
  CardContent,
  Grid,
  CircularProgress,
  IconButton,
  Tooltip,
  Alert,
  Paper,
  Slider,
  Stack
} from '@mui/material';
import { getLatestEarthImages, EarthImage } from '../services/earthApi';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import PublicIcon from '@mui/icons-material/Public';

const EarthView: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [images, setImages] = useState<EarthImage[]>([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1000); // milliseconds
  const [retryTimeout, setRetryTimeout] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        setLoading(true);
        const data = await getLatestEarthImages();
        setImages(data);
        setError(null);
        setIsPlaying(true); // Démarrer la lecture automatiquement après le chargement des images
        if (retryTimeout) {
          clearTimeout(retryTimeout);
          setRetryTimeout(null);
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Une erreur est survenue';
        setError(errorMessage);
        
        if (errorMessage.includes('Limite de requêtes atteinte')) {
          const waitTimeMatch = errorMessage.match(/(\d+) secondes/);
          if (waitTimeMatch) {
            const waitTime = parseInt(waitTimeMatch[1]) * 1000;
            const timeout = setTimeout(() => {
              fetchImages();
            }, waitTime);
            setRetryTimeout(timeout);
          }
        }
      } finally {
        setLoading(false);
      }
    };

    fetchImages();

    return () => {
      if (retryTimeout) {
        clearTimeout(retryTimeout);
      }
    };
  }, []);

  useEffect(() => {
    if (images.length > 0 && !loading) {
      setCurrentImageIndex(0); // Afficher la première image immédiatement après le chargement
    }
  }, [images, loading]);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isPlaying && images.length > 0) {
      interval = setInterval(() => {
        setCurrentImageIndex((prevIndex) =>
          prevIndex === images.length - 1 ? 0 : prevIndex + 1
        );
      }, playbackSpeed);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isPlaying, images.length, playbackSpeed]);

  const handlePrevImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  const handlePlayPause = () => {
    setIsPlaying((prev) => !prev);
  };

  const handleSpeedChange = (event: Event, newValue: number | number[]) => {
    setPlaybackSpeed(2000 - (newValue as number));
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '80vh',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  const currentImage = images[currentImageIndex];

  return (
    <Box sx={{ p: 3 }}>
      <Typography 
        variant="h1" 
        component="h1" 
        gutterBottom 
        align="center"
        sx={{
          fontSize: { xs: '2rem', md: '3rem' },
          mb: 4,
          background: 'linear-gradient(45deg, #60A5FA, #A78BFA)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}
      >
        Vue de la Terre
      </Typography>
      <Typography 
        variant="subtitle1" 
        gutterBottom 
        align="center" 
        color="text.secondary"
        sx={{ mb: 6 }}
      >
        Observez notre planète depuis l'espace. Images satellites en temps réel.
      </Typography>

      {images.length > 0 && (
        <Grid container spacing={3} sx={{ mt: 2 }}>
          <Grid item xs={12} md={8}>
            <Card className="glow">
              <Box sx={{ 
                position: 'relative',
                height: { xs: '300px', sm: '400px', md: '500px' },
                maxHeight: '70vh',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                overflow: 'hidden',
                background: 'rgba(0, 0, 0, 0.2)',
                borderRadius: '16px',
              }}>
                <CardMedia
                  component="img"
                  image={currentImage.image}
                  alt={currentImage.caption}
                  className={loading ? 'blur-load' : 'blur-load loaded'}
                  sx={{ 
                    height: '100%',
                    width: '100%',
                    objectFit: 'contain',
                    maxHeight: '100%',
                    maxWidth: '100%',
                    transition: 'all 0.3s ease-in-out',
                  }}
                />
              </Box>
              <CardContent sx={{ 
                background: 'rgba(17, 24, 39, 0.8)',
                borderTop: '1px solid rgba(255, 255, 255, 0.1)',
              }}>
                <Typography variant="body2" color="text.secondary">
                  {currentImage.caption}
                </Typography>
                <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                  Date: {new Date(currentImage.date).toLocaleString()}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Paper className="slide-up" sx={{ 
              p: 3, 
              background: 'rgba(17, 24, 39, 0.8)',
              backdropFilter: 'blur(10px)',
              borderRadius: '16px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
            }}>
              <Typography variant="h6" gutterBottom sx={{ 
                color: 'primary.light',
                borderBottom: '2px solid',
                borderImage: 'linear-gradient(45deg, #60A5FA, #A78BFA) 1',
                pb: 1,
              }}>
                Contrôles
              </Typography>
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'center', 
                gap: 2, 
                mb: 3,
                mt: 2,
              }}>
                <IconButton 
                  onClick={handlePrevImage}
                  className="glow"
                  sx={{ 
                    background: 'rgba(96, 165, 250, 0.1)',
                    '&:hover': {
                      background: 'rgba(96, 165, 250, 0.2)',
                    }
                  }}
                >
                  <NavigateBeforeIcon />
                </IconButton>
                <IconButton 
                  onClick={handlePlayPause}
                  className="glow"
                  sx={{ 
                    background: 'rgba(96, 165, 250, 0.1)',
                    '&:hover': {
                      background: 'rgba(96, 165, 250, 0.2)',
                    }
                  }}
                >
                  {isPlaying ? <PauseIcon /> : <PlayArrowIcon />}
                </IconButton>
                <IconButton 
                  onClick={handleNextImage}
                  className="glow"
                  sx={{ 
                    background: 'rgba(96, 165, 250, 0.1)',
                    '&:hover': {
                      background: 'rgba(96, 165, 250, 0.2)',
                    }
                  }}
                >
                  <NavigateNextIcon />
                </IconButton>
              </Box>
              <Box sx={{ px: 2 }}>
                <Typography gutterBottom color="text.secondary">
                  Vitesse de lecture
                </Typography>
                <Slider
                  value={2000 - playbackSpeed}
                  onChange={handleSpeedChange}
                  min={0}
                  max={1900}
                  step={100}
                  marks
                  valueLabelDisplay="auto"
                  valueLabelFormat={(value) => `${((2000 - value) / 1000).toFixed(1)}s`}
                  sx={{
                    '& .MuiSlider-thumb': {
                      background: 'linear-gradient(45deg, #60A5FA, #A78BFA)',
                    },
                    '& .MuiSlider-track': {
                      background: 'linear-gradient(45deg, #60A5FA, #A78BFA)',
                    },
                  }}
                />
              </Box>
            </Paper>

            <Paper className="slide-up" sx={{ 
              p: 3, 
              mt: 2,
              background: 'rgba(17, 24, 39, 0.8)',
              backdropFilter: 'blur(10px)',
              borderRadius: '16px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
            }}>
              <Typography variant="h6" gutterBottom sx={{ 
                color: 'primary.light',
                borderBottom: '2px solid',
                borderImage: 'linear-gradient(45deg, #60A5FA, #A78BFA) 1',
                pb: 1,
              }}>
                Informations
              </Typography>
              <Stack spacing={2}>
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 1,
                  p: 1,
                  borderRadius: '8px',
                  background: 'rgba(96, 165, 250, 0.1)',
                }}>
                  <PublicIcon sx={{ color: 'primary.light' }} />
                  <Typography>
                    Coordonnées: {currentImage.coords.centroid_coordinates.lat.toFixed(2)}°,{' '}
                    {currentImage.coords.centroid_coordinates.lon.toFixed(2)}°
                  </Typography>
                </Box>
                <Typography 
                  variant="body2" 
                  color="text.secondary"
                  sx={{
                    p: 1,
                    borderRadius: '8px',
                    background: 'rgba(96, 165, 250, 0.05)',
                  }}
                >
                  Version: {currentImage.version}
                </Typography>
              </Stack>
            </Paper>
          </Grid>
        </Grid>
      )}
    </Box>
  );
};

export default EarthView;
