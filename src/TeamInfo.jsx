import React, { useState, useEffect } from 'react';
import { styled } from '@mui/material/styles';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import Link from '@mui/material/Link';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

import { BACKEND } from './constants'

const GCAL_SUBSCRIBE = 'https://calendar.google.com/calendar/render?cid='
const CALENDAR = 'webcal://stats.sharksice.timetoscore.com/team-cal.php?team={team}&season={season}'

const StyledHeaderCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.backgroundColorblack,
    color: theme.palette.common.color,
    fontSize: 16,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 16,
  },
}));

const StyledRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));


const CalendarLink = ({ url }) => {
  return (
        <Link href={url}><CalendarMonthIcon  style={{verticalAlign:"middle"}}/></Link>
  );
};

function TeamInfo({ teamIds }) {
  const [teams, setTeams] = useState([]);

  useEffect(() => {
    fetch(BACKEND + "/api/teams?team_ids=" + teamIds.join(','))
    .then(response => response.json())
    .then(data => {
      setTeams(data.map(team =>  {
        team['level'] = team['level'].replace('Adult Division', 'Div')
        team['calendar'] = CALENDAR.replace('{team}', team['team_id']).replace('{season}', team['season_id']);
        return team;
      }));
    })
    .catch(error => {
      console.log(error);
    })
  }, [teamIds]);

  return (
  <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow sx={{backgroundColor: '#ddd'}}>
            <StyledHeaderCell>Team</StyledHeaderCell>
            <StyledHeaderCell>Season</StyledHeaderCell>
            <StyledHeaderCell>Level</StyledHeaderCell>
            <StyledHeaderCell align="right">#</StyledHeaderCell>
            <StyledHeaderCell align="right">Cal</StyledHeaderCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {teams.length == 0 && <TableRow key="no-teams">
            <TableCell>No teams selected</TableCell>
          </TableRow>}
          {teams.map((team) => {
            return (
            <StyledRow
              key={team.name}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {team.name}
              </TableCell>
              <TableCell>{team.season}</TableCell>
              <TableCell>{team.level}</TableCell>
              <TableCell align="right">{team.stats['place']}</TableCell>
              <TableCell align="right">
                <CalendarLink 
                  url={GCAL_SUBSCRIBE + CALENDAR.replace('{team}', team['team_id'])}/>
              </TableCell>
            </StyledRow>
          );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default TeamInfo;