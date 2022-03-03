import React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import CircularProgress from '@mui/material/CircularProgress';

import styles from './PlayerTable.module.css';
import { Player, Goalie, BACKEND_API } from '../../common/types';

interface PlayerTableProps {
  divId?: string,
  conferenceId?: string
}

interface PlayerTableState {
  loading: boolean,
  players: [Player] | undefined,
  goalies: [Goalie] | undefined
};

class PlayerTable extends React.Component<PlayerTableProps> {
  state: PlayerTableState = {
    loading: false,
    players: undefined,
    goalies: undefined,
  };

  createRow = (player: Player) => {
    return {
      name: player.name,
      number: player.number,
      team: player.team,
    }
  }

  componentDidMount() {
    this.loadPlayers();
  }

  componentDidUpdate(prevProps: PlayerTableProps) {
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
    fetch(BACKEND_API + '/seasons/current/divisions/' + divId + '/conference/' + conferenceId)
      .then(data => {
        return data.json();
      }).then(({players, goalies}) => {
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

  render() {
    const {
      players = [],
      loading,
    } = this.state;

    if (loading) {
      return <CircularProgress />;
    }

    if (players === undefined) {
      return null;
    }

    const rows = players.map(this.createRow);

    return <div className={styles.PlayerTable} data-testid="PlayerTable">
      <TableContainer>
        <Table sx={{ minWidth: 150 }} size="small" aria-label="a dense table">
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell align="right">Number</TableCell>
              <TableCell align="right">Team</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row, i: number) => (
              <TableRow
                key={i}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {row.name}
                </TableCell>
                <TableCell align="right">{row.number}</TableCell>
                <TableCell align="right">{row.team}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  }
}

export default PlayerTable;
