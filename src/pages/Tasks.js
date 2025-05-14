import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Grid,
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  FilterList as FilterIcon,
  ArrowBack as ArrowBackIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Tasks = () => {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    due_date: '',
    priority: 'medium',
    status: 'todo',
    department: '',
  });

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      const response = await axios.get('http://127.0.0.1:8000/api/tasks/', {
        headers: { Authorization: `Token ${token}` }
      });
      
      setTasks(response.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching tasks:', err);
      if (err.response?.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
      } else {
        setError('Failed to fetch tasks. Please try again later.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (task = null) => {
    if (task) {
      setSelectedTask(task);
      setFormData({
        title: task.title,
        description: task.description,
        due_date: new Date(task.due_date).toISOString().split('T')[0],
        priority: task.priority,
        status: task.status,
        department: task.department || '',
      });
    } else {
      setSelectedTask(null);
      setFormData({
        title: '',
        description: '',
        due_date: '',
        priority: 'medium',
        status: 'todo',
        department: '',
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedTask(null);
    setFormData({
      title: '',
      description: '',
      due_date: '',
      priority: 'medium',
      status: 'todo',
      department: '',
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      if (selectedTask) {
        await axios.patch(
          `http://127.0.0.1:8000/api/tasks/${selectedTask.id}/`,
          formData,
          { headers: { Authorization: `Token ${token}` } }
        );
      } else {
        await axios.post(
          'http://127.0.0.1:8000/api/tasks/',
          formData,
          { headers: { Authorization: `Token ${token}` } }
        );
      }

      handleCloseDialog();
      fetchTasks();
    } catch (err) {
      console.error('Error saving task:', err);
      if (err.response?.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
      } else {
        setError('Failed to save task. Please try again later.');
      }
    }
  };

  const handleDelete = async (taskId) => {
    if (!window.confirm('Are you sure you want to delete this task?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await axios.delete(
        `http://127.0.0.1:8000/api/tasks/${taskId}/`,
        { headers: { Authorization: `Token ${token}` } }
      );
      fetchTasks();
    } catch (err) {
      console.error('Error deleting task:', err);
      if (err.response?.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
      } else {
        setError('Failed to delete task. Please try again later.');
      }
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(180deg, #000000 0%, #111111 100%)',
        py: 4,
      }}
    >
      <Container maxWidth="lg">
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
          <IconButton
            onClick={() => navigate('/dashboard')}
            sx={{ mr: 2, color: '#00ff9d' }}
          >
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h4" component="h1" sx={{ flexGrow: 1 }}>
            Tasks
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleOpenDialog()}
            sx={{
              background: 'linear-gradient(45deg, #00ff9d 30%, #00cc7d 90%)',
              '&:hover': {
                background: 'linear-gradient(45deg, #00cc7d 30%, #00995e 90%)',
              },
            }}
          >
            New Task
          </Button>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <Paper sx={{ 
          p: 2,
          background: 'linear-gradient(45deg, #1a1a1a 30%, #2a2a2a 90%)',
          boxShadow: '0 4px 20px rgba(0, 255, 157, 0.1)',
        }}>
          <List>
            {tasks.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  No tasks found
                </Typography>
                <Typography variant="body1" color="text.secondary" paragraph>
                  Create your first task to get started
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={() => handleOpenDialog()}
                  sx={{
                    background: 'linear-gradient(45deg, #00ff9d 30%, #00cc7d 90%)',
                    '&:hover': {
                      background: 'linear-gradient(45deg, #00cc7d 30%, #00995e 90%)',
                    },
                  }}
                >
                  Create Task
                </Button>
              </Box>
            ) : (
              tasks.map((task) => (
                <ListItem
                  key={task.id}
                  sx={{
                    borderBottom: '1px solid rgba(255, 255, 255, 0.12)',
                    '&:last-child': { borderBottom: 'none' },
                    '&:hover': {
                      backgroundColor: 'rgba(0, 255, 157, 0.1)',
                    },
                  }}
                >
                  <ListItemText
                    primary={task.title}
                    secondary={
                      <Box sx={{ mt: 1 }}>
                        <Typography variant="body2" color="text.secondary" paragraph>
                          {task.description}
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                          <Chip
                            label={task.status}
                            size="small"
                            color={
                              task.status === 'completed' ? 'success' :
                              task.status === 'in_progress' ? 'primary' :
                              'default'
                            }
                          />
                          <Chip
                            label={task.priority}
                            size="small"
                            color={
                              task.priority === 'high' ? 'error' :
                              task.priority === 'medium' ? 'warning' :
                              'default'
                            }
                          />
                          <Typography variant="body2" color="text.secondary">
                            Due: {new Date(task.due_date).toLocaleDateString()}
                          </Typography>
                        </Box>
                      </Box>
                    }
                  />
                  <ListItemSecondaryAction>
                    <IconButton
                      edge="end"
                      onClick={() => handleOpenDialog(task)}
                      sx={{ mr: 1, color: '#00ff9d' }}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      edge="end"
                      onClick={() => handleDelete(task.id)}
                      sx={{ color: 'error.main' }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              ))
            )}
          </List>
        </Paper>

        {/* Task Dialog */}
        <Dialog
          open={openDialog}
          onClose={handleCloseDialog}
          maxWidth="sm"
          fullWidth
          PaperProps={{
            sx: {
              background: 'linear-gradient(45deg, #1a1a1a 30%, #2a2a2a 90%)',
              boxShadow: '0 4px 20px rgba(0, 255, 157, 0.1)',
            },
          }}
        >
          <DialogTitle sx={{ color: 'text.primary' }}>
            {selectedTask ? 'Edit Task' : 'Create New Task'}
          </DialogTitle>
          <form onSubmit={handleSubmit}>
            <DialogContent>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.23)' },
                        '&:hover fieldset': { borderColor: '#00ff9d' },
                        '&.Mui-focused fieldset': { borderColor: '#00ff9d' },
                      },
                      '& .MuiInputLabel-root': { color: 'text.secondary' },
                      '& .MuiInputBase-input': { color: 'text.primary' },
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    multiline
                    rows={4}
                    required
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.23)' },
                        '&:hover fieldset': { borderColor: '#00ff9d' },
                        '&.Mui-focused fieldset': { borderColor: '#00ff9d' },
                      },
                      '& .MuiInputLabel-root': { color: 'text.secondary' },
                      '& .MuiInputBase-input': { color: 'text.primary' },
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Due Date"
                    type="date"
                    value={formData.due_date}
                    onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
                    InputLabelProps={{ shrink: true }}
                    required
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.23)' },
                        '&:hover fieldset': { borderColor: '#00ff9d' },
                        '&.Mui-focused fieldset': { borderColor: '#00ff9d' },
                      },
                      '& .MuiInputLabel-root': { color: 'text.secondary' },
                      '& .MuiInputBase-input': { color: 'text.primary' },
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    select
                    label="Priority"
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                    required
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.23)' },
                        '&:hover fieldset': { borderColor: '#00ff9d' },
                        '&.Mui-focused fieldset': { borderColor: '#00ff9d' },
                      },
                      '& .MuiInputLabel-root': { color: 'text.secondary' },
                      '& .MuiInputBase-input': { color: 'text.primary' },
                    }}
                  >
                    <MenuItem value="low">Low</MenuItem>
                    <MenuItem value="medium">Medium</MenuItem>
                    <MenuItem value="high">High</MenuItem>
                  </TextField>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    select
                    label="Status"
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    required
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.23)' },
                        '&:hover fieldset': { borderColor: '#00ff9d' },
                        '&.Mui-focused fieldset': { borderColor: '#00ff9d' },
                      },
                      '& .MuiInputLabel-root': { color: 'text.secondary' },
                      '& .MuiInputBase-input': { color: 'text.primary' },
                    }}
                  >
                    <MenuItem value="todo">To Do</MenuItem>
                    <MenuItem value="in_progress">In Progress</MenuItem>
                    <MenuItem value="review">In Review</MenuItem>
                    <MenuItem value="completed">Completed</MenuItem>
                  </TextField>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Department"
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.23)' },
                        '&:hover fieldset': { borderColor: '#00ff9d' },
                        '&.Mui-focused fieldset': { borderColor: '#00ff9d' },
                      },
                      '& .MuiInputLabel-root': { color: 'text.secondary' },
                      '& .MuiInputBase-input': { color: 'text.primary' },
                    }}
                  />
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button 
                onClick={handleCloseDialog}
                sx={{ color: 'text.secondary' }}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                variant="contained"
                sx={{
                  background: 'linear-gradient(45deg, #00ff9d 30%, #00cc7d 90%)',
                  '&:hover': {
                    background: 'linear-gradient(45deg, #00cc7d 30%, #00995e 90%)',
                  },
                }}
              >
                {selectedTask ? 'Update' : 'Create'}
              </Button>
            </DialogActions>
          </form>
        </Dialog>
      </Container>
    </Box>
  );
};

export default Tasks; 