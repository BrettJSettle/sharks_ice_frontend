import React, { FC } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';


import styles from './TableView.module.css';

interface Column {
  name: string,
  key?: string | Function
};

type Row = {
  [key: string]: any
};

interface TableViewProps {
  columns: Column[],
  rows: Row[]
};

const TableView: FC<TableViewProps> = (props) => {
  var header_cells = props.columns.map((column: Column, i: number) => {
    return <TableCell key={i} align={i === 0 ? "left" : "right"}>{column.name}</TableCell>
  });

  let makeTableRow = (row: Row, i: number) => {
    return (<TableRow
      key={i}
      sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
    >
      {props.columns.map((column: Column, j: number) => {
        let val: string = row[column.name];
        if (column.hasOwnProperty("key")) {
          if (typeof column.key === 'string') {
            val = row[column.key as string];
          } else if (typeof column.key === 'function') {
            let func: Function = column.key;
            val = func(row, i);
          }
        }
        // Add support for custom function or something.
        return <TableCell key={j} align={j === 0 ? "left" : "right"}>{val}</TableCell>
      })}
    </TableRow>);
  }

  return (
    <div className={styles.TableView} data-testid="TableView">
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              {header_cells}
            </TableRow>
          </TableHead>
          <TableBody>
            {props.rows.map((row: Row, i: number) => makeTableRow(row, i))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>);
}

export default TableView;
