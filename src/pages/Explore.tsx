import React, { useState, useEffect } from 'react';
import { 
  Container, 
  TextField, 
  Grid, 
  Card, 
  CardMedia, 
  CardContent, 
  Typography,
  Box,
  IconButton,
  InputAdornment,
  Tabs,
  Tab,
  Chip,
  CircularProgress
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import SearchIcon from '@mui/icons-material/Search';
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

  useEffect(() => {
    handleSearch();
  }, [selectedCategory]);

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom align="center">
          Explorer les Images NASA
        </Typography>

        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 4 }}>
          <Tabs 
            value={selectedCategory} 
            onChange={handleCategoryChange}
            variant="scrollable"
            scrollButtons="auto"
            allowScrollButtonsMobile
          >
            {DEFAULT_CATEGORIES.map((category, index) => (
              <Tab 
                key={category.query} 
                label={category.label}
                value={index}
              />
            ))}
          </Tabs>
        </Box>

        <Box 
          component="form" 
          onSubmit={handleSearch}
          sx={{ 
            maxWidth: 600, 
            margin: '0 auto', 
            mb: 4 
          }}
        >
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Rechercher des images (ex: Mars, Jupiter, Nebula...)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton type="submit" edge="end">
                    <SearchIcon />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </Box>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            <Grid container spacing={3}>
              {images.map((image) => (
                <Grid item xs={12} sm={6} md={4} key={image.id}>
                  <Card 
                    sx={{ 
                      height: '100%',
                      cursor: 'pointer',
                      transition: 'transform 0.2s',
                      '&:hover': {
                        transform: 'scale(1.02)'
                      }
                    }}
                    onClick={() => navigate(`/image/${image.id}`)}
                  >
                    <CardMedia
                      component="img"
                      height="200"
                      image={image.url}
                      alt={image.title}
                      sx={{ objectFit: 'cover' }}
                    />
                    <CardContent>
                      <Typography gutterBottom variant="h6" component="div" noWrap>
                        {image.title}
                      </Typography>
                      <Typography 
                        variant="body2" 
                        color="text.secondary"
                        sx={{
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          display: '-webkit-box',
                          WebkitLineClamp: 3,
                          WebkitBoxOrient: 'vertical',
                        }}
                      >
                        {image.description}
                      </Typography>
                      <Box sx={{ mt: 1 }}>
                        <Chip 
                          label={new Date(image.date).toLocaleDateString()} 
                          size="small" 
                          variant="outlined"
                        />
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>

            {!loading && images.length === 0 && searchQuery && (
              <Box sx={{ textAlign: 'center', mt: 4 }}>
                <Typography>Aucune image trouvée pour "{searchQuery}"</Typography>
              </Box>
            )}
          </>
        )}
      </Box>
    </Container>
  );
};

export default Explore;
