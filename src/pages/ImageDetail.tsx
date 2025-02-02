import React from 'react';
import {
  Box,
  Container,
  Card,
  CardMedia,
  CardContent,
  Typography,
  Button,
  Grid,
} from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import { NasaImage } from '../models/types';
import DownloadIcon from '@mui/icons-material/Download';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const ImageDetail: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { image } = location.state as { image: NasaImage };

  const handleDownload = () => {
    if (image.hdurl) {
      window.open(image.hdurl, '_blank');
    }
  };

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
