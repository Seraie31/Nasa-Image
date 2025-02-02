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
      <Typography variant="h3" component="h1" gutterBottom align="center">
        Vue de la Terre
      </Typography>
      <Typography variant="subtitle1" gutterBottom align="center" color="text.secondary">
        Observez notre planète depuis l'espace. Images satellites en temps réel.
      </Typography>

      {images.length > 0 && (
        <Grid container spacing={3} sx={{ mt: 2 }}>
          <Grid item xs={12} md={8}>
            <Card>
              <Box sx={{ 
                position: 'relative',
                height: { xs: '300px', sm: '400px', md: '500px' },
                maxHeight: '70vh',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                overflow: 'hidden'
              }}>
                <CardMedia
                  component="img"
                  image={currentImage.image}
                  alt={currentImage.caption}
                  sx={{ 
                    height: '100%',
                    width: '100%',
                    objectFit: 'contain',
                    maxHeight: '100%',
                    maxWidth: '100%'
                  }}
                />
              </Box>
              <CardContent>
                <Typography variant="body2" color="text.secondary">
                  {currentImage.caption}
                </Typography>
                <Typography variant="caption" display="block">
                  Date: {new Date(currentImage.date).toLocaleString()}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Contrôles
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, mb: 2 }}>
                <IconButton onClick={handlePrevImage}>
                  <NavigateBeforeIcon />
                </IconButton>
                <IconButton onClick={handlePlayPause}>
                  {isPlaying ? <PauseIcon /> : <PlayArrowIcon />}
                </IconButton>
                <IconButton onClick={handleNextImage}>
                  <NavigateNextIcon />
                </IconButton>
              </Box>
              <Box sx={{ px: 2 }}>
                <Typography gutterBottom>Vitesse de lecture</Typography>
                <Slider
                  value={2000 - playbackSpeed}
                  onChange={handleSpeedChange}
                  min={0}
                  max={1900}
                  step={100}
                  marks
                  valueLabelDisplay="auto"
                  valueLabelFormat={(value) => `${((2000 - value) / 1000).toFixed(1)}s`}
                />
              </Box>
            </Paper>

            <Paper sx={{ p: 2, mt: 2 }}>
              <Typography variant="h6" gutterBottom>
                Informations
              </Typography>
              <Stack spacing={1}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <PublicIcon />
                  <Typography>
                    Coordonnées: {currentImage.coords.centroid_coordinates.lat.toFixed(2)}°,{' '}
                    {currentImage.coords.centroid_coordinates.lon.toFixed(2)}°
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary">
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
