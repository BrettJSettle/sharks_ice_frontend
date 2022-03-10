import React, { useState } from 'react';
import './App.css';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';

import TeamSelect from '../TeamSelect/TeamSelect';
import PlayerTable from '../PlayerTable/PlayerTable';
import GameStatsView from '../GameStatsView/GameStatsView';
import { TeamState } from '../../common/types';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  tab: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, tab, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={tab !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {tab === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

function App() {
  const [tab, setTab] = useState(0);
  const [teamState, setTeamState] = useState<TeamState>({
    gameId: undefined,
    divId: undefined,
    teamId: undefined,
    conferenceId: undefined,
  });

  const handleChange = (event: React.SyntheticEvent, newTab: number) => {
    setTab(newTab);
  };

  return (
    <Container maxWidth="lg" className="App">
      <Box pt={2} sx={{ minWidth: 120 }}>
        <Stack spacing={2}>
          <Typography variant="h3" component="h3" pt={1} color="#FFF">
            Solar4America Stats Browser
          </Typography>
          <Paper>
            <TeamSelect onChange={setTeamState} {...teamState} />
          </Paper >
          <Paper>
            <Tabs value={tab} onChange={handleChange} aria-label="basic tabs example">
              <Tab label="Game Stats" id='simple-tab-0' aria-controls='simple-tabpanel-0' />
              <Tab label="Player Stats" id='simple-tab-1' aria-controls='simple-tabpanel-1' />
            </Tabs>
            <TabPanel tab={tab} index={0}>
              <GameStatsView gameId={teamState.gameId} />
            </TabPanel>
            <TabPanel tab={tab} index={1}>
              <PlayerTable divId={teamState.divId} conferenceId={teamState.conferenceId} />
            </TabPanel>
          </Paper>
        </Stack>
      </Box>
    </Container>
  );
}
export default App;