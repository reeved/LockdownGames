/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable react/forbid-prop-types */
/* eslint-disable react/require-default-props */
/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import { CircularProgress, AppBar, Tabs, Tab } from '@material-ui/core';
import Box from '@material-ui/core/Box';
import PokerStats from '../Stats/PokerStats';

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div role="tabpanel" hidden={value !== index} id={`simple-tabpanel-${index}`} aria-labelledby={`simple-tab-${index}`} {...other}>
      {value === index && <Box p={3}>{children}</Box>}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

const useStyles = makeStyles(() => ({
  root: {
    flexGrow: 1,
    color: 'white',
  },
}));

export default function SimpleTabs({ pokerStats, codenameStats, lastCardStats }) {
  const classes = useStyles();
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Tabs value={value} onChange={handleChange} aria-label="simple tabs example">
          <Tab label="CodeNames" {...a11yProps(0)} />
          <Tab label="Poker" {...a11yProps(1)} />
          <Tab label="Last Card" {...a11yProps(2)} />
        </Tabs>
      </AppBar>
      <TabPanel value={value} index={0}>
        {codenameStats || <CircularProgress />}
      </TabPanel>
      <TabPanel value={value} index={1}>
        {pokerStats ? <PokerStats pokerStats={pokerStats} /> : <CircularProgress />}
      </TabPanel>
      <TabPanel value={value} index={2}>
        {lastCardStats || <CircularProgress />}
      </TabPanel>
    </div>
  );
}
