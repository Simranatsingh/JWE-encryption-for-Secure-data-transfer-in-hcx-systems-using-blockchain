import React from 'react';
import { Container, Typography, Box, Grid, Paper } from '@mui/material';
import { useAuth } from '../hooks/useAuth';

function Dashboard() {
  const { user } = useAuth();

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Welcome, {user?.name}!
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Paper
              sx={{
                p: 3,
                display: 'flex',
                flexDirection: 'column',
                height: 240,
              }}
            >
              <Typography variant="h6" gutterBottom>
                Recent Health Records
              </Typography>
              <Typography variant="body1" color="text.secondary">
                No recent health records found.
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={6}>
            <Paper
              sx={{
                p: 3,
                display: 'flex',
                flexDirection: 'column',
                height: 240,
              }}
            >
              <Typography variant="h6" gutterBottom>
                Transfer History
              </Typography>
              <Typography variant="body1" color="text.secondary">
                No recent transfers found.
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
}

export default Dashboard; 