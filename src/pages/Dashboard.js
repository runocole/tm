import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Grid,
  Paper,
  Typography,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  IconButton,
  CircularProgress,
  Alert,
  Chip,
  Drawer,
  AppBar,
  Toolbar,
  Avatar,
  Card,
  CardContent,
  LinearProgress,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  Assignment as TaskIcon,
  Notifications as NotificationsIcon,
  Settings as SettingsIcon,
  ExitToApp as LogoutIcon,
  Add as AddIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Schedule as ScheduleIcon,
  ArrowBack as ArrowBackIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const drawerWidth = 240;

const Dashboard = () => {
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    total: 0,
    completed: 0,
    inProgress: 0,
    overdue: 0,
    dueToday: 0,
  });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/login');
          return;
        }

        const userData = JSON.parse(localStorage.getItem('user'));
        if (!userData) {
          localStorage.removeItem('token');
          navigate('/login');
          return;
        }
        setUser(userData);

        // Fetch tasks and activities
        const [tasksResponse, activitiesResponse] = await Promise.all([
          axios.get('http://127.0.0.1:8000/api/tasks/', {
            headers: { Authorization: `Token ${token}` }
          }),
          axios.get('http://127.0.0.1:8000/api/activities/', {
            headers: { Authorization: `Token ${token}` }
          })
        ]);

        setTasks(tasksResponse.data);
        setActivities(activitiesResponse.data);
        setStats(calculateStats(tasksResponse.data));
        setError(null);
      } catch (err) {
        console.error('Error fetching data:', err);
        if (err.response?.status === 401) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          navigate('/login');
        } else {
          setError('Failed to fetch data. Please try again later.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [navigate]);

  const calculateStats = (tasks) => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    return {
      total: tasks.length,
      completed: tasks.filter(task => task.status === 'completed').length,
      inProgress: tasks.filter(task => task.status === 'in_progress').length,
      overdue: tasks.filter(task => 
        task.status !== 'completed' && 
        new Date(task.due_date) < now
      ).length,
      dueToday: tasks.filter(task => 
        task.status !== 'completed' && 
        new Date(task.due_date) >= today && 
        new Date(task.due_date) < tomorrow
      ).length,
    };
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const drawer = (
    <Box>
      <Toolbar sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', py: 2 }}>
        <Typography variant="h6" noWrap component="div" sx={{ color: '#00ff9d' }}>
          TaskMate
        </Typography>
      </Toolbar>
      <Divider />
      <List>
        <ListItem button onClick={() => navigate('/dashboard')}>
          <ListItemIcon>
            <DashboardIcon />
          </ListItemIcon>
          <ListItemText primary="Dashboard" />
        </ListItem>
        <ListItem button onClick={() => navigate('/tasks')}>
          <ListItemIcon>
            <TaskIcon />
          </ListItemIcon>
          <ListItemText primary="Tasks" />
        </ListItem>
      </List>
      <Divider />
      <List>
        <ListItem button onClick={() => navigate('/settings')}>
          <ListItemIcon>
            <SettingsIcon />
          </ListItemIcon>
          <ListItemText primary="Settings" />
        </ListItem>
        <ListItem button onClick={handleLogout}>
          <ListItemIcon>
            <LogoutIcon />
          </ListItemIcon>
          <ListItemText primary="Logout" />
        </ListItem>
      </List>
    </Box>
  );

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
      {/* App Bar */}
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
          bgcolor: 'background.paper',
          boxShadow: 'none',
          borderBottom: '1px solid rgba(255, 255, 255, 0.12)',
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Box sx={{ flexGrow: 1 }} />
          <IconButton color="inherit">
            <NotificationsIcon />
          </IconButton>
          <Avatar sx={{ ml: 2, width: 32, height: 32, bgcolor: '#00ff9d' }}>
            {user?.first_name?.[0]}{user?.last_name?.[0]}
          </Avatar>
        </Toolbar>
      </AppBar>

      {/* Drawer */}
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth, bgcolor: 'background.paper' },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth, bgcolor: 'background.paper' },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>

      {/* Main content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          mt: '64px',
        }}
      >
        {/* Welcome Section */}
        <Paper 
          sx={{ 
            p: 3, 
            mb: 3, 
            background: 'linear-gradient(45deg, #1a1a1a 30%, #2a2a2a 90%)',
            borderRadius: 2,
            boxShadow: '0 4px 20px rgba(0, 255, 157, 0.1)',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box>
              <Typography 
                variant="h4" 
                gutterBottom
                sx={{
                  background: 'linear-gradient(45deg, #ffffff 30%, #00ff9d 90%)',
                  backgroundClip: 'text',
                  textFillColor: 'transparent',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                Welcome back, {user?.first_name}!
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Let's make today productive
              </Typography>
            </Box>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => navigate('/tasks')}
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
        </Paper>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {/* Task Statistics */}
        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ 
              background: 'linear-gradient(45deg, #1a1a1a 30%, #2a2a2a 90%)',
              boxShadow: '0 4px 20px rgba(0, 255, 157, 0.1)',
            }}>
              <CardContent>
                <Typography variant="h6" gutterBottom color="text.secondary">
                  Total Tasks
                </Typography>
                <Typography variant="h3" color="primary">
                  {stats.total}
                </Typography>
                <LinearProgress 
                  variant="determinate" 
                  value={(stats.completed / stats.total) * 100 || 0} 
                  sx={{ 
                    mt: 2,
                    height: 8,
                    borderRadius: 4,
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    '& .MuiLinearProgress-bar': {
                      background: 'linear-gradient(45deg, #00ff9d 30%, #00cc7d 90%)',
                    },
                  }}
                />
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ 
              background: 'linear-gradient(45deg, #1a1a1a 30%, #2a2a2a 90%)',
              boxShadow: '0 4px 20px rgba(0, 255, 157, 0.1)',
            }}>
              <CardContent>
                <Typography variant="h6" gutterBottom color="text.secondary">
                  Completed
                </Typography>
                <Typography variant="h3" color="success.main">
                  {stats.completed}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                  <CheckCircleIcon color="success" sx={{ mr: 1 }} />
                  <Typography variant="body2" color="text.secondary">
                    {((stats.completed / stats.total) * 100 || 0).toFixed(1)}% complete
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ 
              background: 'linear-gradient(45deg, #1a1a1a 30%, #2a2a2a 90%)',
              boxShadow: '0 4px 20px rgba(0, 255, 157, 0.1)',
            }}>
              <CardContent>
                <Typography variant="h6" gutterBottom color="text.secondary">
                  Due Today
                </Typography>
                <Typography variant="h3" color="warning.main">
                  {stats.dueToday}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                  <ScheduleIcon color="warning" sx={{ mr: 1 }} />
                  <Typography variant="body2" color="text.secondary">
                    Tasks need attention
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ 
              background: 'linear-gradient(45deg, #1a1a1a 30%, #2a2a2a 90%)',
              boxShadow: '0 4px 20px rgba(0, 255, 157, 0.1)',
            }}>
              <CardContent>
                <Typography variant="h6" gutterBottom color="text.secondary">
                  Overdue
                </Typography>
                <Typography variant="h3" color="error.main">
                  {stats.overdue}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                  <WarningIcon color="error" sx={{ mr: 1 }} />
                  <Typography variant="body2" color="text.secondary">
                    Tasks need immediate attention
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Tasks and Activity */}
        <Grid container spacing={3}>
          {/* Tasks Overview */}
          <Grid item xs={12} md={6}>
            <Paper sx={{ 
              p: 3,
              background: 'linear-gradient(45deg, #1a1a1a 30%, #2a2a2a 90%)',
              boxShadow: '0 4px 20px rgba(0, 255, 157, 0.1)',
            }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" color="text.secondary">
                  Recent Tasks
                </Typography>
                <Button
                  size="small"
                  onClick={() => navigate('/tasks')}
                  sx={{ color: '#00ff9d' }}
                >
                  View All
                </Button>
              </Box>
              <List>
                {tasks.length === 0 ? (
                  <Box sx={{ textAlign: 'center', py: 3 }}>
                    <Typography variant="body1" color="text.secondary" gutterBottom>
                      No tasks found
                    </Typography>
                    <Button
                      variant="outlined"
                      startIcon={<AddIcon />}
                      onClick={() => navigate('/tasks')}
                      sx={{ 
                        borderColor: '#00ff9d',
                        color: '#00ff9d',
                        '&:hover': {
                          borderColor: '#00cc7d',
                          backgroundColor: 'rgba(0, 255, 157, 0.1)',
                        },
                      }}
                    >
                      Create Your First Task
                    </Button>
                  </Box>
                ) : (
                  tasks.slice(0, 5).map((task) => (
                    <ListItem 
                      key={task.id}
                      button
                      onClick={() => navigate(`/tasks/${task.id}`)}
                      sx={{
                        borderRadius: 1,
                        mb: 1,
                        '&:hover': {
                          backgroundColor: 'rgba(0, 255, 157, 0.1)',
                        },
                      }}
                    >
                      <ListItemText
                        primary={task.title}
                        secondary={
                          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', mt: 1 }}>
                            <Chip
                              label={task.status}
                              size="small"
                              color={
                                task.status === 'completed' ? 'success' :
                                task.status === 'in_progress' ? 'primary' :
                                'default'
                              }
                            />
                            <Typography variant="body2" color="text.secondary">
                              Due: {new Date(task.due_date).toLocaleDateString()}
                            </Typography>
                          </Box>
                        }
                      />
                    </ListItem>
                  ))
                )}
              </List>
            </Paper>
          </Grid>

          {/* Recent Activity */}
          <Grid item xs={12} md={6}>
            <Paper sx={{ 
              p: 3,
              background: 'linear-gradient(45deg, #1a1a1a 30%, #2a2a2a 90%)',
              boxShadow: '0 4px 20px rgba(0, 255, 157, 0.1)',
            }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" color="text.secondary">
                  Recent Activity
                </Typography>
              </Box>
              <List>
                {activities.length === 0 ? (
                  <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 3 }}>
                    No recent activity
                  </Typography>
                ) : (
                  activities.slice(0, 5).map((activity) => (
                    <ListItem 
                      key={activity.id}
                      sx={{
                        borderRadius: 1,
                        mb: 1,
                        '&:hover': {
                          backgroundColor: 'rgba(0, 255, 157, 0.1)',
                        },
                      }}
                    >
                      <ListItemText
                        primary={activity.activity_type.replace('_', ' ').toUpperCase()}
                        secondary={
                          <>
                            <Typography component="span" variant="body2" color="text.secondary">
                              {activity.user.first_name} {activity.user.last_name}
                            </Typography>
                            {' — '}
                            {new Date(activity.created_at).toLocaleString()}
                          </>
                        }
                      />
                    </ListItem>
                  ))
                )}
              </List>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default Dashboard; 