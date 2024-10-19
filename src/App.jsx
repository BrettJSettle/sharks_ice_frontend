import { useState } from 'react'

import Stack from '@mui/material/Stack';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import FormGroup from '@mui/material/FormGroup';

import './App.css'
import GameTable from './GameTable'
import DivisionList from './DivisionList'
import TeamInfo from './TeamInfo'


function App() {
  const [teams, setTeams] = useState([])
  const [upcomingOnly, setUpcomingOnly] = useState(false)

  const toggleUpcomingOnly = (event) => {
    setUpcomingOnly(event.target.checked);
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Stack spacing={2}>
        <Paper className="paper-section">
          <Box sx={{pb: 2}}>
          <Typography variant={"h5"} id="section-header">
            Select Your Teams
          </Typography>
          <DivisionList setTeams={setTeams}/>
          </Box>
          <TeamInfo teamIds={teams}/>
        </Paper>
        <Paper className="paper-section">
          <Box  display="flex" justifyContent="space-between">
          <Typography variant={"h5"} id="section-header">
            Games
          </Typography>
          <FormGroup>
            <FormControlLabel 
              control={
                <Checkbox value={upcomingOnly} onChange={toggleUpcomingOnly} />
              }
              label="Upcoming" />
          </FormGroup>
          </Box> 
          <GameTable teams={teams} upcomingOnly={upcomingOnly}/>
        </Paper>
      </Stack>
    </Box>
  )
}

export default App
