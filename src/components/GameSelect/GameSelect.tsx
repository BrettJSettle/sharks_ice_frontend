import React, { Component } from 'react';
import styles from './GameSelect.module.css';
import Typography from '@mui/material/Typography';
import FormControl from '@mui/material/FormControl';
import MenuItem from '@mui/material/MenuItem';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import Grid from '@mui/material/Grid';
import CircularProgress from '@mui/material/CircularProgress';
import Link from '@mui/material/Link';
import Card from '@mui/material/Card';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';

// import IconButton from '@mui/material/IconButton';
import SportsIcon from '@mui/icons-material/Sports'; // Whistle
import SportsScoreIcon from '@mui/icons-material/SportsScore';  // Goal
// import VideocamIcon from '@mui/icons-material/Videocam'; // Livebarn link

const BACKEND_API = 'http://192.168.86.29:8080/sharks_ice/api';

interface Team {
  name: string,
  id: string,
  GP: string,
  W: string,
  T: string,
  L: string,
  OTL: string,
  PTS: string,
}

interface Division {
  conference_id: string,
  id: string,
  name: string,
  season_id: string,
  teams: [Team],
}

interface Penalty {
  period: number,
  number: string,
  infraction: string,
  minutes: string,
  start: string,
  end: string,
  on_ice: string,
  off_ice: string,
}

interface Shootout {
  number: string,
  player: string,
  result: string,
}

interface Goal {
  period: number,
  time: string,
  extra: string,
  goal: string,
  assist1: string,
  assist2: string
}

interface GameEvent {
  type: string,
  period: number,
  time: string,
  team: string,
  number: string,
  description: string
}

interface GameStats {
  date: string,
  time: string,
  league: string,
  rink: string,
  level: string,
  periodLength: string,
  referee1: string,
  referee2: string,
  scorekeeper: string,
  home: string,
  visitor: string,
  homeGoals: string,
  visitorGoals: string,
  homeScoring: [Goal],
  homePenalties: [Penalty],
  homeShootout: [Shootout],
  homePlayers: [Player],
  visitorScoring: [Goal],
  visitorPenalties: [Penalty],
  visitorShootout: [Shootout],
  visitorPlayers: [Player],
}

interface Game {
  id: string,
  date: string,
  time: string,
  rink: string,
  level: string,
  type: string,
  home: string,
  away: string,
  home_goals?: number,
  away_goals?: number,
}

interface TeamInfo {
  calendar?: string,
  games: [Game],
}

interface Player {
  team: string,
  number: string,
  position: string,
  name: string,
}

interface GameSelectState {
  divisions?: [Division],
  teamInfo?: TeamInfo,
  gameStats?: GameStats,
  selectedDivisionId: string,
  selectedTeamId: string,
  selectedGameId: string,
  loadingGames: boolean,
  loadingGameStats: boolean,
}


class GameSelect extends Component {
  state: GameSelectState = {
    divisions: undefined,
    teamInfo: undefined,
    gameStats: undefined,
    selectedDivisionId: '',
    selectedTeamId: '',
    selectedGameId: '',
    loadingGames: false,
    loadingGameStats: false
  };

  componentDidMount() {
    this.loadDivisions();
  }

  loadDivisions = () => {
    fetch(BACKEND_API + '/divisions')
      .then(data => {
        return data.json();
      }).then(divisions => {
        this.setState({
          divisions,
          'selectedDivisionId': divisions[0].id,
        });
      }).catch(error => {
        console.log(error);
        // setTimeout(this.loadDivisions, 3000)
      });
  }

  loadDivisionPlayers = (div_id: string, conference_id: string) => {
    fetch(BACKEND_API + '/divisions/' + div_id + '/conference/' + conference_id)
      .then(data => {
        return data.json();
      }).then(divisionPlayers => {
        this.setState({
          divisionPlayers,
        });
      }).catch(error => {
        console.log(error);
        // setTimeout(this.loadDivisions, 3000)
      });
  }

  loadTeamGames = (selectedTeamId: string = this.state.selectedTeamId) => {
    fetch(BACKEND_API + '/teams/' + selectedTeamId)
      .then(data => {
        return data.json();
      }).then(teamInfo => {
        this.setState({
          selectedTeamId,
          teamInfo,
          loadingGames: false
        });
      }).catch(error => {
        console.log(error);
        // setTimeout(this.loadTeamGames, 3000)
      });
  }

  loadGameStats = (selectedGameId: string = this.state.selectedGameId) => {
    fetch(BACKEND_API + '/games/' + selectedGameId)
      .then(data => {
        return data.json();
      }).then(gameStats => {
        this.setState({
          selectedGameId,
          gameStats,
          loadingGameStats: false
        });
      }).catch(error => {
        console.log(error);
        // setTimeout(this.loadTeamGames, 3000)
      });
  }

  _goalGameEvent = (goal: Goal, team: string): GameEvent => {
    let description = "";
    if (!!goal.assist1) {
      description += `Assists: ${goal.assist1}`;
    }
    if (!!goal.assist2) {
      description += ` and ${goal.assist2}`;
    }
    return {
      type: 'GOAL',
      team: team,
      period: goal.period,
      time: goal.time,
      number: goal.goal,
      description: description
    };
  }

  _penaltyGameEvent = (penalty: Penalty, team: string): GameEvent => {
    const description = `${penalty.minutes} minutes for ${penalty.infraction}`
    return {
      type: 'PENALTY',
      team: team,
      period: penalty.period,
      time: penalty.off_ice,
      number: penalty.number,
      description: description
    };
  }

  _shootoutGameEvent = (shootout: Shootout, team: string): GameEvent => {
    const description = `${shootout.player} with ${shootout.result}`
    return {
      type: 'SHOOTOUT GOAL',
      team: team,
      period: 4,
      time: '00:00',
      number: shootout.number,
      description: description
    };
  }

  parseTime = (time: string): number => {
    if (time.match(':')) {
      const parts = time.split(':');
      return parseInt(parts[0]) * 60 + parseInt(parts[1]);
    }
    return parseFloat(time);
  }

  loadGameEvents = (gameStats: GameStats) => {
    var events: GameEvent[] = [];
    gameStats.homeScoring.forEach((goal: Goal) => {
      events.push(this._goalGameEvent(goal, gameStats.home));
    });
    gameStats.visitorScoring.forEach((goal: Goal) => {
      events.push(this._goalGameEvent(goal, gameStats.visitor));
    });
    gameStats.homePenalties.forEach((penalty: Penalty) => {
      events.push(this._penaltyGameEvent(penalty, gameStats.home));
    });
    gameStats.visitorPenalties.forEach((penalty: Penalty) => {
      events.push(this._penaltyGameEvent(penalty, gameStats.visitor));
    });
    gameStats.homeShootout.forEach((shootout: Shootout) => {
      events.push(this._shootoutGameEvent(shootout, gameStats.home));
    });
    gameStats.visitorShootout.forEach((shootout: Shootout) => {
      events.push(this._shootoutGameEvent(shootout, gameStats.visitor));
    });
    events.sort((a: GameEvent, b: GameEvent) => {
      if (a.period !== b.period) {
        return a.period - b.period;
      }
      return this.parseTime(b.time) - this.parseTime(a.time);
    });
    return events;
  }

  handleChange = (event: SelectChangeEvent<string>) => {
    let key: string = event.target.name || "";
    let loadingGameStats = false;
    let loadingGames = false;
    if (key === 'selectedTeamId') {
      setTimeout(() => this.loadTeamGames('' + event.target.value), 200);
      loadingGames = true;
    } else if (key === 'selectedGameId') {
      setTimeout(() => this.loadGameStats('' + event.target.value), 200);
      loadingGameStats = true
    }
    this.setState({
      [key]: event.target.value,
      loadingGames, loadingGameStats
    });
  }

  renderTeamSelect = () => {
    const {
      divisions,
      selectedDivisionId,
      selectedTeamId,
    } = this.state;
    if (divisions === undefined) {
      return <CircularProgress />
    }
    const divisionItems = divisions && divisions.sort().map((division: Division) =>
      <MenuItem key={division.name} value={division.id}>{division.name}</MenuItem>
    );
    const selectedDivision = divisions.find(div => div.id === selectedDivisionId);
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
            value={selectedDivisionId}
            name="selectedDivisionId"
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
            name="selectedTeamId"
            value={selectedTeamId}
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
      selectedGameId,
      loadingGames
    } = this.state;
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
          value={selectedGameId}
          label="Game"
          name="selectedGameId"
          children={gameItems}
          onChange={this.handleChange}
        />
      </FormControl>
    </div>
  }

  renderDivPlayers = () => {
    var divisionPlayers: Player[] = [];
    if (!this.state.selectedDivisionId) {
      return null;
    }
    return <Card>
      <List>
        {divisionPlayers.map((player, key) => {
          let text = `${player.number} ${player.name}`;
          return <ListItem
            key={key}
          >
            <ListItemText
              primary={text}
              secondary={player.team}
            />
          </ListItem>
        })}
      </List>
    </Card>
  }

  renderGameStats = () => {
    let {
      gameStats,
      selectedGameId,
      loadingGameStats
    } = this.state;
    if (loadingGameStats) {
      return <CircularProgress />
    }
    if (gameStats === undefined) {
      return null;
    }
    let events = this.loadGameEvents(gameStats)

    let eventRows = events.map((gameEvent: GameEvent, key: number) => {
      let text = `P${gameEvent.period}@${gameEvent.time} - ${gameEvent.team} ${gameEvent.type} by #${gameEvent.number}`;
      let secondary = `${gameEvent.description}`;
      let icon = null;
      switch (gameEvent.type) {
        case "GOAL":
        case "SHOOTOUT GOAL":
          icon = <SportsScoreIcon />
          break;
        case "PENALTY":
          icon = <SportsIcon />
          break;
        default:
          break;
      };
      return <ListItem
        key={key}
      //  secondaryAction={
      //    <IconButton edge="end" aria-label="Videocam" href={penalty.livebarn}>
      //      <VideocamIcon />
      //    </IconButton>
      //  }
      >
        <ListItemIcon>
            {icon}
        </ListItemIcon>
        <ListItemText
          primary={text}
          secondary={secondary}
        />
      </ListItem>
    });

    let url = `https://stats.sharksice.timetoscore.com/oss-scoresheet?game_id=${selectedGameId}&mode=display`

    return <div>
      <Link href={url}>View Scoresheet</Link>
      <List>
        {eventRows}
      </List>
    </div>;
  }

  render() {
    return (
      <div className={styles.GameSelect} data-testid="GameSelect">
        <Typography variant="h5" component="h3" gutterBottom>
          Choose your division and team
        </Typography>
        {this.renderTeamSelect()}
        <br/>
        {this.renderGameStats()}
        {/* {this.renderDivPlayers()} */}
      </div >);
  }
}

export default GameSelect;
