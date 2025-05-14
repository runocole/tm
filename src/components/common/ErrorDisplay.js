import React from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  Alert,
  AlertTitle,
} from '@mui/material';
import { Error as ErrorIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const ErrorDisplay = ({ error, title = 'Error', onRetry, showBackButton = true }) => {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: 2,
        background: 'linear-gradient(180deg, #000000 0%, #111111 100%)',
      }}
    >
      <Paper
        elevation={3}
        sx={{
          p: 4,
          maxWidth: 500,
          width: '100%',
          textAlign: 'center',
          bgcolor: 'background.paper',
        }}
      >
        <ErrorIcon sx={{ fontSize: 60, color: 'error.main', mb: 2 }} />
        <Alert severity="error" sx={{ mb: 3 }}>
          <AlertTitle>{title}</AlertTitle>
          {error}
        </Alert>
        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
          {showBackButton && (
            <Button
              variant="outlined"
              onClick={() => navigate(-1)}
              sx={{ minWidth: 120 }}
            >
              Go Back
            </Button>
          )}
          {onRetry && (
            <Button
              variant="contained"
              onClick={onRetry}
              sx={{ minWidth: 120 }}
            >
              Try Again
            </Button>
          )}
        </Box>
      </Paper>
    </Box>
  );
};

export default ErrorDisplay; 