import React from 'react';
import './App.css';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';

import GameList from '../GameList/GameList';
import FooterLinks from '../FooterLinks/FooterLinks';

function App() {
  return (
    <Container maxWidth="lg" className="App">
      <Box pt={2} sx={{ minWidth: 120 }}>
        <Stack spacing={2}>
          <Typography variant="h3" component="h3" pt={1} color="#FFF">
            Solar4America Stats Browser
          </Typography>
          <Paper>
            <GameList />
          </Paper>
        </Stack>
      </Box>
      <FooterLinks />
    </Container>
  );
}

export default App;