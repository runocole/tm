import React from 'react';
import { Box, Container } from '@mui/material';
import OrganizationDetail from '../components/organization/OrganizationDetail';

const OrganizationDetailPage = () => {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(180deg, #000000 0%, #111111 100%)',
        py: 4,
      }}
    >
      <Container maxWidth="lg">
        <OrganizationDetail />
      </Container>
    </Box>
  );
};

export default OrganizationDetailPage; 