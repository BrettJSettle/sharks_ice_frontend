import React, { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { BACKEND } from './constants'

function formatDate(date) {
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const year = String(date.getFullYear()).slice(-2);   

  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');

  return `${month}/${day}/${year} ${hours}:${minutes}`;   

}

function GameTable({ teams, upcomingOnly }) {
  const [allGames, setAllGames] = useState([]);
  const [games, setGames] = useState([]);

  useEffect(() => {
    if (upcomingOnly) {
        const now = Date.now();
        setGames(allGames.filter(game => game['start_time'] > now));
    } else {
      setGames(allGames);
    }
  }, [upcomingOnly, allGames])

  useEffect(() => {
    if (!teams) {
      setGames([]);
      return;
    }
    fetch(BACKEND + "/api/games?team_ids=" + [...teams].join(','))
    .then(response => response.json())
    .then(response => response.map(game => {
      game['start_time'] = new Date(game['start_time']);
      return game;
    }))
    .then(allGames => {
      setAllGames(allGames)
    })
    .catch(error => {
      console.log(error);
    })
  }, [teams]);

  const columns = [
    { field: 'game_id', 
      headerName: 'ID' ,
      width: 70,
      renderCell: (props) => {
        return (<a href={"https://stats.sharksice.timetoscore.com/oss-scoresheet?game_id=" + props.value}>{props.value}</a>);
      }
     },
    { field: 'start_time', headerName: 'Time', 
      renderCell: (props) => formatDate(props.value),
      type: 'dateTime', width: 150},
    { field: 'rink', headerName: 'Rink', width: 120 },
    { field: 'level', headerName: 'Level', width: 100 },
    { field: 'home', headerName: 'Home', width: 200 },
    { field: 'away', headerName: 'Away', width: 200 },
  ];
  return (
    <DataGrid
      disableColumnMenu
      disableColumnResize
      disableColumnSorting
      sx={{minWidth: '80%', minHeight: '400px'}}
      pageSizeOptions={[10, 30, 50]}
      initialState={
        {pagination: { paginationModel: { pageSize: 30 } },
        sorting: {
          sortModel: [{ field: 'start_time', sort: 'asc' }],
        },
      }}
      rows={games}
      columns={columns}
      getRowId={row => row['game_id']}
      autoHeight />
  );
}

export default GameTable;