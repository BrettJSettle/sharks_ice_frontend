import React, { useState, useEffect } from 'react';
import ListSubheader from '@mui/material/ListSubheader';
import ListItem from '@mui/material/ListItem';
import Checkbox from '@mui/material/Checkbox';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';

import { BACKEND} from './constants'

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

export default function DivisionList({setTeams}) {
  // List of divisions with teams.
  let [divisions, setDivisions] = useState([]);
  // List of teams selected by user.
  let [selectedTeams, setSelectedTeams] = useState([]);

  useEffect(() => {
    fetch(BACKEND + '/api/divisions?season_id=0')
    .then(response => response.json())
    .then(data => {
      setDivisions(data['divisions']);
    }).catch(error => {
      console.error('Error fetching data:', error);
    });
    }, []);

  useEffect(() => {
    let team_ids = [...selectedTeams].map(t => t['id'])
    setTeams(team_ids);
  }, [selectedTeams]);

  let div_teams = [];
  divisions.forEach(division => {
    const {
      division_id,
      conference_id,
      name,
      teams,
    } = division;
    const id = division_id + "-" + conference_id
    div_teams.push({
      type: 'division',
      name: name,
      id: id,
    });
    teams.forEach(team => {
      div_teams.push({
        type: 'team',
        name: team['name'],
        id: team['team_id'],
      });
    });
  });

  return (
    <Autocomplete
      multiple
      id="team-select"
      disableCloseOnSelect
      getOptionLabel={(option) => option.name}
      onChange={(_, newValue) => setSelectedTeams(newValue)}
      value={selectedTeams}
      isOptionEqualToValue={(option, value) => option['id'] == value['id']}
      options={div_teams}
      renderOption={(props, option, { selected }) => {
        const { key, ...optionProps } = props;
        if (option.type == "division") {
          return <ListSubheader key={key}>{option.name}</ListSubheader>;
        }
        return (
          <ListItem key={key} {...optionProps}>
            <Checkbox
              icon={icon}
              checkedIcon={checkedIcon}
              style={{ marginRight: 8 }}
              checked={selected}
            />
            {option.name}
          </ListItem>
        );
      }}
      renderInput={(params) => (
        <TextField {...params} label="Division Teams" placeholder="Teams" />
      )}
    />
  );
}