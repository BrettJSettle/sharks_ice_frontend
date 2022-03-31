import React, { FC } from 'react';
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import styles from './FooterLinks.module.css';

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
      <Link href="http://github.com/brettjsettle/sharks_ice_api">Backend API</Link>
      <Link href="http://github.com/brettjsettle/sharks_ice_frontend">Frontend</Link>
    </Box>
  </div>
);

export default FooterLinks;
