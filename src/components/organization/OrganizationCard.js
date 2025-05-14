import React from 'react';
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  Box,
  Chip,
  Avatar,
  IconButton,
  Menu,
  MenuItem,
} from '@mui/material';
import {
  MoreVert as MoreVertIcon,
  People as PeopleIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const OrganizationCard = ({ organization, onEdit, onDelete, onInvite, userRole }) => {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleViewDetails = () => {
    navigate(`/organization/${organization.id}`);
    handleMenuClose();
  };

  const isAdmin = ['owner', 'admin'].includes(userRole);

  return (
    <Card sx={{ 
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      position: 'relative',
      '&:hover': {
        boxShadow: 6,
        transform: 'translateY(-2px)',
        transition: 'all 0.3s ease-in-out'
      }
    }}>
      <CardContent sx={{ flexGrow: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Typography variant="h5" component="h2" gutterBottom>
            {organization.name}
          </Typography>
          <IconButton onClick={handleMenuClick} size="small">
            <MoreVertIcon />
          </IconButton>
        </Box>

        <Typography variant="body2" color="text.secondary" paragraph>
          {organization.description || 'No description provided'}
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
          <PeopleIcon fontSize="small" color="action" />
          <Typography variant="body2" color="text.secondary">
            {organization.member_count} members
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          <Chip 
            label={userRole.charAt(0).toUpperCase() + userRole.slice(1)} 
            color={userRole === 'owner' ? 'primary' : 'default'}
            size="small"
          />
          {organization.department && (
            <Chip 
              label={organization.department} 
              variant="outlined" 
              size="small"
            />
          )}
        </Box>
      </CardContent>

      <CardActions sx={{ justifyContent: 'space-between', px: 2, pb: 2 }}>
        <Button 
          variant="contained" 
          onClick={handleViewDetails}
          startIcon={<PeopleIcon />}
        >
          View Details
        </Button>
        {isAdmin && (
          <Button 
            variant="outlined" 
            onClick={() => onInvite(organization)}
            startIcon={<PeopleIcon />}
          >
            Invite
          </Button>
        )}
      </CardActions>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleViewDetails}>
          <PeopleIcon fontSize="small" sx={{ mr: 1 }} />
          View Details
        </MenuItem>
        {isAdmin && (
          <>
            <MenuItem onClick={() => {
              onEdit(organization);
              handleMenuClose();
            }}>
              <EditIcon fontSize="small" sx={{ mr: 1 }} />
              Edit Organization
            </MenuItem>
            <MenuItem 
              onClick={() => {
                onDelete(organization);
                handleMenuClose();
              }}
              sx={{ color: 'error.main' }}
            >
              <DeleteIcon fontSize="small" sx={{ mr: 1 }} />
              Delete Organization
            </MenuItem>
          </>
        )}
      </Menu>
    </Card>
  );
};

export default OrganizationCard; 