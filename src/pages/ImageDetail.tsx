import React, { useEffect, useState } from 'react';
import {
  Box,
  Container,
  Card,
  CardMedia,
  CardContent,
  Typography,
  Button,
  Grid,
  CircularProgress,
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import { NasaImage } from '../models/types';
import { getImageDetails } from '../services/nasaApi';
import DownloadIcon from '@mui/icons-material/Download';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const ImageDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [image, setImage] = useState<NasaImage | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchImageDetails = async () => {
      if (!id) return;
      
      try {
        const imageData = await getImageDetails(id);
        setImage(imageData);
      } catch (err) {
        console.error('Error fetching image details:', err);
        setError('Erreur lors du chargement des détails de l\'image');
      } finally {
        setLoading(false);
      }
    };

    fetchImageDetails();
  }, [id]);

  const handleDownload = () => {
    if (image?.hdurl) {
      window.open(image.hdurl, '_blank');
    }
  };

  if (loading) {
    return (
      <Container>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (error || !image) {
    return (
      <Container>
        <Box sx={{ my: 4 }}>
          <Typography color="error" align="center">
            {error || 'Image non trouvée'}
          </Typography>
          <Box sx={{ textAlign: 'center', mt: 2 }}>
            <Button startIcon={<ArrowBackIcon />} onClick={() => navigate(-1)}>
              Retour
            </Button>
          </Box>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate(-1)}
          sx={{ mb: 2 }}
        >
          Retour
        </Button>

        <Card>
          <CardMedia
            component="img"
            height="600"
            image={image.url}
            alt={image.title}
            sx={{ objectFit: 'contain', bgcolor: 'black' }}
          />
          <CardContent>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography variant="h4" component="h1" gutterBottom>
                  {image.title}
                </Typography>
              </Grid>

              <Grid item xs={12}>
                <Typography variant="body1" paragraph>
                  {image.description}
                </Typography>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle1" color="text.secondary">
                  Date: {new Date(image.date).toLocaleDateString()}
                </Typography>
              </Grid>

              <Grid item xs={12} sm={6} sx={{ textAlign: 'right' }}>
                {image.hdurl && (
                  <Button
                    variant="contained"
                    startIcon={<DownloadIcon />}
                    onClick={handleDownload}
                  >
                    Télécharger HD
                  </Button>
                )}
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
};

export default ImageDetail;
