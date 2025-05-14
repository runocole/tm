import React from 'react';
import { Box, Container } from '@mui/material';
import OrganizationList from '../components/organization/OrganizationList';

const Organizations = () => {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(180deg, #000000 0%, #111111 100%)',
        py: 4,
      }}
    >
      <Container maxWidth="lg">
        <OrganizationList />
      </Container>
    </Box>
  );
};

export default Organizations; 