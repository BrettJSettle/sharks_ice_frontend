import React from 'react';
import './App.css';
import Container from '@material-ui/core/Container';
import { Paper } from '@material-ui/core';

import GameSelect from '../GameSelect/GameSelect';

function App() {
  return (
    <Container maxWidth="md" className="App">
      <Paper>
        <GameSelect />
      </Paper>
    </Container>
  );
}
export default App;