import React, { useEffect, useState } from 'react';
import { Box, Typography, Card, CardMedia, CardContent, Grid, Container } from '@mui/material';
import { getImageOfTheDay } from '../services/nasaApi';
import { NasaImage } from '../models/types';

const Home: React.FC = () => {
  const [imageOfDay, setImageOfDay] = useState<NasaImage | null>(null);

  useEffect(() => {
    const fetchImageOfDay = async () => {
      try {
        const data = await getImageOfTheDay();
        setImageOfDay(data);
      } catch (error) {
        console.error('Error fetching image of the day:', error);
      }
    };

    fetchImageOfDay();
  }, []);

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Typography variant="h2" component="h1" gutterBottom align="center">
          Explorez l'Univers avec NASA Image
        </Typography>
        
        {imageOfDay && (
          <Card sx={{ maxWidth: '100%', mt: 4 }}>
            <CardMedia
              component="img"
              height="500"
              image={imageOfDay.url}
              alt={imageOfDay.title}
              sx={{ objectFit: 'cover' }}
            />
            <CardContent>
              <Typography gutterBottom variant="h5" component="div">
                Image du Jour : {imageOfDay.title}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {imageOfDay.description}
              </Typography>
              <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                Date: {new Date(imageOfDay.date).toLocaleDateString()}
              </Typography>
            </CardContent>
          </Card>
        )}

        <Grid container spacing={4} sx={{ mt: 4 }}>
          <Grid item xs={12} md={4}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                  Explorez les Images
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Parcourez notre vaste collection d'images spatiales capturées par la NASA.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                  Visualisation 3D
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Explorez les modèles 3D des corps célestes et des vaisseaux spatiaux.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                  Dernières Découvertes
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Restez informé des dernières découvertes et missions spatiales.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default Home;
