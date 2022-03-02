import React from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import Link from '@mui/material/Link';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import SportsIcon from '@mui/icons-material/Sports'; // Whistle
import SportsScoreIcon from '@mui/icons-material/SportsScore';  // Goal
// import IconButton from '@mui/material/IconButton';
// import VideocamIcon from '@mui/icons-material/Videocam'; // Livebarn link

import { BACKEND_API, GameStats, GameEvent, Shootout, Penalty, Goal } from '../../common/types';
import styles from './GameStatsView.module.css';

interface GameStatsViewProps {
  gameId?: string
}

interface GameStatsViewState {
  loading: boolean,
  gameStats?: GameStats,
}

class GameStatsView extends React.Component<GameStatsViewProps> {
  state: GameStatsViewState = {
    loading: false,
    gameStats: undefined
  };

  componentDidMount() {
    this.loadGameStats();
  }

  loadGameStats = () => {
    if (!this.props.gameId) {
      return;
    }
    this.setState({ loading: true })
    fetch(BACKEND_API + '/games/' + this.props.gameId)
      .then(data => {
        return data.json();
      }).then((gameStats: GameStats) => {
        this.setState({
          loading: false,
          gameStats,
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

  buildGameEvents = (gameStats: GameStats) => {
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
  render() {
    const {
      loading,
      gameStats,
    } = this.state;
    if (loading) {
      return <CircularProgress />;
    }
    if (gameStats === undefined) {
      return null;
    }
    const gameEvents = this.buildGameEvents(gameStats);

    let eventRows = gameEvents.map((gameEvent: GameEvent, key: number) => {
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
      }
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
      </ListItem>;
    });

    let url = `https://stats.sharksice.timetoscore.com/oss-scoresheet?game_id=${this.props.gameId}&mode=display`;

    return <div className={styles.GameStatsView} data-testid="GameStatsView">
      <Box>
        <Typography>
          {`${gameStats.home}-${gameStats.homeGoals} vs. ${gameStats.visitor}-${gameStats.visitorGoals}`}
        </Typography>
        <Link href={url}>View Scoresheet</Link>
        <List>
          {eventRows}
        </List>
      </Box>
    </div>;
  }
}

export default GameStatsView;
