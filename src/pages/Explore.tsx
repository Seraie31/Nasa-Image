import React, { useState } from 'react';
import {
  Box,
  Container,
  TextField,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Typography,
  Button,
  CircularProgress,
} from '@mui/material';
import { searchImages } from '../services/nasaApi';
import { NasaImage } from '../models/types';
import { useNavigate } from 'react-router-dom';

const Explore: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [images, setImages] = useState<NasaImage[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    setLoading(true);
    try {
      const data = await searchImages(searchQuery);
      setImages(data.collection.items);
    } catch (error) {
      console.error('Error searching images:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleImageClick = (image: NasaImage) => {
    navigate(`/image/${encodeURIComponent(image.title)}`, { state: { image } });
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom align="center">
          Explorer les Images NASA
        </Typography>

        <Box sx={{ display: 'flex', gap: 2, mb: 4 }}>
          <TextField
            fullWidth
            label="Rechercher des images..."
            variant="outlined"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          />
          <Button
            variant="contained"
            onClick={handleSearch}
            disabled={loading}
            sx={{ minWidth: 120 }}
          >
            {loading ? <CircularProgress size={24} /> : 'Rechercher'}
          </Button>
        </Box>

        <Grid container spacing={3}>
          {images.map((image, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  cursor: 'pointer',
                  '&:hover': {
                    transform: 'scale(1.02)',
                    transition: 'transform 0.2s ease-in-out',
                  },
                }}
                onClick={() => handleImageClick(image)}
              >
                <CardMedia
                  component="img"
                  height="200"
                  image={image.url}
                  alt={image.title}
                  sx={{ objectFit: 'cover' }}
                />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography gutterBottom variant="h6" component="div">
                    {image.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {image.description?.substring(0, 150)}
                    {image.description?.length > 150 ? '...' : ''}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {images.length === 0 && !loading && (
          <Box sx={{ textAlign: 'center', mt: 4 }}>
            <Typography variant="body1" color="text.secondary">
              Aucune image trouvée. Essayez une nouvelle recherche !
            </Typography>
          </Box>
        )}
      </Box>
    </Container>
  );
};

export default Explore;
