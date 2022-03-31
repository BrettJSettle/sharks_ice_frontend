import React from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import { Game, LIKED_TEAMS_KEY, BACKEND_API } from '../../common/types';
import { getSeason, eventBus } from '../../common/util';
import styles from './GameList.module.css';


interface GameListState {
  games: { [key: string]: Game },
};

class GameList extends React.Component {
  state: GameListState = {
    games: {}
  };

  loadGameList = () => {
    const saved = localStorage.getItem(LIKED_TEAMS_KEY) || "[]";
    const likedTeams = JSON.parse(saved);
    console.log(likedTeams)
    this.loadGames(likedTeams);
  }

  componentDidMount = () => {
    eventBus.on("teamsChanged", this.loadGameList);
    this.loadGameList();
  }

  componentWillUnmount() {
    eventBus.remove("teamsChanged", this.loadGameList);
  }

  addGames = (newGames: Game[]) => {
    let {
      games
    } = this.state;
    newGames.forEach((game: Game) => {
      games[game.id] = game;
    });
    this.setState({ games });
  }

  loadGames = async (teams: string[]) => {
    const season = getSeason();
    this.setState({games: []})
    await Promise.all(teams.map(async (team: string) => {
      try {
        const data = await fetch(BACKEND_API + `/seasons/${season}/teams/${team}?reload=true`);
        const { games } = await data.json();
        this.addGames(games);
      } catch (error) {
        console.log(error);
      }
    }));
  }

  gameComparator = (a: Game, b: Game) => {
    const a_date = Date.parse(`${a.date} ${a.time}`);
    const b_date = Date.parse(`${b.date} ${b.time}`);
    return b_date - a_date;
  }

  render() {
    let {
      games
    } = this.state;

    let sortedGames = Object.values(games).sort(this.gameComparator);
    return (
      <div className={styles.GameList} data-testid="GameList">
        {sortedGames.map((game: Game, i: number) => {
          const homeSuffix = (game.homeGoals || -1) < 0 ? "" : `(${game.homeGoals})`;
          const awaySuffix = (game.awayGoals || -1) < 0 ? "" : `(${game.awayGoals})`;
          const title = `${game.home}${homeSuffix} vs ${game.away}${awaySuffix}`
          let subtext = '';
          subtext = `${game.rink} on ${game.date} ${game.time}`;
          return (<Accordion key={i}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1a-content"
              id="panel1a-header">
              <Typography sx={{ textAlign: 'left', width: '50%', flexShrink: 0 }}>{title}</Typography>
              <Typography sx={{ color: 'text.secondary' }}>{subtext}</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Link href={`https://stats.sharksice.timetoscore.com/oss-scoresheet?game_id=${game.id}&mode=display`}>View Scoresheet</Link>
              {/* <iframe
                className="scoresheet"
                title="scoresheet"
                src={`https://stats.sharksice.timetoscore.com/oss-scoresheet?game_id=${game.id}&mode=display`}></iframe> */}
            </AccordionDetails>
          </Accordion>)
        })}
      </div>
    );
  }
}

export default GameList;
