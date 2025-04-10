import React from 'react';
import { Container, Typography, Box, Paper } from '@mui/material';

function HealthRecords() {
  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Health Records
        </Typography>
        <Paper sx={{ p: 3 }}>
          <Typography variant="body1" color="text.secondary">
            No health records available.
          </Typography>
        </Paper>
      </Box>
    </Container>
  );
}

export default HealthRecords; 