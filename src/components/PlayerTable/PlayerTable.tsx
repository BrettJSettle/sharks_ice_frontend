import React from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import ToggleButton from '@mui/material/ToggleButton';
import Typography from '@mui/material/Typography';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import { DataGrid, GridColDef } from '@mui/x-data-grid';

import styles from './PlayerTable.module.css';
import { getSeason } from '../../common/util';
import { Player, Goalie, BACKEND_API } from '../../common/types';

interface PlayerTableProps {
  divId?: string,
  conferenceId?: string
};

interface PlayerTableState {
  loading: boolean,
  view: string,
  players: [Player] | undefined,
  goalies: [Goalie] | undefined
};

class PlayerTable extends React.Component<PlayerTableProps> {
  state: PlayerTableState = {
    loading: false,
    view: 'players',
    players: undefined,
    goalies: undefined,
  };

  componentDidMount() {
    this.loadPlayers();
  }

  componentDidUpdate(prevProps: PlayerTableProps) {
    console.log(this.props)
    if (this.props.divId !== prevProps.divId || this.props.conferenceId !== prevProps.conferenceId) {
      this.loadPlayers();
    }
  }

  loadPlayers = () => {
    const {
      divId,
      conferenceId
    } = this.props;
    if (!divId) {
      return;
    }
    this.setState({ loading: true });
    let season = getSeason();
    fetch(BACKEND_API + `/seasons/${season}/divisions/${divId}/conference/${conferenceId}`)
      .then(data => {
        return data.json();
      }).then(({ players, goalies }) => {
        this.setState({
          loading: false,
          players,
          goalies,
        });
      }).catch(error => {
        console.log(error);
        // setTimeout(this.loadDivisions, 3000)
      });
  }

  handleChange = (
    event: React.MouseEvent<HTMLElement>,
    view: string
  ) => {
    this.setState({ view });
  }

  render() {
    const {
      players = [],
      view,
      loading,
    } = this.state;

    if (loading) {
      return <CircularProgress />;
    }

    if (players.length === 0) {
      return <Typography>Select a team above...</Typography>;
    }
    return <div className={styles.PlayerTable} data-testid="PlayerTable">
      <ToggleButtonGroup
        color="primary"
        value={view}
        exclusive
        onChange={this.handleChange}
      >
        <ToggleButton value="players">Players</ToggleButton>
        <ToggleButton value="goalies">Goalies</ToggleButton>
      </ToggleButtonGroup>
      <div style={{paddingBottom: 10}}>
        {view === 'players' && this.renderPlayerTable()}
        {view === 'goalies' && this.renderGoalieTable()}
      </div>
    </div>
  }

  renderPlayerTable = () => {
    const {
      players = []
    } = this.state;
    const columns: GridColDef[] = [
      { field: 'name', headerName: 'Name', width: 180 },
      { field: 'number', headerName: '#', width: 60 },
      { field: 'team', headerName: 'Team', width: 180 },
      { field: 'gamesPlayed', headerName: 'GP', width: 60, type: 'number' },
      { field: 'goals', headerName: 'Goals', type: 'number', width: 60 },
      { field: 'assists', headerName: 'Assists', width: 60, type: 'number' },
      { field: 'hatTricks', headerName: 'Hats', width: 60, type: 'number' },
      { field: 'penaltyMinutes', headerName: 'PM', width: 60, type: 'number' },
      { field: 'points', headerName: 'Pts', width: 60, type: 'number' },
      { field: 'pointsPerGame', headerName: 'Pts/Game', width: 80, type: 'number' },
    ];
    const rows = players.map((player: Player, i: number) => { return { id: i, ...player } });
    return (
      <div style={{ height: 800, width: '100%' }}>
        <DataGrid
          rows={rows}
          columns={columns}
          pageSize={25}
          rowsPerPageOptions={[10, 25, 50]}
        />
      </div>
    );
  }

  renderGoalieTable = () => {
    const {
      goalies = []
    } = this.state;
    const columns: GridColDef[] = [
      { field: 'name', headerName: 'Name', width: 180 },
      { field: 'number', headerName: '#', width: 60 },
      { field: 'team', headerName: 'Team', width: 180 },
      { field: 'gamesPlayed', headerName: 'GP', width: 60, type: 'number' },
      { field: 'goalsAgains', headerName: 'GA', type: 'number', width: 60 },
      { field: 'goalsAgainstAverage', headerName: 'GAA', width: 60, type: 'number' },
      { field: 'shutouts', headerName: 'SO', width: 60, type: 'number' },
      { field: 'shots', headerName: 'Shots', width: 60, type: 'number' },
      { field: 'savePercentage', headerName: 'Save %', width: 70, type: 'number' },
    ];
    const rows = goalies.map((goalie: Goalie, i: number) => { return { id: i, ...goalie } });
    return (
      <div style={{ height: 800, width: '100%' }}>
        <DataGrid
          rows={rows}
          columns={columns}
          pageSize={25}
          rowsPerPageOptions={[10, 25, 50]}
        />
      </div>
    );
  }
}

export default PlayerTable;
