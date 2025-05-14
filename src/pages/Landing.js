import React from 'react';
import {
  Box,
  Button,
  Container,
  Grid,
  Typography,
  Card,
  CardContent,
  useTheme,
} from '@mui/material';
import { motion } from 'framer-motion';
import {
  TaskAlt,
  NotificationsActive,
  Analytics,
  Sync,
  Group,
  ArrowForward,
} from '@mui/icons-material';
import { Link as RouterLink } from 'react-router-dom';
import dashboard from './images/dashboard.png'

const MotionBox = motion(Box);
const MotionCard = motion(Card);

const features = [
  {
    icon: <TaskAlt sx={{ fontSize: 40 }} />,
    title: 'Smart Task Management',
    description: 'Organize your tasks with intuitive categorization and priority settings.',
  },
  {
    icon: <NotificationsActive sx={{ fontSize: 40 }} />,
    title: 'Deadline Reminders',
    description: 'Never miss a deadline with smart notifications and reminders.',
  },
  {
    icon: <Analytics sx={{ fontSize: 40 }} />,
    title: 'Progress Analytics',
    description: 'Track your productivity with detailed analytics and insights.',
  },
  {
    icon: <Sync sx={{ fontSize: 40 }} />,
    title: 'Cross-device Sync',
    description: 'Access your tasks anywhere with seamless synchronization.',
  },
  {
    icon: <Group sx={{ fontSize: 40 }} />,
    title: 'Collaborative Sharing',
    description: 'Share tasks and collaborate with your team effortlessly.',
  },
];

const Landing = () => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(180deg, #000000 0%, #111111 100%)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background gradient overlay */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'radial-gradient(circle at 50% 50%, rgba(0, 255, 157, 0.1) 0%, transparent 50%)',
          pointerEvents: 'none',
        }}
      />

      <Container maxWidth="lg">
        {/* Hero Section */}
        <Box
          sx={{
            pt: { xs: 8, md: 12 },
            pb: { xs: 8, md: 12 },
            position: 'relative',
          }}
        >
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <MotionBox
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
              >
                <Typography
                  variant="h1"
                  sx={{
                    mb: 2,
                    background: 'linear-gradient(45deg, #ffffff 30%, #00ff9d 90%)',
                    backgroundClip: 'text',
                    textFillColor: 'transparent',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  TaskMate
                </Typography>
                <Typography
                  variant="h2"
                  sx={{ mb: 3, color: 'text.secondary' }}
                >
                  Organize. Track. Achieve.
                </Typography>
                <Typography
                  variant="body1"
                  sx={{ mb: 4, color: 'text.secondary', maxWidth: 600 }}
                >
                  The ultimate task management solution for individuals and teams.
                  Stay organized, meet deadlines, and boost productivity with our
                  intuitive platform.
                </Typography>
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <Button
                    component={RouterLink}
                    to="/signup"
                    variant="contained"
                    size="large"
                    endIcon={<ArrowForward />}
                  >
                    Get Started
                  </Button>
                  <Button
                    component={RouterLink}
                    to="/login"
                    variant="outlined"
                    size="large"
                  >
                    Sign In
                  </Button>
                </Box>
              </MotionBox>
            </Grid>
            <Grid item xs={12} md={6}>
              <MotionBox
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <Box
  component="img"
  src={dashboard}
  alt="TaskMate Dashboard"
  sx={{
    width: '100%',
    maxWidth: 600,
    height: 'auto',
    borderRadius: 4,
    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)',
  }}
/>

              </MotionBox>
            </Grid>
          </Grid>
        </Box>

        {/* Features Section */}
        <Box sx={{ py: { xs: 8, md: 12 } }}>
          <Typography
            variant="h2"
            align="center"
            sx={{ mb: 6 }}
          >
            Powerful Features
          </Typography>
          <Grid container spacing={4}>
            {features.map((feature, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <MotionCard
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ y: -8 }}
                >
                  <CardContent sx={{ p: 4, textAlign: 'center' }}>
                    <Box
                      sx={{
                        color: 'secondary.main',
                        mb: 2,
                        display: 'inline-flex',
                        p: 1,
                        borderRadius: 2,
                        background: 'rgba(0, 255, 157, 0.1)',
                      }}
                    >
                      {feature.icon}
                    </Box>
                    <Typography variant="h5" sx={{ mb: 2 }}>
                      {feature.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {feature.description}
                    </Typography>
                  </CardContent>
                </MotionCard>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* CTA Section */}
        <Box
          sx={{
            py: { xs: 8, md: 12 },
            textAlign: 'center',
          }}
        >
          <MotionBox
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Typography variant="h2" sx={{ mb: 3 }}>
              Ready to Get Started?
            </Typography>
            <Typography
              variant="body1"
              sx={{ mb: 4, color: 'text.secondary', maxWidth: 600, mx: 'auto' }}
            >
              Join thousands of users who are already boosting their productivity
              with TaskMate.
            </Typography>
            <Button
              component={RouterLink}
              to="/signup"
              variant="contained"
              size="large"
              endIcon={<ArrowForward />}
            >
              Create Free Account
            </Button>
          </MotionBox>
        </Box>
      </Container>
    </Box>
  );
};

export default Landing;