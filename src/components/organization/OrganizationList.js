import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  CircularProgress,
  Alert,
} from '@mui/material';
import { Add as AddIcon, Close as CloseIcon } from '@mui/icons-material';
import OrganizationCard from './OrganizationCard';
import axios from 'axios';

const OrganizationList = () => {
  const [organizations, setOrganizations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [newOrg, setNewOrg] = useState({ name: '', description: '' });
  const [creating, setCreating] = useState(false);

  const fetchOrganizations = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://127.0.0.1:8000/api/organizations/', {
        headers: { Authorization: `Token ${token}` }
      });
      setOrganizations(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch organizations. Please try again later.');
      console.error('Error fetching organizations:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrganizations();
  }, []);

  const handleCreateOrg = async () => {
    try {
      setCreating(true);
      const token = localStorage.getItem('token');
      const response = await axios.post(
        'http://127.0.0.1:8000/api/organizations/',
        newOrg,
        { headers: { Authorization: `Token ${token}` } }
      );
      setOrganizations([...organizations, response.data]);
      setOpenDialog(false);
      setNewOrg({ name: '', description: '' });
      setError(null);
    } catch (err) {
      setError('Failed to create organization. Please try again.');
      console.error('Error creating organization:', err);
    } finally {
      setCreating(false);
    }
  };

  const handleEditOrg = async (organization) => {
    // TODO: Implement edit functionality
    console.log('Edit organization:', organization);
  };

  const handleDeleteOrg = async (organization) => {
    // TODO: Implement delete functionality
    console.log('Delete organization:', organization);
  };

  const handleInviteMember = async (organization) => {
    // TODO: Implement invite functionality
    console.log('Invite to organization:', organization);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Organizations
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setOpenDialog(true)}
        >
          Create Organization
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {organizations.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No organizations found
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Create your first organization to get started
          </Typography>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {organizations.map((org) => (
            <Grid item xs={12} sm={6} md={4} key={org.id}>
              <OrganizationCard
                organization={org}
                onEdit={handleEditOrg}
                onDelete={handleDeleteOrg}
                onInvite={handleInviteMember}
                userRole={org.user_role || 'member'}
              />
            </Grid>
          ))}
        </Grid>
      )}

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          Create New Organization
          <IconButton
            aria-label="close"
            onClick={() => setOpenDialog(false)}
            sx={{ position: 'absolute', right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Organization Name"
            fullWidth
            value={newOrg.name}
            onChange={(e) => setNewOrg({ ...newOrg, name: e.target.value })}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            label="Description"
            fullWidth
            multiline
            rows={4}
            value={newOrg.description}
            onChange={(e) => setNewOrg({ ...newOrg, description: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button
            onClick={handleCreateOrg}
            variant="contained"
            disabled={!newOrg.name || creating}
          >
            {creating ? <CircularProgress size={24} /> : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default OrganizationList; 