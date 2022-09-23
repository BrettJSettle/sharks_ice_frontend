import React, { FC } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import styles from './FooterLinks.module.css';
import { getSeason } from '../../common/util';
import { BACKEND_API } from '../../common/types';

interface FooterLinksProps {}

const FooterLinks: FC<FooterLinksProps> = () => (
  <div className={styles.FooterLinks} data-testid="FooterLinks">
    <Box
      sx={{
        typography: 'body1',
        '& > :not(style) + :not(style)': {
          ml: 2,
        },
      }}
    >
      <Typography>Season ID: {getSeason()}</Typography>
      <Link href={BACKEND_API}>Backend API</Link>
      <Link href="http://github.com/brettjsettle/sharks_ice_api">Backend API Github</Link>
      <Link href="http://github.com/brettjsettle/sharks_ice_frontend">Frontend Github</Link>
    </Box>
  </div>
);

export default FooterLinks;
