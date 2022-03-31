import React, { FC } from 'react';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import styles from './ListSelect.module.css';

interface ListSelectProps {
  options: string[],
  onChange?(n: string): any 
}

const ListSelect: FC<ListSelectProps> = (props: ListSelectProps) => {
  const [selected, setSelected] = React.useState(0);

  let step = (n: number) => {
    setSelected(n + selected);
    let value = props.options[n + selected];
    if (!!props.onChange) {
      props.onChange(value);
    }
  };

  return (
    <Box className={styles.ListSelect} data-testid="ListSelect">
      <Stack spacing={2} direction="row" alignItems="center"
        justifyContent="center">
        <Button
          disabled={selected === 0}
          onClick={() => step(-1)}>
          <ChevronLeftIcon fontSize="large" />
        </Button>
        <Typography variant="h4" minWidth="10em">{props.options[selected]}</Typography>
        <Button
          disabled={selected === props.options.length - 1}
          onClick={() => step(1)}>
          <ChevronRightIcon fontSize="large" />
        </Button>
      </Stack>
    </Box>
  );
}

export default ListSelect;
