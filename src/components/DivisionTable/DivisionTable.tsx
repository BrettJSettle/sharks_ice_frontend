import React, { FC, useState, useEffect } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Link from '@mui/material/Link';
import IconButton from '@mui/material/IconButton';

import StarBorderIcon from '@mui/icons-material/StarBorder';
import StarIcon from '@mui/icons-material/Star';

import { Division, Team, LIKED_TEAMS_KEY } from '../../common/types';
import { eventBus } from '../../common/util';
import styles from './DivisionTable.module.css';

interface DivisionTableProps {
  division: Division
}

const DivisionTable: FC<DivisionTableProps> = (props) => {
  const [likedTeams, setLikedTeams] = useState(() => {
    const saved = localStorage.getItem(LIKED_TEAMS_KEY) || "[]";
    const initial = JSON.parse(saved);
    return initial;
  });

  useEffect(() => {
    // storing input name
    localStorage.setItem(LIKED_TEAMS_KEY, JSON.stringify(likedTeams));
    eventBus.dispatch("teamsChanged", true);
  }, [likedTeams]);

  const togglelikeTeam = (teamId: string) => {
    const id = likedTeams.indexOf(teamId);
    if (id < 0) {
      likedTeams.push(teamId);
    } else {
      likedTeams.splice(id, 1);
    }
    setLikedTeams([...likedTeams]);
  }

  const divisionUrl = () => {
    return "https://stats.sharksice.timetoscore.com/display-league-stats?" +
      "stat_class=1&league=1&season=" + props.division.seasonId +
      "&level=" + props.division.id + "&conf=" + props.division.conferenceId;
  }

  return (
    <div className={styles.DivisionTable} data-testid="DivisionTable">
      <Link
        href={divisionUrl()}>Division Player Stats</Link>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell></TableCell>
              <TableCell>Rank</TableCell>
              <TableCell align="right">Name</TableCell>
              <TableCell align="right">Games Played</TableCell>
              <TableCell align="right">Wins</TableCell>
              <TableCell align="right">Losses</TableCell>
              <TableCell align="right">Ties</TableCell>
              <TableCell align="right">OTL</TableCell>
              <TableCell align="right">Tie Breaker</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {props.division.teams.map((team: Team, i: number) => {
              const liked = likedTeams.indexOf(team.id) >= 0;
              return (
                <TableRow
                  key={team.name}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    <IconButton
                      aria-label="Favorite"
                      color="primary"
                      onClick={() => togglelikeTeam(team.id)}>
                      {liked ? <StarIcon /> : <StarBorderIcon />}
                    </IconButton>
                  </TableCell>
                  <TableCell component="th" scope="row">{i + 1}</TableCell>
                  <TableCell align="left">{team.name}</TableCell>
                  <TableCell align="right">{team.gamesPlayed}</TableCell>
                  <TableCell align="right">{team.wins}</TableCell>
                  <TableCell align="right">{team.losses}</TableCell>
                  <TableCell align="right">{team.ties}</TableCell>
                  <TableCell align="right">{team.overtimeLosses}</TableCell>
                  <TableCell align="right">{team.tieBreaker}</TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </div>);
}

export default DivisionTable;
