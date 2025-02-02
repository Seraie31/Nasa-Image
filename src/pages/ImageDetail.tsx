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

  const handleBack = () => {
    navigate(-1);
  };

  useEffect(() => {
    const fetchImageDetails = async () => {
      if (!id) {
        setError('ID de l\'image manquant');
        setLoading(false);
        return;
      }
      
      try {
        setLoading(true);
        setError(null);
        const imageData = await getImageDetails(id);
        setImage(imageData);
      } catch (err) {
        console.error('Error fetching image details:', err);
        setError(
          err instanceof Error 
            ? err.message 
            : 'Erreur lors du chargement des détails de l\'image'
        );
        setImage(null);
      } finally {
        setLoading(false);
      }
    };

    fetchImageDetails();
  }, [id]);

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
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography variant="h5" color="error" gutterBottom>
            {error}
          </Typography>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={handleBack}
            variant="contained"
            sx={{ mt: 2 }}
          >
            RETOUR
          </Button>
        </Box>
      </Container>
    );
  }

  if (!image) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography variant="h5" gutterBottom>
            Image non trouvée
          </Typography>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={handleBack}
            variant="contained"
            sx={{ mt: 2 }}
          >
            RETOUR
          </Button>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={handleBack}
        sx={{ mb: 3 }}
      >
        Retour
      </Button>
      
      <Card>
        <CardMedia
          component="img"
          image={image.url}
          alt={image.title}
          sx={{
            maxHeight: '70vh',
            objectFit: 'contain',
            bgcolor: 'black'
          }}
        />
        <CardContent>
          <Typography variant="h4" gutterBottom>
            {image.title}
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            {image.description}
          </Typography>
          <Typography variant="caption" color="text.secondary" display="block">
            Date: {new Date(image.date).toLocaleDateString()}
          </Typography>
          {image.hdurl && (
            <Button
              href={image.hdurl}
              target="_blank"
              rel="noopener noreferrer"
              startIcon={<DownloadIcon />}
              sx={{ mt: 2 }}
            >
              Télécharger en HD
            </Button>
          )}
        </CardContent>
      </Card>
    </Container>
  );
};

export default ImageDetail;
