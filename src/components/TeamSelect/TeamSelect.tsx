import React, { Component } from 'react';
import Typography from '@mui/material/Typography';
import FormControl from '@mui/material/FormControl';
import MenuItem from '@mui/material/MenuItem';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import Grid from '@mui/material/Grid';
import CircularProgress from '@mui/material/CircularProgress';
import Link from '@mui/material/Link';
import Paper from '@mui/material/Paper';


import styles from './TeamSelect.module.css';

import { BACKEND_API, Team, Division, TeamInfo, TeamState } from '../../common/types';

interface TeamSelectProps {
  onChange?: React.Dispatch<React.SetStateAction<TeamState>>,
  divId?: string,
  conferenceId?: string,
  teamId?: string,
  gameId?: string,
}

interface TeamSelectState {
  divisions?: [Division],
  teamInfo?: TeamInfo,
  loadingGames: boolean,
}


class TeamSelect extends Component<TeamSelectProps> {
  state: TeamSelectState = {
    divisions: undefined,
    teamInfo: undefined,
    loadingGames: false,
  };

  componentDidMount() {
    if (this.props.divId === undefined) {
      this.loadDivisions();
    }
  }

  loadDivisions = () => {
    fetch(BACKEND_API + '/divisions')
      .then(data => {
        return data.json();
      }).then(({divisions}) => {
        this.setState({
          divisions,
        });
        if (this.props.onChange) {
          this.props.onChange({
            divId: divisions[0].id,
            conferenceId: divisions[0].conference_id,
          });
        }
      }).catch(error => {
        console.log(error);
        // setTimeout(this.loadDivisions, 3000)
      });
  }

  loadTeamGames = (teamId: string = this.props.teamId || "") => {
    fetch(BACKEND_API + '/teams/' + teamId)
      .then(data => {
        return data.json();
      }).then(teamInfo => {
        this.setState({
          teamInfo,
          loadingGames: false,
        });
      }).catch(error => {
        console.log(error);
        // setTimeout(this.loadTeamGames, 3000)
      });
  }

  handleChange = (event: SelectChangeEvent<string>) => {
    let key: string = event.target.name || "";
    let loadingGames = false;
    let newTeamState: TeamState = { ...this.props };
    if (key === 'teamId') {
      setTimeout(() => this.loadTeamGames('' + event.target.value), 200);
      loadingGames = true;
    }
    if (key === 'divId') {
      let parts = event.target.value.split('#');
      newTeamState = {
        divId: parts[0],
        conferenceId: parts[1],
      };
    } else {
      newTeamState = { ...newTeamState, [key]: event.target.value };
    }
    if (this.props.onChange) {
      this.props.onChange(newTeamState);
    }
    this.setState({
      loadingGames,
    });
  }

  renderTeamSelect = () => {
    const {
      divisions,
    } = this.state;
    const {
      divId = '',
      conferenceId = '',
      teamId = ''
    } = this.props;
    if (divisions === undefined) {
      return <CircularProgress />
    }
    const divKey = (div: string, conf: string) => ((div === '') ? '' : `${div}#${conf}`);
    const divisionItems = divisions && divisions.sort().map((division: Division) =>
      <MenuItem key={division.name} value={divKey(division.id, division.conference_id)}>{division.name}</MenuItem>
    );
    const selectedDivision = divisions.find(div => div.id === divId);
    const teamItems = selectedDivision && selectedDivision.teams
      .sort((a: Team, b: Team) => (a.name.localeCompare(b.name)))
      .map((team: Team) =>
        <MenuItem key={team.id} value={team.id}>{team.name}</MenuItem>
      );
    return <Grid container spacing={2}>
      <Grid item xs={3} sm={2} md={2}>
        <FormControl fullWidth>
          <InputLabel id="division-select-label">Division</InputLabel>
          <Select
            labelId="division-select-label"
            label="Division"
            value={divKey(divId, conferenceId)}
            name="divId"
            onChange={this.handleChange}
            children={divisionItems}
          />
        </FormControl>
      </Grid>
      <Grid item xs={9} sm={10} md={10}>
        <FormControl fullWidth>
          <InputLabel id="team-select-label">Team</InputLabel>
          <Select
            labelId="team-select-label"
            label="Team"
            name="teamId"
            value={teamId}
            children={teamItems}
            onChange={this.handleChange}
          />
        </FormControl>
      </Grid>
      <Grid item xs={12} sm={12} md={12}>
        {this.renderGameSelect()}
      </Grid>
    </Grid>
  }

  renderGameSelect = () => {
    const {
      teamInfo,
      loadingGames
    } = this.state;
    const {
      gameId = ''
    } = this.props;
    if (loadingGames) {
      return <CircularProgress />
    }
    if (teamInfo === undefined) {
      return null;
    }
    const gameItems = teamInfo && teamInfo.games
      // .sort((a: Game, b: Game) => a.Date.localeCompare(b.Date))
      .map((game) => {
        const game_str = game.home + ' vs ' + game.away + ' (' + game.rink + ')  ' + game.date + '@' + game.time;
        let year = new Date().getFullYear();
        let gameTime = Date.parse(game.date + ' ' + year + ' ' + game.time);
        // TODO: Estimate year somehow instead of using current year.
        const in_future = Date.now() < gameTime
        return <MenuItem disabled={in_future} key={game.id} value={game.id}>{game_str}</MenuItem>
      });
    return <div>
      {teamInfo.calendar &&
        <Link href={'http://www.google.com/calendar/render?cid=' + teamInfo.calendar}>Subscribe to Calendar</Link>}
      <FormControl fullWidth>
        <InputLabel id="game-select-label">Game</InputLabel>
        <Select
          labelId="game-select-label"
          value={gameId}
          label="Game"
          name="gameId"
          children={gameItems}
          onChange={this.handleChange}
        />
      </FormControl>
    </div>
  }

  render() {
    return (
      <Paper className={styles.TeamSelect} data-testid="TeamSelect">
        <Typography variant="h5" component="h3" gutterBottom>
          Choose your division and team
        </Typography>
        {this.renderTeamSelect()}
      </Paper >);
  }
}

export default TeamSelect;
