import React, { useState, useEffect } from 'react';
import {
  Container,
  Box,
  Typography,
  TextField,
  InputAdornment,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Dialog,
  DialogContent,
  DialogActions,
  Button,
  Chip,
  Tabs,
  Tab,
  CircularProgress,
  IconButton
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import SearchIcon from '@mui/icons-material/Search';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import { searchImages } from '../services/nasaApi';
import { NasaImage } from '../models/types';

const DEFAULT_CATEGORIES = [
  { label: 'Terre', query: 'Earth' },
  { label: 'Espace Profond', query: 'Deep Space' },
  { label: 'Galaxies', query: 'Galaxy' },
  { label: 'Nébuleuses', query: 'Nebula' },
  { label: 'Planètes', query: 'Planets' },
  { label: 'Étoiles', query: 'Stars' }
];

const Explore: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [images, setImages] = useState<NasaImage[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(0);
  const navigate = useNavigate();
  const [selectedImage, setSelectedImage] = useState<NasaImage | null>(null);

  const handleSearch = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!searchQuery.trim() && selectedCategory === -1) return;

    setLoading(true);
    try {
      const query = searchQuery.trim() || DEFAULT_CATEGORIES[selectedCategory].query;
      const results = await searchImages(query);
      setImages(results);
    } catch (error) {
      console.error('Error searching images:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryChange = (event: React.SyntheticEvent, newValue: number) => {
    setSelectedCategory(newValue);
    setSearchQuery('');
  };

  const handleImageClick = (image: NasaImage) => {
    setSelectedImage(image);
  };

  const handleCloseDialog = () => {
    setSelectedImage(null);
  };

  useEffect(() => {
    handleSearch();
  }, [selectedCategory]);

  return (
    <Container maxWidth="lg">
      <Box sx={{ p: 3 }}>
        <Typography 
          variant="h1" 
          component="h1" 
          gutterBottom 
          align="center"
          sx={{
            fontSize: { xs: '2rem', md: '3rem' },
            mb: 4,
            background: 'linear-gradient(90deg, #2196F3 0%, #21CBF7 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          Explorer les Images NASA
        </Typography>

        <Box sx={{ 
          maxWidth: 800, 
          mx: 'auto', 
          mb: 6,
          position: 'relative',
        }}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Rechercher des images (ex: Mars, Jupiter, Nebula...)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: 'rgba(0, 0, 0, 0.6)' }} />
                </InputAdornment>
              ),
              sx: {
                background: '#fff',
                backdropFilter: 'blur(10px)',
                borderRadius: '12px',
                '& fieldset': {
                  border: '1px solid rgba(0, 0, 0, 0.2)',
                },
                '&:hover fieldset': {
                  borderColor: 'rgba(33, 150, 243, 0.7)',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#2196F3',
                },
              },
            }}
          />
          <Box sx={{ 
            display: 'flex', 
            gap: 1, 
            mt: 2,
            flexWrap: 'wrap',
            justifyContent: 'center',
          }}>
            {['TERRE', 'ESPACE PROFOND', 'GALAXIES', 'NÉBULEUSES', 'PLANÈTES', 'ÉTOILES'].map((category) => (
              <Chip
                key={category}
                label={category}
                onClick={() => setSearchQuery(category.toLowerCase())}
                sx={{
                  background: 'rgba(33, 150, 243, 0.1)',
                  borderColor: 'rgba(33, 150, 243, 0.3)',
                  color: 'rgba(0, 0, 0, 0.6)',
                  '&:hover': {
                    background: 'rgba(33, 150, 243, 0.3)',
                  },
                }}
              />
            ))}
          </Box>
        </Box>

        <Grid container spacing={3}>
          {images.map((image) => (
            <Grid item xs={12} sm={6} md={4} key={image.id}>
              <Card 
                className="fade-scale card-hover"
                sx={{
                  height: '100%',
                  background: '#fff',
                  backdropFilter: 'blur(10px)',
                }}
              >
                <Box sx={{ position: 'relative' }}>
                  <CardMedia
                    component="img"
                    height="260"
                    image={image.url}
                    alt={image.title}
                    className={loading ? 'blur-load' : 'blur-load loaded'}
                    sx={{
                      objectFit: 'cover',
                      transition: 'transform 0.3s ease-in-out',
                    }}
                  />
                  <Box
                    sx={{
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      right: 0,
                      background: 'linear-gradient(transparent, rgba(0,0,0,0.8))',
                      p: 2,
                    }}
                  >
                    <Typography variant="h6" sx={{ color: '#fff' }}>
                      {image.title}
                    </Typography>
                    <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                      {new Date(image.date).toLocaleDateString()}
                    </Typography>
                  </Box>
                </Box>
                <CardContent>
                  <Typography 
                    variant="body2" 
                    color="text.secondary"
                    sx={{
                      display: '-webkit-box',
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                      mb: 2,
                    }}
                  >
                    {image.description}
                  </Typography>
                  <Button
                    variant="contained"
                    fullWidth
                    onClick={() => handleImageClick(image)}
                    sx={{
                      background: 'linear-gradient(90deg, #2196F3 0%, #21CBF7 100%)',
                      '&:hover': {
                        background: 'linear-gradient(90deg, #2196F3 0%, #21CBF7 100%)',
                        filter: 'brightness(1.1)',
                      },
                    }}
                  >
                    Voir plus
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        <Dialog
          open={!!selectedImage}
          onClose={handleCloseDialog}
          maxWidth="md"
          fullWidth
          PaperProps={{
            sx: {
              background: '#fff',
              backdropFilter: 'blur(10px)',
              borderRadius: '16px',
            },
          }}
        >
          {selectedImage && (
            <>
              <DialogContent>
                <img
                  src={selectedImage.url}
                  alt={selectedImage.title}
                  style={{
                    width: '100%',
                    height: 'auto',
                    borderRadius: '8px',
                    marginBottom: '16px',
                  }}
                />
                <Typography variant="h5" gutterBottom>
                  {selectedImage.title}
                </Typography>
                <Typography variant="body1" paragraph>
                  {selectedImage.description}
                </Typography>
                <Box sx={{ 
                  display: 'flex', 
                  gap: 2,
                  flexWrap: 'wrap',
                  mt: 2,
                }}>
                  <Chip
                    icon={<CalendarTodayIcon />}
                    label={new Date(selectedImage.date).toLocaleDateString()}
                    sx={{
                      background: 'rgba(33, 150, 243, 0.1)',
                      borderColor: 'rgba(33, 150, 243, 0.3)',
                    }}
                  />
                </Box>
              </DialogContent>
              <DialogActions>
                <Button onClick={handleCloseDialog}>Fermer</Button>
              </DialogActions>
            </>
          )}
        </Dialog>
      </Box>
    </Container>
  );
};

export default Explore;
