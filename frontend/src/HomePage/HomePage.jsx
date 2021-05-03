/* eslint-disable react/jsx-no-duplicate-props */
import { React, useState, useContext } from 'react';
import { Redirect } from 'react-router-dom';
import { Grid, TextField, Button, makeStyles } from '@material-ui/core';
import styles from './HomePage.module.css';
import socket from '../Socket';
import { LobbyContext } from '../Context';

const useStyles = makeStyles({
  textField: {
    width: '80%',
  },
  input: {
    fontSize: 'calc(10px + 1.4vmin)',
    backgroundColor: `hsl(34, 57%, 70%)`,
  },
  button: {
    width: '100%',
    padding: '1em 0 1em 0',
    fontSize: 'calc(10px + 1vmin)',
    marginTop: '2em',
    backgroundColor: ({ lobbyCode }) => (lobbyCode ? 'Teal' : 'Coral'),
    '&:hover': {
      backgroundColor: ({ lobbyCode }) => (lobbyCode ? 'CadetBlue' : 'DarkSalmon'),
    },
  },
});

const HomePage = () => {
  const { state: lobbyState } = useContext(LobbyContext);
  const [nickname, setNickname] = useState('');
  const [lobbyCode, setCode] = useState('');
  const [nicknameError, setError] = useState(false);
  const [errorMsg, setErrorMsg] = useState(' ');

  const notValidID = lobbyState.lobbyID === null;
  const errorMsgID = notValidID && 'This lobby does not exist. Try another code, or create a Lobby.';

  const classes = useStyles({ lobbyCode });

  const userHasInput = (nickname || lobbyCode);

  const handleBtnClick = () => {
    if (lobbyCode) {
      socket.emit('join-lobby', nickname, lobbyCode);
    } else {
      socket.emit('create-lobby', nickname);
    }
  };

  const validateNickname = (text) => {
    if (/\s/.test(text)) {
      setError(true);
      setErrorMsg('Nicknames cannot have spaces.');
    } else {
      setError(false);
      setErrorMsg(' ');
      setNickname(text);
    }
  };


  if (lobbyState.lobbyID) {
    return <Redirect to="/lobby" />;
  }
  return (
    <div className={styles.container}>
      <h1>LOCKDOWN GAMES</h1>
      <Grid container spacing={3} justify="center">
        <Grid container item xs={12} md={4} lg={4} justify="flex-end" alignItems="center" style={{ marginBottom: '1.25rem' }}>
          <p>Nickname</p>
        </Grid>
        <Grid container item xs={12} md={8} lg={8} justify="flex-start">
          <TextField
            error={nicknameError}
            helperText={errorMsg}
            className={classes.textField}
            InputProps={{
              className: `${classes.input}`,
            }}
            inputProps={{ maxLength: 10 }}
            variant="outlined"
            onChange={(e) => validateNickname(e.target.value)}
          />
        </Grid>
        <Grid container item xs={12} md={4} lg={4} justify="flex-end" alignItems="center">
          <p>Lobby Code</p>
        </Grid>
        <Grid container item xs={12} md={8} lg={8} justify="flex-start">
          <TextField
            error={notValidID}
            helperText={errorMsgID}
            className={classes.textField}
            InputProps={{
              className: classes.input,
            }}
            inputProps={{ maxLength: 6 }}
            variant="outlined"
            value={lobbyCode}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
          />
        </Grid>
        <Grid item xs={12} md={6} lg={6}>
        {userHasInput && <Button type="button" className={`${classes.button}`} variant="contained" disabled={nicknameError || !nickname} onClick={handleBtnClick}>
            {lobbyCode ? `Join Lobby` : `Create Lobby`}
          </Button>}
        </Grid>
      </Grid>
      <p>{lobbyState.validID}</p>
    </div>
  );
};

export default HomePage;
