import React from 'react';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Box from '@mui/material/Box';
import ListItemText from '@mui/material/ListItemText';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';

import TableView from '../TableView/TableView';
import { Game, BACKEND_API } from '../../common/types';
import styles from './GameList.module.css';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 2;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

interface Filters {
  hide_previous_games: boolean,
  levels: string[],
  teams: string[],
  rinks: string[]
};

interface GameListState {
  games: Game[],
  filters: Filters,
  loading: boolean,
};

class GameList extends React.Component {
  state: GameListState = {
    games: [],
    filters: {
      hide_previous_games: false,
      levels: [],
      teams: [],
      rinks: [],
    },
    loading: true,
  };

  columns = [
    {
      name: 'Level',
      key: 'level',
    }, {
      name: 'Date',
      key: 'date',
    }, {
      name: 'Time',
      key: 'time',
    }, {
      name: 'Rink',
      key: 'rink',
    }, {
      name: 'Home',
      key: (game: Game) => {
        let text: string = game.home;
        if (game.hasOwnProperty("homeGoals")) {
          text += ` (${game.homeGoals})`;
        }
        return (<Tooltip title={<Button variant="text" onClick={() => this.showTeamCalendarLink(game.home)}>Subscribe to Calendar</Button>}>
          <Typography variant="button" display="block">{text}</Typography>
        </Tooltip>);
      }
    }, {
      name: 'Away',
      key: (game: Game) => {
        let text: string = game.away;
        if (game.hasOwnProperty("awayGoals")) {
          text += ` (${game.awayGoals})`;
        }
        return (<Tooltip title={<Button variant="text" onClick={() => this.showTeamCalendarLink(game.away)}>Subscribe to Calendar</Button>}>
          <Typography variant="button" display="block">{text}</Typography>
        </Tooltip>);
      }
    },
  ];

  componentDidMount = () => {
    this.loadGames();
  }

  loadGames = async () => {
    fetch(BACKEND_API + "/games")
      .then(res => {
        return res.json();
      })
      .then(json => {
        let games = json.games.sort(this.gameComparator);
        this.setState({ loading: false, games });
      })
  }

  showTeamCalendarLink = (team: string) => {
    fetch(BACKEND_API + "/seasons/0/teams?team=" + team)
      .then(res => {
        return res.json();
      })
      .then(json => {
        const url: string = json.calendar;
        window.open('https://calendar.google.com/calendar/render?cid=' + url);
      });
  }

  gameComparator = (a: Game, b: Game) => {
    const a_date = Date.parse(`${a.date} ${a.time}`);
    const b_date = Date.parse(`${b.date} ${b.time}`);
    return a_date - b_date;
  }

  handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ filters: { ...this.state.filters, [event.target.name]: event.target.checked } });
  };

  handleListChange = (event: SelectChangeEvent<string[]>) => {
    this.setState({ filters: { ...this.state.filters, [event.target.name]: event.target.value } });
  };

  render() {
    let {
      games,
      filters,
      loading,
    } = this.state;

    let level_options = games.map(g => g.level).filter((x, i, a) => a.indexOf(x) === i).sort();
    let rink_options = games.map(g => g.rink).filter((x, i, a) => a.indexOf(x) === i).sort();
    let level_games = games.filter((g: Game) => filters.levels.length === 0 || filters.levels.indexOf(g.level) !== -1);
    let team_options = level_games.map(g => g.home).concat(level_games.map(g => g.away)).filter((x, i, a) => a.indexOf(x) === i).sort();

    let filtered_games = games.filter((g: Game) => {
      if (filters.levels.length > 0 && filters.levels.indexOf(g.level) === -1) {
        return false;
      }
      if (filters.hide_previous_games) {
        let today = new Date(new Date().toDateString());
        let date = new Date(Date.parse(g.date + ' ' + today.getFullYear()));
        if (date < today) {
          return false;
        }
      }
      if (filters.rinks.length > 0 && filters.rinks.indexOf(g.rink) === -1) {
        return false;
      }
      if (filters.teams.length > 0 && filters.teams.indexOf(g.home) === -1 && filters.teams.indexOf(g.away) === -1) {
        return false;
      }
      return true;
    })

    return (
      <div className={styles.GameList} data-testid="GameList">
        <Box
          component="form"
          sx={{
            '& > :not(style)': { m: 1, width: '25ch' },
          }}>
          <FormControl sx={{ minWidth: 120 }}>
            <InputLabel id="level-helper-label">Level</InputLabel>
            <Select<string[]>
              labelId="level-helper-label"
              id="level-helper"
              multiple
              value={filters.levels}
              label="Level"
              name="levels"
              renderValue={(selected) => `${selected.length} level(s)`}
              onChange={this.handleListChange}
              MenuProps={MenuProps}
            >
              {level_options.map((level: string) => (
                <MenuItem key={level} value={level}>
                  <Checkbox checked={filters.levels.indexOf(level) > -1} />
                  <ListItemText primary={level} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl>
            <FormControlLabel
              sx={{ m: 1, minWidth: 120 }}
              control={<Checkbox
                checked={filters.hide_previous_games}
                onChange={this.handleChange}
                name="hide_previous_games" />}
              label="Hide Previous" />
          </FormControl>
          <FormControl sx={{ minWidth: 120 }}>
            <InputLabel id="rink-helper-label">Rink</InputLabel>
            <Select
              labelId="rink-helper-label"
              id="rink-helper"
              multiple
              value={filters.rinks}
              label="Rink"
              name="rinks"
              renderValue={(selected) => `${selected.length} rink(s)`}
              onChange={this.handleListChange}
              MenuProps={MenuProps}
            >
              {rink_options.map((rink: string) => (
                <MenuItem key={rink} value={rink}>
                  <Checkbox checked={filters.rinks.indexOf(rink) > -1} />
                  <ListItemText primary={rink} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl sx={{ minWidth: 120 }}>
            <InputLabel id="team-helper-label">Teams</InputLabel>
            <Select
              labelId="team-helper-label"
              id="team-helper"
              multiple
              value={filters.teams}
              label="Teams"
              name="teams"
              renderValue={(selected) => `${selected.length} team(s)`}
              onChange={this.handleListChange}
              MenuProps={MenuProps}
            >
              {team_options.map((team: string) => (
                <MenuItem key={team} value={team}>
                  <Checkbox checked={filters.teams.indexOf(team) > -1} />
                  <ListItemText primary={team} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
        {loading && (
          <div>
            <p>Loading...</p>
          </div>
        )}
        <TableView columns={this.columns} rows={filtered_games} />
      </div>
    );
  }
}

export default GameList;
